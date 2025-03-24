import axios from "axios";

const API_BASE_URL =
  "https://b965-92-253-108-63.ngrok-free.app/api/v1/treasure-hunt";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding the token in each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("refreshToken"); // Retrieve the refreshToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor for handling responses, especially for expired tokens
api.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  async (error) => {
    if (error.response?.status === 401) {
      // Token is likely expired, so attempt to refresh it
      const originalRequest = error.config;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          // Make a request to refresh the token
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
          );

          // If refresh is successful, store the new token
          const newToken = response.data.data[0].refreshToken;
          localStorage.setItem("refreshToken", newToken);

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axios(originalRequest); // Retry the failed request
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        // Redirect to login page if token refresh fails
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error); // If it's not a 401 error, reject the promise
  },
);

export default api;
