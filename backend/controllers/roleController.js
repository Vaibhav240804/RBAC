const Role = require("../models/Role");
const Permission = require("../models/Permission");
const User = require("../models/User");
const IAMUser = require("../models/IAMUser");

exports.createRole = async (req, res) => {
  try {
    const { name, permissions, user } = req.body;

    if (!name || !permissions || !user) {
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
      return res
        .status(400)
        .json({ message: "Role with this name already exists" });
    }

    const existingPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    if (existingPermissions.length !== permissions.length) {
      return res.status(404).json({ message: "Some permissions are invalid" });
    }

    const role = new Role({
      name,
      permissions,
      createdBy: creator,
    });

    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.assignRolesToUser = async (req, res) => {
  try {
    const { userId, roles, user } = req.body;

    if (!user) {
      return res.status(400).json({
        message: "Root user not found",
      });
    }

    const assigner = user._id;

    if (!userId || !roles) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const dbuser = await IAMUser.findById(userId);
    if (!dbuser) return res.status(404).json({ message: "User not found" });

    const assignerUser = await User.findById(assigner);

    if (!assignerUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRoles = await Role.find({
      _id: { $in: roles },
      createdBy: assigner,
    });

    if (existingRoles.length !== roles.length) {
      return res.status(404).json({ message: "Some roles are invalid" });
    }

    dbuser.roles = [...new Set([...user.roles, ...roles])];
    await dbuser.save();

    res.status(200).json({ message: "Roles assigned successfully", dbuser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getRolesByUserId = async (req, res) => {
  try {
    const { user, isRoot } = req.body;
    const userId = user._id;
    let creator;
    if (isRoot) {
      creator = User.findById(userId);
    } else {
      creator = IAMUser.findById(userId);
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
      creator = User.findById(userId);
    } else {
      creator = IAMUser.findById(userId);
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
      creator = User.findById(userId);
    } else {
      creator = IAMUser.findById(userId);
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
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
