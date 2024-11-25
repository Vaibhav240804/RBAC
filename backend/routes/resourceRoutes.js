const express = require("express");
const { validate } = require("../middlewares/validationMiddleware");
const { param } = require("express-validator");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkPermission } = require("../controllers/roleController");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  validate([
    param("resourceName", "Resource name is required")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ]),
  checkPermission
);

module.exports = router;
