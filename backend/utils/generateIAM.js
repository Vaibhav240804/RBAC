const crypto = require("crypto");
const IAMUser = require("../models/IAMUser");

exports.generateIAMCredentials = async () => {
  let isUnique = false;
  let accountId, password;

  while (!isUnique) {
    accountId = crypto.randomBytes(4).toString("hex");
    password = crypto.randomBytes(8).toString("base64");

    const existingIAMUser = await IAMUser.findOne({ accountId });
    if (!existingIAMUser) {
      isUnique = true;
    }
  }

  return { accountId, password };
};
