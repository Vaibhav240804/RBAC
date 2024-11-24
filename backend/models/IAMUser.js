const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const iamUserSchema = new mongoose.Schema(
  {
    iamUsername: { type: String, required: true, unique: true },
    accountId: { type: String, required: true },
    password: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

iamUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

iamUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("IAMUser", iamUserSchema);
