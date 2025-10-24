import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../authInterceptor";
import { getUserFromToken, hasRole } from "../utils/roleCheck";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has admin role
    const user = getUserFromToken();
    if (!user || !hasRole([1])) {
      navigate("/unauthorized");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("user");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 403) {
        navigate("/unauthorized");
      } else {
        setError("Failed to load users");
      }
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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`user/${userId}`);
      alert("User deleted successfully");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="admin-panel-container">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel - User Management</h2>
      <p className="panel-description">
        Manage all users in the system. Only accessible by Admins.
      </p>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName || "N/A"}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {getRoleName(user.role)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate("/")} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default AdminPanel;
