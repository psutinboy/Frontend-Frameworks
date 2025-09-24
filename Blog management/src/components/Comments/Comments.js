import React from "react";
import { Link, Outlet } from "react-router-dom";

const Comments = () => {
  return (
    <div className="comments-container">
      <h2>Comments Management</h2>
      <nav className="comments-nav">
        <Link to="list" className="nav-link">
          View Comments
        </Link>
        <Link to="add" className="nav-link">
          Add Comment
        </Link>
      </nav>
      <div className="comments-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Comments;
