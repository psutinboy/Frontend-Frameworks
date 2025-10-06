const mongoose = require("mongoose");

// define the post schema
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  fetchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
