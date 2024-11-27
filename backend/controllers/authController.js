const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const IAMUser = require("../models/IAMUser");
const Role = require("../models/Role");
dotenv.config();

class UserController {
  constructor() {}

  generateOTP() {
    return crypto.randomInt(100000, 999999);
  }

  sendEmail = async (email, otp) => {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });

      let mailOptions = {
        from: `YourApp <${process.env.MAIL}>`,
        to: email,
        subject: "OTP for Verification",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #4CAF50;">Your OTP for Verification</h2>
        <p style="font-size: 16px;">Your OTP for verification is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
        <p style="font-size: 14px; color: #777;">Please use this OTP to complete your verification process.</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  };

  validateToken = async (req, res) => {
    try {
      const { user, isRoot } = req.body;
      let dbUser;
      if (isRoot) {
        dbUser = await User.findById(user._id);
      } else {
        dbUser = await IAMUser.findById(user._id);
      }
      if (!dbUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = jwt.sign(
        {
          user: user,
          isRoot: isRoot,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );

      let createdRoles;
      if (isRoot) {
        createdRoles = await Role.find({ creator: dbUser._id });
      }
      const roles = await dbUser.populate("roles");

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 12 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      let iamUsers = [];
      if (isRoot) {
        iamUsers = dbUser.iamUsers;
      }

      res.status(200).json({
        message: "Token validated successfully",
        user: user,
        isRoot: true,
        roles: roles,
        iamUsers: iamUsers,
        createdRoles: createdRoles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log(email, otp);
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      console.log("OTP verified successfully");

      user.otp = "";
      await user.save();

      const token = jwt.sign(
        {
          user: user,
          isRoot: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );

      const resUser = await user.populate("roles");

      const createdRoles = await Role.find({ creator: user._id });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 12 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({
        message: "OTP verified successfully",
        user: resUser,
        roles: resUser.roles,
        iamUsers: resUser.iamUsers,
        createdRoles: createdRoles,
        isRoot: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  signup = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const alreadyExists = await User.findOne({ email });
      if (alreadyExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      let accountId = crypto.randomBytes(8).toString("hex");
      while (
        await User.findOne({
          accountId,
        })
      ) {
        accountId = crypto.randomBytes(8).toString("hex");
      }

      const newUser = new User({
        username,
        email,
        accountId,
        password,
      });

      await newUser.save();
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  signin = async (req, res) => {
    console.log(req.body);
    const { email, password, isRoot } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      if (isRoot) {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const isValid = await user.comparePassword(password);
        console.log("entered in root signin");
        if (!isValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const otp = this.generateOTP();
        console.log("generated otp", otp);
        user.otp = otp;
        await user.save();
        await this.sendEmail(user.email, otp);

        res.json({
          message: "Login successful, OTP sent to email",
          isRoot: true,
        });
      } else {
        const { iamUsername, accountId, password } = req.body;
        if (!iamUsername || !accountId || !password) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const iamUser = await IAMUser.findOne({ iamUsername, accountId });
        console.log("entered in IAM signin");
        if (!iamUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const isValid = await iamUser.comparePassword(password);

        if (!isValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const reSuser = await iamUser.populate("roles");
        const token = jwt.sign(
          {
            user: iamUser,
            isRoot: false,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "12h",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 12 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.json({
          message: "Login successful",
          user: reSuser,
          roles: reSuser.roles,
          username: iamUsername,
          accountId: accountId,
          isRoot: false,
        });
      }
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  };
}

module.exports = new UserController();
