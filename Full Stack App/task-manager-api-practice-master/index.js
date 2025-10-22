require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.use("/user", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
