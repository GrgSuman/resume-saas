import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import { API_URL } from '../../lib/constants';

const Login = () => {
  const { authStates, setUser, setAuthStates } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  if(authStates.isLoading) return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-100 via-blue-50/60 to-amber-50/30 min-h-screen">
      {/* Blue-dominant gradient with top center focus */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base gradient layers - more blue dominant */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-blue-100/20 to-amber-100/25" />
        
        {/* Radial gradient orbs - blue at top center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(59,130,246,0.35)_0%,rgba(59,130,246,0.15)_40%,rgba(59,130,246,0.05)_70%,transparent_85%),radial-gradient(ellipse_at_20%_180%,rgba(37,99,235,0.25)_0%,rgba(37,99,235,0.08)_45%,transparent_75%),radial-gradient(ellipse_at_85%_200%,rgba(251,191,36,0.2)_0%,rgba(251,191,36,0.06)_50%,transparent_80%)]" />
        
        {/* Floating accent orbs - blue dominance */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[48rem] w-[48rem] rounded-full bg-gradient-to-br from-blue-300/20 to-blue-400/10 blur-3xl" />
        <div className="absolute top-1/4 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-blue-200/15 to-indigo-300/8 blur-3xl" />
        <div className="absolute bottom-1/3 -right-16 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-amber-200/12 to-yellow-300/6 blur-3xl animate-pulse" />
      </div>
      
      <div className="flex items-center justify-center px-6 min-h-screen">
        <div className="max-w-md w-full border-2 border-[#7060fc] p-8 bg-white/90 backdrop-blur rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Loading...</h1>
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-[#7060fc] mb-6 rounded"></div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if(authStates.isAuthenticated) return <Navigate to={from} replace />;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const baseURL = API_URL;  
    const res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
      credentials: 'include'
    });
    const data = await res.json();
    if(data.success) {
      localStorage.setItem('token', JSON.stringify(data.user.token));
      setUser(data.user);
      setAuthStates({
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-100 via-blue-50/60 to-amber-50/30 min-h-screen">
      {/* Blue-dominant gradient with top center focus */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base gradient layers - more blue dominant */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-blue-100/20 to-amber-100/25" />
        
        {/* Radial gradient orbs - blue at top center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(59,130,246,0.35)_0%,rgba(59,130,246,0.15)_40%,rgba(59,130,246,0.05)_70%,transparent_85%),radial-gradient(ellipse_at_20%_180%,rgba(37,99,235,0.25)_0%,rgba(37,99,235,0.08)_45%,transparent_75%),radial-gradient(ellipse_at_85%_200%,rgba(251,191,36,0.2)_0%,rgba(251,191,36,0.06)_50%,transparent_80%)]" />
        
        {/* Floating accent orbs - blue dominance */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[48rem] w-[48rem] rounded-full bg-gradient-to-br from-blue-300/20 to-blue-400/10 blur-3xl" />
        <div className="absolute top-1/4 -left-24 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-blue-200/15 to-indigo-300/8 blur-3xl" />
        <div className="absolute bottom-1/3 -right-16 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-amber-200/12 to-yellow-300/6 blur-3xl animate-pulse" />
      </div>

      <div className="flex items-center justify-center px-6 min-h-screen">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur  p-8 rounded-xl shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to CloneCV
              </h1>
              <p className="text-lg text-gray-600">
                Sign in to continue building your resume
              </p>
            </div>

            {/* Google Login Button - Wrapped for styling */}
            <div className="flex justify-center mb-8">
              <div className="transform transition-all duration-200 ">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Failed')}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="pill"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 border-t-2 border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Don't have an account? No problem just continue with google above
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-600">
              By signing in, you agree to our{' '}
              <a href="#" className="underline font-medium hover:text-[#7060fc] transition-colors">TERMS</a>
              {' '}and{' '}
              <a href="#" className="underline font-medium hover:text-[#7060fc] transition-colors">PRIVACY</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login