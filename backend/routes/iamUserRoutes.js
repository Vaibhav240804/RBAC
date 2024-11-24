const express = require("express");
const {
  createIAMUser,
  getIAMUsers,
  deleteIAMUser,
} = require("../controllers/iamUserController");
const { authenticate } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate([
    check("iamUsername").notEmpty(),
    check("password").isLength({ min: 6 }),
    check("roles").isArray(),
  ]),
  createIAMUser
);

router.get("/", authenticate, getIAMUsers);

router.delete("/:iamUserId", authenticate, deleteIAMUser);

module.exports = router;
