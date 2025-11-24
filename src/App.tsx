import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/BaseLayout";
import { PrivateRoute } from "./pages/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDetails from "./pages/profile/UserDetails";
import SuccessPage from "./pages/credits/SuccessPage";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
import DashboardNew from "./pages/dashboard/DashboardNew";
import ResumeList from "./pages/dashboard/resume/ResumeList";
import BaseDashboardLayout from "./pages/dashboard/components/BaseDashboardLayout";
import ResumeDetail from "./pages/dashboard/resume/resume-detail/ResumeDetail";
import { ResumeProvider } from "./pages/dashboard/context/ResumeContext";
import NotificationBannar from "./components/layouts/NotificationBannar";
import CoverLetterList from "./pages/dashboard/cover-letter/CoverLetterList";
import Pricing from "./pages/credits/Pricing";
// import Preference from "./pages/preferences/Preference";
import CoverDetail from "./pages/dashboard/cover-letter/cover-detail/CoverDetail";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
       <ToastContainer />
      <GoogleOAuthProvider clientId="620421156218-5b2p94rdcismn2eqr8afggor7tqd2sum.apps.googleusercontent.com">
        <AuthProvider>
          <NotificationBannar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route path="/signin" element={<Login />} />
                <Route path="/" element={<Home />} />
              </Route>

              {/* Dashboard and Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<BaseDashboardLayout/>}>
                  <Route index element={<DashboardNew />} />
                  <Route path="/dashboard/resume" element={<ResumeList />} />
                  <Route path="/dashboard/cover-letter" element={<CoverLetterList />} />
                  <Route path="/dashboard/pricing" element={<Pricing />} />
                  {/* <Route path="/dashboard/preferences" element={<Preference />} /> */}
                  <Route path="/dashboard/profile" element={<UserDetails />} />
                </Route>
                <Route path="/dashboard/resume/:id" element={
                  <ResumeProvider>
                    <ResumeDetail/>
                  </ResumeProvider>
                } />
              </Route>

            <Route path="/dashboard/cover-letter/:id" element={<CoverDetail />} />
            <Route path="/dashboard/credits/success" element={<SuccessPage />} />

            </Routes>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
