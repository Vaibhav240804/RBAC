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
    check("permissions").isArray(),
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
    check("roles").isArray(),
    check("user").notEmpty(),
  ]),
    assignRolesToUser
);

router.get(
    "/roles",
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
    getRolesByUserId
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
