import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const PrivateRoute = () => {
  const { authStates } = useAuth();
  const location = useLocation();

 return authStates.isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
