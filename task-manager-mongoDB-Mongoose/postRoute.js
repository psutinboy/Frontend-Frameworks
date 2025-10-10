const express = require("express");
const app = express.Router();
const { User, Post } = require("./userSchema");

// 1. Get All Posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
});

// 2. Get Post by ID
app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the post", error });
  }
});

// 3. Create a New Post and Associate with User
app.post("/:userId", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.params.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new post
    const newPost = new Post({ title, content });
    await newPost.save();

    // Add post reference to user's posts array
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({
      message: "Post created and associated with user",
      post: newPost,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating post", error });
  }
});

// 4. Update a Post by ID
app.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: "Error updating post", error });
  }
});

// 5. Delete a Post by ID
app.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove post reference from all users
    await User.updateMany(
      { posts: req.params.id },
      { $pull: { posts: req.params.id } }
    );

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

module.exports = app;
