import React from "react";
import "../styles.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">📚 BookHub</h1>
          <p className="app-subtitle">Discover your next great read</p>
        </div>
      </div>
    </header>
  );
}
