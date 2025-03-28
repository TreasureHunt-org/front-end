import axios from "axios";
import API_BASE_URL from "../constants/API_BASE_URL";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding the Access Token in each request
api.interceptors.request.use(
  (config) => {
    // Skip adding Authorization header for login and signup endpoints
    if (
      config.url &&
      (config.url.includes("/auth/login") ||
        config.url.includes("/auth/signup"))
    ) {
      return config;
    }

    const accessToken = localStorage.getItem("accessToken"); // Use accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["ngrok-skip-browser-warning"] = true;
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor for handling expired Access Token and refreshing it
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is likely expired, so attempt to refresh it
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) return Promise.reject(error);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const newToken = response.data.data[0].refreshToken; // Expecting new access token
        const accessToken = response.data.data[0].accessToken; // Expecting new access token

        localStorage.setItem("refeshToken", newToken); // Store new Access Token
        localStorage.setItem("accessToken", accessToken); // Store new Access Token

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Error refreshing token:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
  },
);

export default api;
