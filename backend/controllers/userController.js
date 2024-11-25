const User = require("../models/User");
const Role = require("../models/Role");
const IAMUser = require("../models/IAMUser");

// create a new IAM user

exports.createIAMUser = async (req, res) => {
  const { iamUsername, accountId, roles } = req.body;

  try {
    const { user } = req.body;

    const iamUser = new IAMUser({
      iamUsername,
      accountId,
      roles,
      createdBy: user._id,
    });

    await iamUser.save();

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { iamUsers: iamUser._id },
    });

    res.status(201).json({ message: "IAM user created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

exports.toggleStatus = async (req, res) => {
  const { iamUserId } = req.body;

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

exports.assignRolesToUser = async (req, res) => {
  const { userId, roleIds, user } = req.body;

  try {
    const isCreator = await User.findOne({
      _id: user._id,
      iamUsers: { $in: [userId] },
      roles: { $in: roleIds },
    });

    if (!isCreator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const roles = await Role.find({ _id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
      return res.status(400).json({ message: "Invalid role IDs provided" });
    }

    const dbuser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { roles: { $each: roleIds } } },
      { new: true }
    ).populate("roles");

    if (!dbuser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Roles assigned to user", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 

exports.getAllUsers = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    if (!isRoot) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const iamusers = await IAMUser.find({
      createdBy: user._id,
    }).populate("roles");

    res.status(200).json({
      message: "All users fetched successfully",
      users: iamusers,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteIAMUser = async (req, res) => {
  const { iamUserId } = req.params;

  try {
    const { user, isRoot } = req.body;
    const userId = user._id;

    if (!isRoot) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const iamUser = await IAMUser.findOneAndDelete({
      _id: iamUserId,
      createdBy: userId,
    });

    if (!iamUser) {
      return res.status(404).json({ message: "IAM user not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { iamUsers: iamUserId },
    });

    res.status(200).json({ message: "IAM user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
