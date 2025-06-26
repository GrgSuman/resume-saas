import img from "../../assets/illustration.jpg"
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";

const Login = () => {
  const { authStates } = useAuth();

  if(authStates.isLoading) return <div>Loading...</div>;
  if(authStates.isAuthenticated) return <Navigate to="/dashboard" />;

  const handleSuccess = async (credentialResponse: any) => {
    console.log(credentialResponse);
    // // credentialResponse.credential is the Google ID token (JWT)
    // const res = await fetch('http://localhost:5000/api/auth/google', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token: credentialResponse.credential }),
    // });
    // const data = await res.json();
    // // Save your JWT (data.token) to localStorage/cookie, redirect, etc.
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-white via-purple-50 to-purple-200">
      <div className="max-w-md w-full">
        {/* Illustration */}
        <div className="flex justify-center mb-8">
          <img
            src={img}
            alt="Sign in illustration"
            className="h-40 w-auto object-contain"
            draggable={false}
          />
        </div>
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