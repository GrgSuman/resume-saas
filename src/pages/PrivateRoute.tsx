import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import CircularLoadingIndicator from "../components/sections/CircularLoadingIndicator";
import { manageLocalStorage } from "../lib/localstorage";

export const PrivateRoute = () => {
  const { authStates } = useAuth();
  const location = useLocation();
  const token = manageLocalStorage.get('token');

  // Show loading state while authentication is being validated
  if (authStates.isLoading) {
    return (
      <CircularLoadingIndicator />
    );
  }

  return token ? <Outlet /> : <Navigate to="/signin" state={{ from: location }} replace />;
};
