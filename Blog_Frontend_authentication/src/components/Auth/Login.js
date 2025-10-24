import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      const { token, refreshToken } = response.data;

      // Option 1: Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Option 2: Store in HTTP-only cookie (requires server-side setup)
      // The server should set the cookie in the response headers
      // document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
      // document.cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict`;

      return response.data;
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(username, password);
      console.log("Login successful:", result);
      localStorage.setItem("user", true);
      // Redirect or update UI as needed
      navigate("/"); // Redirect to the protected route after login
    } catch (error) {
      // Handle login error (e.g., show error message to user)
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="register-link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")}>Create one here</span>
      </p>
    </div>
  );
};

export default Login;
