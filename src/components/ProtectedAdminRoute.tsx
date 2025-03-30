import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
