import React from "react";
import "../styles.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; 2024 BookHub. Made with ❤️ for book lovers.</p>
        <div className="footer-links">
          <a href="#about" className="footer-link">
            About
          </a>
          <a href="#contact" className="footer-link">
            Contact
          </a>
          <a href="#privacy" className="footer-link">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
