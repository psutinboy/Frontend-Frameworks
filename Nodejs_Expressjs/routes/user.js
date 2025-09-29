const express = require("express");
const router = express.Router();

// Get all customers for a specific user (more specific route goes first)
router.get("/:id([0-9]{4})/customers", (req, res) => {
  const { id } = req.params;
  res.send(`List of all customers of user id ${req.params.id}`);
});

// Route with multiple parameters and regular expression
router.get("/:year([0-9]{4})/:month([0-9]{2})", (req, res) => {
  const { year, month } = req.params;
  res.send(`Posts from Year: ${year}, Month: ${month}`);
});

// User profile with ID (more general route goes after specific ones)
router.get("/:id([0-9]{4})", (req, res) => {
  res.send(`User Profile for ID: ${req.params.id}`);
});

router.post("/:id([0-9]{4})", (req, res) => {
  const postData = req.body; //check authentication and connect to MongoDB
  res.send({ name: postData.firstname + postData.lastname });
});

// Route to handle text input
router.post("/:id([0-9]{4})/message", (req, res) => {
  const { id } = req.params;
  const textMessage = req.body;
  res.send({
    userId: id,
    message: `Received text message from user ${id}`,
    textContent: textMessage,
    length: textMessage.length,
  });
});

module.exports = router;
