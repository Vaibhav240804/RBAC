const express = require("express");
const { validate } = require("../middlewares/validationMiddleware");
const { param } = require("express-validator");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  checkPermission,
  getResources,
} = require("../controllers/roleController");
const { check } = require("express-validator");

const router = express.Router();

router.get(
  "/:resourceName",
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

router.get(
  "/",
  verifyToken,
  validate([
    check("user", "User is required").not().isEmpty(),
    check("isRoot", "isRoot is required").not().isEmpty(),
  ]),
  getResources
);

module.exports = router;
