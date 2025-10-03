const express = require("express");
const router = express.Router();
const userModel = require("../models/user");

app.post("/", async (req, res) => {
  try {
    const { name, age, address } = req.body;
    
    if (!name || !age || !address) {
      return res.status(400).json({ message: "Name, age, and address are required" });
    }

    const user = await userModel.create({ name, age, address });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get("/", async (req, res) => {
  try {
  const users = await userModel.find();
  res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

module.exports = router;