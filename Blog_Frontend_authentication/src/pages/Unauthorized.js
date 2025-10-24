import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1 className="error-code">403</h1>
        <h2>Access Denied</h2>
        <p>
          You do not have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <div className="button-group">
          <button onClick={() => navigate("/")} className="btn-primary">
            Go to Home
          </button>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
