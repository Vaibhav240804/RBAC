const express = require("express");
const {
  createPermission,
  getAllPermissions,
  deletePermission,
} = require("../controllers/permissionController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate([
    check("name").notEmpty().trim().escape(),
    check("description").optional().trim().escape(),
    check("isCustom").optional().isBoolean(),
    check("basePermissions").optional().isArray(),
  ]),
  createPermission
);

router.get("/", verifyToken, 
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  getAllPermissions
);

router.delete("/:permissionId", verifyToken, deletePermission);

module.exports = router;
