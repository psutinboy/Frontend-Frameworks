require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const userRoutes = require("./userRoute");
const postRoutes = require("./postRoute");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use("/user", userRoutes);
app.use("/post", postRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
