const Role = require("../models/Role");
const Permission = require("../models/Permission");
const User = require("../models/User");
const IAMUser = require("../models/IAMUser");
const Resource = require("../models/Resource");

exports.checkPermission = async (req, res, next) => {
  try {
    const { user, isRoot } = req.body;
    const { resourceName } = req.params;
    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
    } else {
      creator = await IAMUser.findById(userId);
    }
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }
    const resource = await Resource.findOne({ name: resourceName }).populate(
      "permissions"
    );
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    let roles = [];
    let hasPermission = false;
    if (isRoot) {
      roles = await User.findById(userId).populate("roles");
    } else {
      roles = await IAMUser.findById(userId).populate("roles");
    }

    for (const role of roles) {
      const rolePermissions = role.permissions;
      for (const permission of rolePermissions) {
        if (resource.permissions.includes(permission)) {
          hasPermission = true;
          break;
        }
      }
    }

    if (!hasPermission) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    return res.status(200).json({ message: "Access granted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, permissionIds, user } = req.body;

    if (!name || !permissionIds || !user) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const creator = user._id;

    const dbUser = await User.findById(creator);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRole = await Role.findOne({ name });

    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const permissions = await Permission.find({
      _id: { $in: permissionIds },
    });
    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({ message: "Some permissions are invalid" });
    }

    const role = new Role({
      name,
      permissions,
      createdBy: creator,
    });

    await role.save();

    const roles = await Role.find({ createdBy: creator }).populate(
      "permissions",
      "name description"
    );

    res.status(201).json({ message: "Role created successfully", roles });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.assignRolesToUser = async (req, res) => {
  const { userId, roleIds, user } = req.body;

  try {
    const isCreator = await User.findOne({ _id: user._id });

    console.log(isCreator);

    if (!isCreator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const roles = await Role.find({ _id: { $in: roleIds } });

    const dbuser = await IAMUser.findByIdAndUpdate(
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

exports.getRolesByUserId = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
    } else {
      creator = await IAMUser.findById(userId);
    }
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }
    const roles = await Role.find({ createdBy: creator }).populate(
      "permissions",
      "name description"
    );

    res.status(200).json(roles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    const { roleId } = req.params;

    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
    } else {
      creator = await IAMUser.findById(userId);
    }
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({
      _id: roleId,
      createdBy: creator,
    }).populate("permissions", "name description");

    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(role);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { user, isRoot } = req.body;

    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
    } else {
      creator = await IAMUser.findById(userId);
    }

    if (!creator) {
      res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({
      _id: roleId,
      createdBy: creator,
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await Role.findByIdAndDelete(roleId);
    await IAMUser.updateMany({ roles: roleId }, { $pull: { roles: roleId } });
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
