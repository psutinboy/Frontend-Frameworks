const express = require("express");
const app = express.Router();
const Task = require("../taskModel");

// 1. Get All Tasks
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
});

// 2. Get Task by ID
app.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the task", error });
  }
});

// 3. Create a New Task
app.post("/", async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is empty" });
    }

    const newTask = new Task({ title, priority, dueDate });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
  }
});

// 4. Update a Task by ID
app.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the fields passed in the request body
      { new: true, runValidators: true } // Return the updated document and run schema validations
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
});

// 5. Delete a Task by ID
app.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

module.exports = app;
