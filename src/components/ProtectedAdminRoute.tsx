import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("refreshToken");

  if (!token || userRole !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;
