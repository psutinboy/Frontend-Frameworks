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

module.exports = router;
