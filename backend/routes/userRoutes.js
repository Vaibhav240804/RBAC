const express = require("express");
const {
  getAllUsers,
  assignRolesToUser,
  deleteIAMUser,
  toggleStatus,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();


router.post(
  "/toggle-status",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("iamUserId").isMongoId().withMessage("Invalid IAM user ID"),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  toggleStatus
)

router.get(
  "/",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  getAllUsers
);

router.delete(
  "/:iamUserId",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
    check("iamUserId").isMongoId().withMessage("Invalid IAM user ID"),
  ]),
  deleteIAMUser
);


router.post(
  "/assign-roles",
  verifyToken,
  validate([
    check("user").notEmpty(),
    check("userId").isMongoId().withMessage("Invalid user ID"),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
    check("rolesids").isArray().withMessage("Roles must be an array"),
    check("rolesIds.*").isMongoId().withMessage("Invalid role ID"),
  ]),
  assignRolesToUser
)

module.exports = router;
