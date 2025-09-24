import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddComment = () => {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [blogId, setBlogId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!user || !text || !blogId) {
      setError("All fields are required!");
      return;
    }

    // Mock comment creation logic - replace with API call
    const newComment = {
      id: Math.floor(Math.random() * 1000),
      user,
      text,
      blogId: parseInt(blogId),
      createdAt: new Date().toISOString(),
    };

    console.log("New Comment Created:", newComment);

    // Redirect to comments list after successful submission
    alert(`Comment by "${user}" added successfully!`);
    navigate("/comments/list");
  };

  return (
    <div className="add-comment-container">
      <h3>Add New Comment</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user">Your Name:</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="blogId">Blog ID:</label>
          <input
            type="number"
            id="blogId"
            value={blogId}
            onChange={(e) => setBlogId(e.target.value)}
            placeholder="Enter blog ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="text">Comment:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your comment"
          />
        </div>

        <button type="submit" className="btn-submit">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default AddComment;
