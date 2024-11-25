const express = require("express");
const { signin, signup, verifyOtp } = require("../controllers/authController");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  validate([
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
    check("username").notEmpty().trim().isString().isLength({ min: 3 }),
  ]),
  signup
);

router.post(
  "/login",
  validate([
    check("email").isEmail(),
    check("password").notEmpty().trim(),
    check("iamUsername").optional().isString().trim().escape(),
    check("accountId").optional().isString().trim().escape(),
    check("isRoot").isBoolean(),
  ]),
  signin
);

router.post(
  "/validate-otp",
  validate([
    check("email").notEmpty().trim().isEmail(),
  ]),
  verifyOtp
);

module.exports = router;
