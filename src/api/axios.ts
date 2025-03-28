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
    const accessToken = localStorage.getItem("accessToken"); // Use accessToken
    if (accessToken) {
      console.log("inside request interceptor =>" + accessToken);
      config.headers.Authorization = accessToken;
    }
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

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            },
          );

          //TODO get access tokens from response Authorization header
          const newToken = response.data.data[0].refreshToken; // Expecting new access token
          localStorage.setItem("refeshToken", newToken); // Store new Access Token

          const accessToken = response.headers["authorization"];
          // Retry the original request with the new access token
          originalRequest.headers["Authorization"] = accessToken;
          return axios(originalRequest);
        } catch (err) {
          console.error("Error refreshing token:", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
