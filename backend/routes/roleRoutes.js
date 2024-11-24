const express = require("express");
const {
  createRole,
  getRoleById,
  getRolesByUserId,
  assignRolesToUser,
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
    check("permissionIds").isArray().withMessage("Permissions must be an array"),
    check("permissionIds.*").isMongoId().withMessage("Invalid permission ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  createRole
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
    "/",
    verifyToken,
    validate([
        check("user").notEmpty(),
        check("user._id").isMongoId().withMessage("Invalid user ID"),
    ]),
    getRolesByUserId
)
router.get(
    "/role/:roleId",
    verifyToken,
    validate([
        check("user").notEmpty(),
        check("user._id").isMongoId().withMessage("Invalid user ID"),
        param("roleId").notEmpty().isMongoId().withMessage("Invalid role ID"),
    ]),
    getRoleById
)

router.delete(
  "deleterole/:roleId",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
    param("roleId").notEmpty().isMongoId().withMessage("Invalid role ID"),
  ]),
  getRoleById
);

module.exports = router;
