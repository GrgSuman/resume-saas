import { Navigate, Outlet, useLocation } from "react-router";

export const PrivateRoute = () => {
  const isAuthenticated = true; // Change this to true to test the other path
  const location = useLocation();

 return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};
