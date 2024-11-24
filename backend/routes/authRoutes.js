const express = require("express");
const { signin, signup } = require("../controllers/authController");
const { validate } = require("../middlewares/validationMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  validate([
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ]),
  signup
);

router.post(
  "/login",
  validate([check("email").isEmail(), check("password").notEmpty()]),
  signin
);

module.exports = router;
