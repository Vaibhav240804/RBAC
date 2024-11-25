const IAMUser = require("../models/IAMUser");
const User = require("../models/User");
const { generateIAMCredentials } = require("../utils/generateIAM");
const Role = require("../models/Role");

exports.createIAMUser = async (req, res) => {
  try {
    const { user, iamUsername } = req.body;
    const rootUserId = user._id;
    const roles = req.body.roles || [];

    const existingIAMUser = await IAMUser.findOne({
      iamUsername,
      createdBy: rootUserId,
    });

    if (existingIAMUser) {
      return res
        .status(400)
        .json({ message: "IAM user already exists with this username" });
    }

    const { accountId, password } = await generateIAMCredentials();
    console.log("`iam cred", accountId, iamUsername, password);
    const newIAMUser = await IAMUser.create({
      iamUsername: iamUsername,
      accountId: accountId,
      password: password,
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
        password,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating IAM user", error: err.message });
  }
};

exports.toggleStatus = async (req, res) => {
  const { iamUserId } = req.params;

  try {
    const { user } = req.body;
    const userId = user._id;

    const iamUser = await IAMUser.findOne({
      _id: iamUserId,
      createdBy: userId,
    });

    if (!iamUser) {
      return res.status(404).json({ message: "IAM user not found" });
    }

    iamUser.isActive = !iamUser.isActive;
    await iamUser.save();

    res.status(200).json({ message: "IAM user status toggled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getIAMUsers = async (req, res) => {
  try {
    const { user } = req.body;
    const rootUserId = user._id;
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

exports.getAuser = async (req, res) => {
  try {
    const { user } = req.body;
    const { iamUsername } = req.params;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const rootUserId = user._id;

    const iamUser = await IAMUser.findOne({
      iamUsername,
      createdBy: rootUserId,
    }).populate("roles");

    if (!iamUser) {
      return res.status(404).json({ message: "IAM user not found" });
    }

    res.status(200).json(iamUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching IAM user", error: error.message });
  }
};

exports.deleteIAMUser = async (req, res) => {
  const { iamUserId } = req.params;

  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const rootUserId = user._id;

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
