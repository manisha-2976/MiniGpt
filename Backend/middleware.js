import jwt from "jsonwebtoken";
import User from "./models/Users.js";
import Thread from "./models/Thread.js";

export const isLoggedIn = async (req, res, next) => {
 const token = req.cookies.token;
 if (!token) {
    console.log("no token")
    return res.status(401).json({ message: "Not authenticated" });
  }
 try{
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  req.user = user;
  console.log("user logged in:");
  next();
 } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const userLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.userId = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch {
    req.userId = null;
  }
  next();
};


export const isOwner = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    if (!req.user || thread.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
