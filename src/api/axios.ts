// api/axios.ts
import axios from "axios";
import API_BASE_URL from "../constants/apiURL/API_BASE_URL";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = true;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            { API_BASE_URL } + "/auth/refresh",
            {
              refreshToken,
            },
          );
          localStorage.setItem("accessToken", data.accessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.replace("/");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
