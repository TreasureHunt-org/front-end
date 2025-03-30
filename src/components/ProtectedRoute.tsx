import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute.tsx
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRole && !user?.roles?.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
