const express = require("express");
const router = express.Router();
const userModel = require("../userModel");
const postModel = require("../postModel");

router.post("/", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      age,
      city,
      role,
      refreshToken,
      posts = [],
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !age ||
      !city ||
      !role ||
      !refreshToken
    ) {
      return res.status(400).json({
        message:
          "All fields are required: firstname, lastname, email, password, age, city, role, refreshToken",
      });
    }

    // Create the user first
    const user = await userModel.create({
      firstname,
      lastname,
      email,
      password,
      age,
      city,
      role,
      refreshToken,
    });

    // Create posts if provided
    let createdPosts = [];
    if (posts && posts.length > 0) {
      const postsWithUserId = posts.map((post) => ({
        ...post,
        userId: user._id,
      }));
      createdPosts = await postModel.create(postsWithUserId);

      // Update user with post IDs
      user.posts = createdPosts.map((post) => post._id);
      await user.save();
    }

    // Populate posts in the response
    const userWithPosts = await userModel.findById(user._id).populate("posts");
    res.status(201).json(userWithPosts);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find().populate("posts");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// Get a specific user by ID with populated posts
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await userModel.findById(id).populate("posts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

// Delete a user by ID (also deletes all their posts)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find the user first
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all posts associated with this user
    await postModel.deleteMany({ userId: id });

    // Delete the user
    await userModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "User and all associated posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Update a specific post by ID
router.put("/:userId/posts/:postId", async (req, res) => {
  try {
    const { userId, postId } = req.params;
    const { title, content } = req.body;

    // Validate ObjectId formats
    if (
      !userId.match(/^[0-9a-fA-F]{24}$/) ||
      !postId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate required fields
    if (!title && !content) {
      return res.status(400).json({
        message: "At least one field (title or content) is required for update",
      });
    }

    // Find and update the post
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    const post = await postModel.findOneAndUpdate(
      { _id: postId, userId: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or doesn't belong to this user" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post: post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Delete a specific post by ID
router.delete("/:userId/posts/:postId", async (req, res) => {
  try {
    const { userId, postId } = req.params;

    // Validate ObjectId formats
    if (
      !userId.match(/^[0-9a-fA-F]{24}$/) ||
      !postId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and delete the post
    const post = await postModel.findOneAndDelete({
      _id: postId,
      userId: userId,
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or doesn't belong to this user" });
    }

    // Remove post ID from user's posts array
    await userModel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

module.exports = router;
