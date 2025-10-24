const express = require("express");
const app = express.Router();
const User = require("../userModel");
const roleCheck = require("../roleCheck");

// 1. Get All Users - Admin only
app.get("/", roleCheck([1]), async (req, res) => {
  try {
    const tasks = await User.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// 2. Get User by ID - Users can view their own profile, Admins can view any profile
app.get("/:id", roleCheck([1, 2, 3]), async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check if user is trying to access their own profile OR is an admin
    if (currentUserId !== requestedUserId && currentUserRole !== 1) {
      return res.status(403).json({
        message: "Access denied. You can only view your own profile.",
      });
    }

    const task = await User.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user", error });
  }
});

// 3. Create a New User - Admin only
app.post("/", roleCheck([1]), async (req, res) => {
  try {
    const { firstName, lastName, email, address, mobile } = req.body;

    const userTask = new User({ firstName, lastName, email, address, mobile });

    await userTask.save();
    res.status(201).json(userTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// 4. Update User by ID - Users can update their own profile, Admins can update any profile
app.put("/:id", roleCheck([1, 2, 3]), async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Check if user is trying to update their own profile OR is an admin
    if (currentUserId !== requestedUserId && currentUserRole !== 1) {
      return res.status(403).json({
        message: "Access denied. You can only update your own profile.",
      });
    }

    const updatedTask = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the fields passed in the request body
      { new: true, runValidators: true } // Return the updated document and run schema validations
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// 5. Delete User by ID - Admin only
app.delete("/:id", roleCheck([1]), async (req, res) => {
  try {
    const deletedTask = await User.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = app;
