const Role = require("../models/Role");
const Permission = require("../models/Permission");
const User = require("../models/User");
const IAMUser = require("../models/IAMUser");
const Resource = require("../models/Resource");

exports.getResources = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
      const resources = await Resource.find();
      return res.status(200).json({ message: "Access granted", resources });
    } else {
      creator = await IAMUser.findById(userId);
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
    }
    const roles = await IAMUser.findById(userId).populate("roles");
    const resources = await Resource.find().populate("permissions");
    const allowedResources = resources.filter((resource) => {
      let hasPermission = false;
      for (const role of roles) {
        const rolePermissions = role.permissions;
        for (const permission of rolePermissions) {
          if (resource.permissions.includes(permission)) {
            hasPermission = true;
            break;
          }
        }
      }
      return hasPermission;
    });
    res
      .status(200)
      .json({ message: "Access granted", resources: allowedResources });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.checkPermission = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = await User.findById(userId);
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
      const resources = await Resource.find();
      return res.status(200).json({ message: "Access granted", resources });
    } else {
      const { resourceName } = req.params;
      creator = await IAMUser.findById(userId);
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
      const resource = await Resource.findOne({ name: resourceName }).populate(
        "permissions"
      );
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      let roles = await IAMUser.findById(userId).populate("roles");
      let hasPermission = false;

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

      res.status(200).json({ message: "Access granted", resource });
    }
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
    console.log("found data for role creation");

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

    console.log("role created");

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

    res.status(200).json({ message: "Roles assigned to user", iamUser: dbuser });
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

    console.log(roles);

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
    const roles = await Role.find({ createdBy: creator }).populate(
      "permissions",
      "name description"
    );
    res
      .status(200)
      .json({ message: "Role deleted successfully", roles: roles });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.removePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId, user } = req.body;

    const userId = user._id;
    const creator = await User.findById(userId);

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    const permission = await Permission.findById(permissionId);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    const role = await Role.findOne({
      _id: roleId,
      createdBy: creator,
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await Role.findByIdAndUpdate(roleId, {
      $pull: { permissions: permissionId },
    });

    res.status(200).json({ message: "Permission removed from role" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.addPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId, user } = req.body;

    const userId = user._id;
    const creator = await User.findById(userId);

    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    const permission = await Permission.findById(permissionId);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    const role = await Role.findOne({
      _id: roleId,
      createdBy: creator,
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await Role.findByIdAndUpdate(roleId, {
      $addToSet: { permissions: permissionId },
    });

    res.status(200).json({ message: "Permission added to role" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
