import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: "http://localhost:3001/", // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or get the token from your preferred storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional, for handling token expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (assuming server sends 401 status)
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("refreshToken");
        const response = await axios.post("http://localhost:3001/auth/token", {
          token,
        });
        const { accessToken } = response.data;

        localStorage.setItem("token", accessToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., logout user, redirect to login)
        console.error("Error refreshing token:", refreshError);
        // You might want to dispatch a logout action or redirect to login page here
      }
    }

    return Promise.reject(error);
  }
);

export default api;
