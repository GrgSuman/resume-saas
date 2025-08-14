import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import ResumeDetail from "./pages/resume/ResumeDetail";
import "./App.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/BaseLayout";
import { PrivateRoute } from "./pages/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import UserDetails from "./pages/profile/UserDetails";
import Credits from "./pages/credits/Credits";
import SuccessPage from "./pages/credits/SuccessPage";
import Home from "./pages/home/Home";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
       <Toaster />
      <GoogleOAuthProvider clientId="620421156218-5b2p94rdcismn2eqr8afggor7tqd2sum.apps.googleusercontent.com">
        <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/signin" element={<Login />} />
                <Route path="/" element={<Home />} />
              </Route>

              {/* Dashboard and Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" index element={<Dashboard />} />
                <Route path="/dashboard/credits" element={<Credits />} />
                <Route path="/dashboard/resume/:id" element={<ResumeDetail />} />
                <Route path="/dashboard/profile" element={<UserDetails />} />
              </Route>

            <Route path="/dashboard/credits/success" element={<SuccessPage />} />

            </Routes>


          {/* </ResumeProvider> */}
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
