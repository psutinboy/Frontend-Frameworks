import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../authInterceptor";
import { getUserFromToken } from "../utils/roleCheck";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userInfo = getUserFromToken();
      if (!userInfo || !userInfo.userId) {
        setError("Unable to retrieve user information");
        setLoading(false);
        return;
      }

      const response = await api.get(`user/${userInfo.userId}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load profile information");
      setLoading(false);
    }
  };

  const getRoleName = (roleNumber) => {
    const roles = {
      1: "Admin",
      2: "Customer",
      3: "Worker",
    };
    return roles[roleNumber] || "Unknown";
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/")} className="btn-back">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user && (
        <div className="profile-details">
          <div className="profile-field">
            <label>First Name:</label>
            <span>{user.firstName}</span>
          </div>
          {user.lastName && (
            <div className="profile-field">
              <label>Last Name:</label>
              <span>{user.lastName}</span>
            </div>
          )}
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <label>Mobile:</label>
            <span>{user.mobile}</span>
          </div>
          {user.address && (
            <div className="profile-field">
              <label>Address:</label>
              <span>{user.address}</span>
            </div>
          )}
          <div className="profile-field">
            <label>Role:</label>
            <span className="role-badge">{getRoleName(user.role)}</span>
          </div>
        </div>
      )}
      <button onClick={() => navigate("/")} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
