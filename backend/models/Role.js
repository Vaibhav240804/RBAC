const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
