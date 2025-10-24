import { jwtDecode } from "jwt-decode";

/**
 * Decodes the JWT token and returns user information
 * @returns {Object|null} User object with userId and role, or null if token is invalid
 */
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    const decoded = jwtDecode(token);
    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Checks if the current user has one of the required roles
 * @param {Array<number>} requiredRoles - Array of role numbers (0=Developer, 1=Admin, 2=Customer)
 * @returns {boolean} True if user has one of the required roles
 */
export const hasRole = (requiredRoles) => {
  const user = getUserFromToken();
  if (!user || user.role === undefined) {
    return false;
  }
  return requiredRoles.includes(user.role);
};

/**
 * Gets the role name from role number
 * @param {number} roleNumber - Role number (1, 2, or 3)
 * @returns {string} Role name
 */
export const getRoleName = (roleNumber) => {
  const roles = {
    1: "Admin",
    2: "Customer",
    3: "Worker",
  };
  return roles[roleNumber] || "Unknown";
};

/**
 * Checks if the token is expired
 * @returns {boolean} True if token is expired or invalid
 */
export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return true;
    }
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
