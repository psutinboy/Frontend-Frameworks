import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../authInterceptor";

const BlogList = () => {

  const [blogs, setBlogs] = useState([]);

  // Load saved tasks when the component mounts.
  useEffect(() => {
    getBlogList()
  }, []);

  // Updates localStorage every time taskList changes.

  const getBlogList = () => {
    api.get('blog')
      .then(response => {
        if (!response.data.length) {
          return <p>No blogs available. Please add some blogs.</p>;
        }
        setBlogs(response.data)
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="blog-list-container">
      <h2>All Blogs</h2>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div className="blog-item" key={blog._id}>
            <h3>{blog.title}</h3>
            <p>{blog.content.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog._id}`} className="read-more-link">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
