const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");
const IAMUser = require("../models/IAMUser");
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

  verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

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

      res.status(200).json({ message: "OTP verified successfully", token });
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
        await this.sendEmail(user.email, otp);
        user.otp = otp;
        await user.save();

        res.json({
          message: "Login successful, OTP sent to email",
        });
      } else {
        const { iamUsername, accountId, password } = req.body;
        if (!iamUsername || !accountId || !password) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const iamUser = await IAMUser.findOne({ iamUsername, accountId });
        console.log("entered in IAM signin");
        if(!iamUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const isValid = await iamUser.comparePassword(password);
        
        if (!isValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

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

        res.json({ message: "Login successful", token });
      }
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

module.exports = new UserController();
