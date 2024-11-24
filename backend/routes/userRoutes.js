const express = require("express");
const {
  getAllUsers,
  assignRoles,
  deleteIAMUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();

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
  validate([check("userId").isMongoId(), check("roles").isArray()]),
  assignRoles
);

module.exports = router;
