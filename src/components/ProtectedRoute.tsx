import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("refreshToken"); // 👈 Check if token exists

  if (!token) {
    console.warn("Access denied! Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
