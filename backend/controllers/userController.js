const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const IAMUser = require("../models/IAMUser");

exports.assignRolesToUser = async (req, res) => {
  const { userId, roleIds } = req.body;

  try {
    const roles = await Role.find({ _id: { $in: roleIds } });
    if (roles.length !== roleIds.length) {
      return res.status(400).json({ message: "Invalid role IDs provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { roles: { $each: roleIds } } },
      { new: true }
    ).populate("roles");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Roles assigned to user", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.assignPermissionsToUser = async (req, res) => {
  const { userId, permissionIds } = req.body;

  try {
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      return res
        .status(400)
        .json({ message: "Invalid permission IDs provided" });
    }

    const user = await User.findById(userId).populate("roles");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tempRole = {
      name: `TempRole-${user.username}-${Date.now()}`,
      permissions: permissionIds,
    };

    const role = new Role(tempRole);
    await role.save();

    user.roles.push(role._id);
    await user.save();

    res.status(200).json({ message: "Permissions assigned to user", user });
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
