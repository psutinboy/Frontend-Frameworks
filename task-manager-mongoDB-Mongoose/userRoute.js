const express = require("express");
const app = express.Router();
const { User } = require("./userSchema");

// 1. Get All Users with Populated Posts
app.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("posts");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// 2. Get All Adults with Populated Posts
app.get("/getAdults", async (req, res) => {
  try {
    const users = await User.find({ age: { $gte: 18 } }).populate("posts");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// 3. Get User by ID with Populated Posts
app.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user", error });
  }
});

// 3. Create a New Task
app.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      mobile,
      age,
      password,
      city,
      role,
    } = req.body;

    const userTask = new User({
      firstName,
      lastName,
      email,
      address,
      mobile,
      age,
      password,
      city,
      role,
    });

    await userTask.save();
    res.status(201).json(userTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// 4. Update a Task by ID
app.put("/:id", async (req, res) => {
  try {
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

// 5. Delete a Task by ID
app.delete("/:id", async (req, res) => {
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
