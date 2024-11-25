const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    accountId: {
      type: String,
      unique: true,
      sparse: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: [],
      },
    ],
    iamUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "IAMUser", default: [] },
    ],
    otp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function (roleName) {
  return this.roles.some((role) => role.name === roleName);
};

userSchema.methods.getPermissions = async function () {
  const populatedUser = await this.populate(
    "roles",
    "permissions"
  ).execPopulate();
  const permissions = new Set();
  populatedUser.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.add(permission.name);
    });
  });
  return Array.from(permissions);
};

module.exports = mongoose.model("User", userSchema);
