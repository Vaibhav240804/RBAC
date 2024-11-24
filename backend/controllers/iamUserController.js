const IAMUser = require("../models/IAMUser");
const User = require("../models/User");
const { generateIAMCredentials } = require("../utils/generateIAM");

exports.createIAMUser = async (req, res) => {
  try {
    const rootUserId = req.user.id; 
    const { iamUsername, roles } = req.body;

    const existingIAMUser = await IAMUser.findOne({
      iamUsername,
      createdBy: rootUserId,
    });

    if (existingIAMUser) {
      return res
        .status(400)
        .json({ message: "IAM user already exists with this username" });
    }

    const { accountId, password } = generateIAMCredentials();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newIAMUser = await IAMUser.create({
      iamUsername,
      accountId,
      password: hashedPassword,
      createdBy: rootUserId,
      roles,
    });

    await User.findByIdAndUpdate(rootUserId, {
      $push: { iamUsers: newIAMUser._id },
    });


    res.status(201).json({
      message: "IAM user created successfully",
      iamUser: {
        iamUsername: newIAMUser.iamUsername,
        accountId: newIAMUser.accountId,
      },
      password, 
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating IAM user", error: err.message });
  }
};


exports.getIAMUsers = async (req, res) => {
  try {
    const rootUserId = req.user.id; 

    const iamUsers = await IAMUser.find({ createdBy: rootUserId }).populate(
      "roles"
    );
    res.status(200).json(iamUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching IAM users", error: err.message });
  }
};


exports.deleteIAMUser = async (req, res) => {
  const { iamUserId } = req.params;

  try {
    const rootUserId = req.user.id; T

    const iamUser = await IAMUser.findOne({
      _id: iamUserId,
      createdBy: rootUserId,
    });

    if (!iamUser) {
      return res
        .status(404)
        .json({ message: "IAM user not found or unauthorized" });
    }

    await IAMUser.findByIdAndDelete(iamUserId);


    await User.findByIdAndUpdate(rootUserId, {
      $pull: { iamUsers: iamUserId },
    });

    res.status(200).json({ message: "IAM user deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting IAM user", error: err.message });
  }
};
