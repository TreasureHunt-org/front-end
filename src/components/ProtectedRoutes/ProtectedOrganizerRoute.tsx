import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedOrganizerRouteProps {
  children: React.ReactNode;
}

const ProtectedOrganizerRoute: React.FC<ProtectedOrganizerRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles?.includes("ADMIN") && !roles?.includes("ORGANIZER")) {
    return <Navigate to="/" replace />;
  }
  // organizer is not an admin  , admin is an organizer
  return <>{children}</>;
};

export default ProtectedOrganizerRoute;
