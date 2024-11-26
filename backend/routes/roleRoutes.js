const express = require("express");
const {
  createRole,
  getRoleById,
  getRolesByUserId,
  assignRolesToUser,
  deleteRole,
  removePermissionFromRole,
  addPermissionToRole,
} = require("../controllers/roleController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { check, param } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate([
    check("name").notEmpty().trim().escape(),
    check("permissionIds")
      .isArray()
      .withMessage("Permissions must be an array"),
    check("permissionIds.*").isMongoId().withMessage("Invalid permission ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  createRole
);

router.get(
  "/",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  getRolesByUserId
);

router.post(
  "/assign-roles",
  verifyToken,
  validate([
    check("userId").isMongoId().withMessage("Invalid user ID"),
    check("roleIds.*").isMongoId().withMessage("Invalid role ID"),
    check("user").notEmpty(),
  ]),
  assignRolesToUser
);

router.get(
  "/:roleId",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
    param("roleId").isMongoId().withMessage("Invalid role ID"),
  ]),
  getRoleById
);

router.delete(
  "/:roleId",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
    param("roleId").notEmpty().isMongoId().withMessage("Invalid role ID"),
  ]),
  deleteRole
);

router.post(
  "/remove-permission",
  verifyToken,
  validate([
    check("roleId").isMongoId().withMessage("Invalid role ID"),
    check("permissionId").isMongoId().withMessage("Invalid permission ID"),
    check("user").notEmpty(),
    check("isRoot").equals("true"),
  ]),
  removePermissionFromRole
)

router.post(
  "/add-permission",
  verifyToken,
  validate([
    check("roleId").isMongoId().withMessage("Invalid role ID"),
    check("permissionId").isMongoId().withMessage("Invalid permission ID"),
    check("user").notEmpty(),
    check("isRoot").equals("true"),
  ]),
  addPermissionToRole
)

module.exports = router;
