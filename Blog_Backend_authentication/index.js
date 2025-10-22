const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

require("dotenv").config();

console.log("JWT Secret:", process.env.JWT_SECRET);

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());

// Middleware
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

app.use("/user", userRoutes);

app.use("/blog", blogRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
