import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import NewResume from "./pages/resume/NewResume";
import { ResumeProvider } from "./context/resume/ResumeContext";
import Home from "./pages/home/Home";
import "./App.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/BaseLayout";
import { PrivateRoute } from "./pages/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="620421156218-1vl05kpbr9ljs8uqok8pssamo40qaa0o.apps.googleusercontent.com">
        <AuthProvider>
          <ResumeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Dashboard and Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" index element={<Dashboard />} />
                <Route path="/dashboard/resume/:id" element={<NewResume />} />
              </Route>
            </Routes>
          </ResumeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
