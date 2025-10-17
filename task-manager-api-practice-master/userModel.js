const { default: mongoose } = require("mongoose");

const userSchhema = new mongoose.Schema(
  {
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    age: { type: Number, required: false },
    city: { type: String, required: false },
    verified: { type: Boolean, default: false },
    posts: { type: Array, default: [] },
    role: { type: String, required: false },
    refreshToken: { type: String, required: false },
    address: { type: String, required: false },
    mobile: { type: Number, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchhema);
