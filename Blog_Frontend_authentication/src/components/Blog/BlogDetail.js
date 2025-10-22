import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../authInterceptor";

const BlogDetail = () => {
  const { id } = useParams(); // Extract the blog ID from the URL
  const navigate = useNavigate();

  const [blog, setBlog] = useState([]);

  // Load saved tasks when the component mounts.
  useEffect(() => {
    getBlogDetail()
  }, []);

  // Updates localStorage every time taskList changes.

  const getBlogDetail = () => {
    api.get('blog/' + id)
      .then(response => {
        if (!response.data) {
          return <p>No blogs available. Please add some blogs.</p>;
        }
        setBlog(response.data)
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="blog-detail-container">
      <h2>{blog.title}</h2>
      <p className="blog-author">
        Written by: {blog.createdBy || "Unknown"} | Posted on:{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="blog-content">{blog.content}</div>

      <button onClick={() => navigate("/blogs")} className="btn-back">
        Back to Blogs
      </button>
    </div>
  );
};

export default BlogDetail;
