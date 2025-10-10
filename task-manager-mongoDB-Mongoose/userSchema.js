const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profile = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  loggedIn: { type: Date, required: true },
});

// Define the Post Schema (for embedded and referenced relationships)
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const personalDetail = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/, // Simple regex for email validation
  },
  password: { type: String, required: true },
  age: {
    type: Number,
    min: [18, "Must be at least 18"],
    max: [65, "Must be under 65"],
    required: true,
  },
  city: { type: String, required: true },
  verified: { type: Boolean, default: false }, // Verification status
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Reference relationship to Posts
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: Number, enum: [0, 1, 2], required: true }, // 0: Owner, 1: Admin, 2: User
  refreshToken: { type: String }, // Store refresh token for session management
});

// Pre-save Hook: Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Virtual field: Full name
userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + (this.lastName || "");
});

// Schema methods: Custom method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Indexing for better query performance on age and city
userSchema.index({ age: 1, city: 1 });

// Example of custom validation
userSchema.path("age").validate(function (value) {
  return value >= 18 && value <= 65;
}, "Age must be between 18 and 65");

// Static method to find users over 18
userSchema.statics.findAdults = function () {
  return this.find({ age: { $gte: 18 } });
};

// Example aggregation: Find number of users by city
userSchema.statics.groupByCity = function () {
  return this.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

// Post Model
const Post = mongoose.model("Post", postSchema);

// User Model
const User = mongoose.model("User", userSchema);

module.exports = { User, Post };
