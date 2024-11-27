const express = require("express");
const {
  signin,
  signup,
  verifyOtp,
  logout,
  validateToken,
} = require("../controllers/authController");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/cookie-validate",
  verifyToken,
  validate([check("user").notEmpty()]),
  validateToken
);

router.post(
  "/signup",
  validate([
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("username").notEmpty().trim().isString().isLength({ min: 3 }),
  ]),
  signup
);

router.post(
  "/login",
  validate([
    check("email").optional().isEmail(),
    check("password").notEmpty(),
    check("iamUsername").optional().isString().trim().escape(),
    check("accountId").optional().isString().trim().escape(),
    check("isRoot").notEmpty(),
  ]),
  signin
);

router.post("/logout", verifyToken, logout);

router.post(
  "/validate-otp",
  validate([
    check("email").notEmpty().trim().isEmail(),
    check("otp").notEmpty().trim().isNumeric().isLength({ min: 6, max: 6 }),
  ]),
  verifyOtp
);

module.exports = router;
