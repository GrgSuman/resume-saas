import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import CircularLoadingIndicator from "../components/sections/CircularLoadingIndicator";

export const PrivateRoute = () => {
  const { authStates } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being validated
  if (authStates.isLoading) {
    return (
      <CircularLoadingIndicator />
    );
  }

  return authStates.isAuthenticated ? <Outlet /> : <Navigate to="/signin" state={{ from: location }} replace />;
};
