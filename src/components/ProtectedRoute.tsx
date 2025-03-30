import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  inverted?: boolean; // If true, prevents access when logged in
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  inverted,
}) => {
  const { isAuthenticated } = useAuth();

  if (inverted) {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to home.");

      return <Navigate to="/" replace />;
    }
  } else {
    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to login.");

      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
