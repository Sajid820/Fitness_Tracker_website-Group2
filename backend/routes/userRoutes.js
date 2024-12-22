const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

module.exports = (JWT_SECRET) => {
  // Middleware to Authenticate JWT
  const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };

  // Signup Route
  router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ email, password: hashedPassword, name });
      await newUser.save();

      // Generate JWT
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Error registering user", error });
    }
  });

  // Login Route
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  });

  // Update User Health Data Route
  router.post("/updateHealth", authenticateToken, async (req, res) => {
    const { weight, height, age, bmi, bmr } = req.body;

    try {
      // Find user by ID from decoded token
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user health data
      user.weight = weight || user.weight;
      user.height = height || user.height;
      user.bmi = bmi || user.bmi;
      user.bmr = bmr || user.bmr;
      user.age = age || user.age;

      await user.save();
      res.status(200).json({ message: "User health data updated successfully" });
    } catch (err) {
      console.error("Error updating health data:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Protected Route Example
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      // Find user by ID from decoded token
      const user = await User.findById(req.user.userId).select("-password"); // Exclude password from response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Access granted", user });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
