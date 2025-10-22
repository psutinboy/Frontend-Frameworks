// routes/auth.js
const express = require("express");
const router = express.Router(); // Use 'router', not 'app'

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../userModel");

// Register Route
router.post("/register", async (req, res) => {
  const { email, password, role, firstName, mobile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    role,
    firstName,
    mobile,
  });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    // Use process.env.JWT_SECRET
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" } // Longer lifespan
    );

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// Refresh Token Route
router.post("/token", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No token provided" });

  // Verify refresh token
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // Find the user associated with this token
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Issue a new access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

router.post("/logout", async (req, res) => {
  const { userId } = req.body;

  // Find user and remove refresh token
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router; // Export the router correctly
