import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const Login = () => {
  const { authStates, setUser, setAuthStates } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  if(authStates.isLoading) return <div>
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-white via-purple-50 to-purple-200">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    </div></div>;

  if(authStates.isAuthenticated) return <Navigate to={from} replace />;


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
      credentials: 'include'
    });
    const data = await res.json();
    console.log(data);
    if(data.success) {
      console.log(data.user.token);
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
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-white via-purple-50 to-purple-200">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Sign in to continue building your resume
            </p>
          </div>

          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
          />

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-black hover:text-gray-700">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login