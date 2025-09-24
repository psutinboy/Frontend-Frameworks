import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!title || !content) {
      setError("Both title and content are required!");
      return;
    }

    // Mock blog creation logic - replace with API call
    const newBlog = {
      id: Math.floor(Math.random() * 1000),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    console.log("New Blog Created:", newBlog);

    // Redirect to blogs page after successful submission
    alert(`Blog "${title}" added successfully!`);
    navigate("/blogs");
  };

  return (
    <div className="add-blog-container">
      <h2>Add New Blog</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Blog Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Blog Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter blog content"
          />
        </div>

        <button type="submit" className="btn-submit">Add Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
