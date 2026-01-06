import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import { API_URL } from "../../lib/constants";
import CircularLoadingIndicator from "../../components/sections/CircularLoadingIndicator";

const Login = () => {
  const { authStates, setUser, setAuthStates } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  if (authStates.isLoading)
    return (
      <CircularLoadingIndicator />
    );

  if (authStates.isAuthenticated) return <Navigate to={from} replace />;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const baseURL = API_URL;
    const res = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", JSON.stringify(data.user.token));
      setUser(data.user);
      setAuthStates({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-10 py-12 md:px-16 md:py-14">
            <div className="text-center mb-10 space-y-4">
              <p className="text-sm uppercase text-slate-500">
                CloneCV
              </p>
              <h1 className="text-4xl font-semibold text-slate-900">
                Sign in to keep building
              </h1>
              <p className="text-base md:text-lg text-slate-600">
                Continue your AI-assisted resume and cover letter workflow.
              </p>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center mb-6">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log("Login Failed")}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="pill"
              />
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                No account yet? Continue with Google to get instant access.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-600">
              By signing in, you agree to our{" "}
              <a
                href="/terms"
                className="text-[#7060fc] hover:underline font-medium transition-colors"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#7060fc] hover:underline font-medium transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
