const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user, isRoot } = decoded;
    req.body.user = user;
    req.body.isRoot = isRoot;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
