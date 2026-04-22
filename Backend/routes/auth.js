import express from "express";
import User from "../models/Users.js";
import  { isLoggedIn } from "../middleware.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const isProd = process.env.NODE_ENV === "production";

const router = express.Router();

router.get("/me", isLoggedIn, (req, res) => {
  // console.log(req.user)
  res.json(req.user);
});

router.post("/login",  async (req, res) => {
  try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid Email" });
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("isMatch", isMatch);
  if (!isMatch) {
    return res.status(400).json({ message: "Wrong Password" });
  }
  // create token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/"
  });
  res.status(201).json({ message: "Login Successful", user });
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res) => {
  try {
  const { firstName, lastName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
  // create token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // send cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/"
  });

  res.status(201).json({ message: "Signup Successful", user });
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/logout", async (req, res) => {
  try {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = decoded.id;

  if (!token) {
    return res.json({ message: "Already Logged Out" })
  }
  console.log("user logging out");

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/"
  });

  res.status(200).json({
    message: "Logout successful"
  })
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;