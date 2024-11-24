const express = require("express");
const {
  createPermission,
  getAllPermissions,
  deletePermission,
} = require("../controllers/permissionController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  validate([
    check("name").notEmpty(),
    check("description").optional(),
    check("isCustom").optional().isBoolean(),
    check("basePermissions").optional().isArray(),
  ]),
  createPermission
);

router.get("/", verifyToken, getAllPermissions);

router.delete("/:permissionId", verifyToken, deletePermission);

module.exports = router;
