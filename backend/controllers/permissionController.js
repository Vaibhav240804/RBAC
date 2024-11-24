const Permission = require("../models/Permission");
const { validationResult } = require("express-validator");

exports.createPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, description, isCustom, basePermissions } = req.body;

    if (isCustom && basePermissions) {
      const existingBasePermissions = await Permission.find({
        _id: { $in: basePermissions },
      });
      if (existingBasePermissions.length !== basePermissions.length) {
        return res
          .status(404)
          .json({ message: "Some base permissions are invalid" });
      }
    }

    const permission = new Permission({
      name,
      description,
      isCustom: !!isCustom,
      basePermissions: basePermissions || [],
      createdBy: req.user.id,
    });

    await permission.save();
    res
      .status(201)
      .json({ message: "Permission created successfully", permission });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
      .populate("createdBy", "username")
      .populate("basePermissions", "name");
    res.status(200).json(permissions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;

    const permission = await Permission.findById(permissionId);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    if (!permission.isCustom) {
      return res
        .status(400)
        .json({ message: "Cannot delete a non-custom permission" });
    }

    await Permission.findByIdAndDelete(permissionId);
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
