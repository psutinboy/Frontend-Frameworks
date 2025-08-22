import React from "react";
import "../styles.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer">
        &copy; {currentYear} MovieDux. All rights reserved.
      </p>
    </footer>
  );
}
