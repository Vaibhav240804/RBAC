const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    isCustom: { type: Boolean, default: false }, 
    basePermissions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Permission" },
    ], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
