import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import ResumeDetail from "./pages/resume/ResumeDetail";
import Home from "./pages/home/Home";
import "./App.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/BaseLayout";
import { PrivateRoute } from "./pages/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import UserProfile from "./pages/profile/UserProfile";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
       <Toaster />
      <GoogleOAuthProvider clientId="620421156218-5b2p94rdcismn2eqr8afggor7tqd2sum.apps.googleusercontent.com">
        <AuthProvider>
          {/* <ResumeProvider> */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Login />} />
              </Route>

              {/* Dashboard and Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" index element={<Dashboard />} />
                <Route path="/dashboard/resume/:id" element={<ResumeDetail />} />
                <Route path="/dashboard/profile" element={<UserProfile />} />
              </Route>
            </Routes>
          {/* </ResumeProvider> */}
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
