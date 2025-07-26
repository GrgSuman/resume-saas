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
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-md w-full border-4 border-black p-8 bg-white">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-center mb-4">LOADING...</h1>
        <div className="h-1 w-full bg-black mb-6"></div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
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
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white border-4 border-black p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
              WELCOME BACK
            </h1>
            <p className="text-lg text-gray-600 font-mono">
              // Sign in to continue building your resume
            </p>
          </div>

          {/* Google Login Button - Wrapped for brutalist styling */}
          <div className="flex justify-center mb-8">
            <div className=" transition-all duration-200">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 border-t-4 border-black pt-6">
            <p className="text-sm text-gray-600 font-mono">
              Don't have an account? No problem just continue with google above
              
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-600 font-mono">
            By signing in, you agree to our{' '}
            <a href="#" className="underline font-black hover:text-[#00E0C6]">TERMS</a>
            {' '}and{' '}
            <a href="#" className="underline font-black hover:text-[#00E0C6]">PRIVACY</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login