const express = require("express");
const bodyParser = require("body-parser");
//const morgan = require('morgan');
//const loggerMiddleware = require("./middleware/logger");
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");

const app = express();
const port = 3000;

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // Add text parsing capability

// Third-party Middleware (Morgan) for logging
//app.use(morgan('dev'));

// Custom Middleware for Logging
//app.use(loggerMiddleware);

// Routes
app.use("/", indexRoutes);

app.all("/user/*", (req, res, next) => {
  console.log(`HTTP Method: ${req.method}`); //Handles all requests irrespective of header
  next();
});

app.use("/user", userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
