import { Route, Routes } from "react-router";
import Dashboard from "./pages/dashboard/Dashboard";
import NewResume from "./pages/resume/NewResume";
import { ResumeProvider } from "./context/resume/ResumeContext";
import Home from "./pages/home/Home";
import "./App.css";
import Login from "./pages/auth/Login";
import Layout from "./components/layouts/BaseLayout";
import { PrivateRoute } from "./pages/PrivateRoute";

function App() {
  return (
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
            <Route path="/dashboard/new" element={<NewResume />} />
          </Route>
          
      </Routes>
    </ResumeProvider>
  );
}

export default App;
