const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profile = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loggedIn: { type: Boolean, required: true },
});

// define the post schema
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const personalDetailsSchema = new mongoose.Schema({
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
});

//define user schema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 65 },
  city: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: [0, 1, 2], required: true }, //0: Owner, 1: Admin, 2: User
  refreshToken: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.index({ age: 1, city: 1 });

//example of custom validation
userSchema.path("age").validate(function (value) {
  return value >= 18 && value <= 65;
}, "Age must be between 18 and 65");

// static method to find users over 18
userSchema.statics.findAdults = function () {
  return this.find({ age: { $gt: 18 } });
};

//example of aggregation: find number of users by city
userSchema.statics.countByCity = function () {
  return this.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

//example of virtual: find number of posts by user
userSchema.virtual("postsCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

module.exports = mongoose.model("User", userSchema);
