import React from "react";
import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  if (!blogs.length) {
    return <p>No blogs available. Please add some blogs.</p>;
  }

  return (
    <div className="blog-list-container">
      <h2>All Blogs</h2>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-item" key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.content.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog.id}`} className="read-more-link">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
