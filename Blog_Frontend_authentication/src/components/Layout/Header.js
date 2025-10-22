import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const isAuthenticated = true; // Replace with your authentication logic
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Blog Management</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/add-blog">Add Blog</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
