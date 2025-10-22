const express = require('express');
const app = express.Router();
const Blog = require('../blogModel');
const roleCheck = require('../roleCheck');

app.use(roleCheck([0, 1, 2]));

// 1. Get All Tasks
app.get('/', async (req, res) => {
    try {
        const tasks = await Blog.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs', error });
    }
});

// 2. Get Task by ID
app.get('/:id', async (req, res) => {
    try {
        const task = await Blog.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Blog is not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the blog', error });
    }
});

// 3. Create a New blog
app.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        const blogTask = new Blog({ title, content });

        await blogTask.save();
        res.status(201).json(blogTask);
    } catch (error) {
        res.status(400).json({ message: 'Error creating blog', error });
    }
});

// 4. Update a blog by ID
app.put('/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Update only the fields passed in the request body
            { new: true, runValidators: true } // Return the updated document and run schema validations
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: 'blog not found' });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: 'Error updating blog', error });
    }
});

// 5. Delete a Task by ID
app.delete('/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully', deletedTask: deletedBlog });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error });
    }
});

module.exports = app;
