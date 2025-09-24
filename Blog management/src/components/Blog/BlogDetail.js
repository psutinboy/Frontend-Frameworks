import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = ({ blogs }) => {
  const { id } = useParams(); // Extract the blog ID from the URL
  const navigate = useNavigate();

  // Find the blog post by its ID
  const blog = blogs.find((blog) => blog.id === parseInt(id));

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <h2>Blog Not Found</h2>
        <p>The blog you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate("/blogs")} className="btn-back">
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <h2>{blog.title}</h2>
      <p className="blog-author">
        Written by: {blog.author || "Unknown"} | Posted on:{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <p className="blog-categories">
        Categories: {blog.categories?.join(", ") || "General"}
      </p>
      <p className="blog-content">{blog.content}</p>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {blog.comments?.length ? (
          blog.comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>
                <strong>{comment.user}:</strong> {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      <button onClick={() => navigate("/blogs")} className="btn-back">
        Back to Blogs
      </button>
    </div>
  );
};

export default BlogDetail;
