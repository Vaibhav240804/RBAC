const express = require("express");
const {
  createIAMUser,
  getIAMUsers,
  deleteIAMUser,
} = require("../controllers/iamUserController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate([
    check("iamUsername").notEmpty().trim().escape(),
    check("password").isLength({ min: 6 }),
    check("roles").isArray(),
    check("roles.*").isMongoId().withMessage("Invalid role ID"),
    check("user").notEmpty(),
    check("user._id").isMongoId().withMessage("Invalid user ID"),
  ]),
  createIAMUser
);

router.get("/", authenticate, getIAMUsers);

router.delete("/:iamUserId", authenticate, deleteIAMUser);

module.exports = router;
