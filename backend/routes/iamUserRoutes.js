const express = require("express");
const {
  createIAMUser,
  getIAMUsers,
  deleteIAMUser,
  getAuser,
  toggleStatus, 
} = require("../controllers/iamUserController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validationMiddleware");
const { check, param } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate([
    check("iamUsername").notEmpty().trim().escape(),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  createIAMUser
);

router.get(
  "/",
  verifyToken,
  validate([check("user").notEmpty().withMessage("Root User is required")]),
  getIAMUsers
);

router.post(
  "/toggle-status/:iamUserId",
  verifyToken,
  validate([
    param("iamUserId")
      .notEmpty()
      .trim()
      .isMongoId()
      .withMessage("Invalid IAM user ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  toggleStatus
)

router.get(
  "/:iamUsername",
  verifyToken,
  validate([
    check("iamUsername")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Invalid IAM user ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  getAuser
);

router.delete(
  "/:iamUserId",
  verifyToken,
  validate([
    check("iamUserId")
      .notEmpty()
      .trim()
      .isMongoId()
      .withMessage("Invalid IAM user ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  deleteIAMUser
);

module.exports = router;
