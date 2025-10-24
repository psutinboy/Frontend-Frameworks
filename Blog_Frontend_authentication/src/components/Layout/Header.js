import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRoleName, getUserFromToken, hasRole } from "../../utils/roleCheck";

const Header = () => {
  const isAuthenticated = !!localStorage.getItem("user");
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully!");
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
                <Link to="/profile">Profile</Link>
              </li>
              {/* Show Admin Panel link only to Admins */}
              {hasRole([1]) && (
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout {user && `(${getRoleName(user.role)})`}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
