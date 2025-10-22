const express = require("express");
const app = express.Router();
const User = require("../userModel");

// Get all users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// Get a user by ID
app.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user", error });
  }
});

// Create a new user
app.post("/", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      age,
      city,
      verified,
      posts,
      role,
      address,
      mobile,
    } = req.body;
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      age,
      city,
      verified,
      posts,
      role,
      address,
      mobile,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// Update a user by ID
app.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the fields passed in the request body
      { new: true, runValidators: true } // Return the updated document and run schema validations
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// Delete a user by ID
app.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = app;
