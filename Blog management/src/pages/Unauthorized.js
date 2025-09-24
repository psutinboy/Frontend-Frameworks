import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h2>403 - Unauthorized Access</h2>
      <p>You don't have permission to access this page.</p>
      <p>Please contact your administrator if you believe this is an error.</p>
      <div className="unauthorized-actions">
        <Link to="/" className="btn-back">
          Go to Home
        </Link>
        <Link to="/login" className="btn-back">
          Login with Different Account
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
