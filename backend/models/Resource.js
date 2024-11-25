const mongoose = require("mongoose");
const Permission = require("./Permission");

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
