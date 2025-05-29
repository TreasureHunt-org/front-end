import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  inverted?: boolean;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  inverted,
}) => {
  const { isAuthenticated } = useAuth();

  if (inverted) {
    if (isAuthenticated) {
      console.log("User is authenticated");

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
