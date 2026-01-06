import { createContext, useEffect, useState } from "react";
import { manageLocalStorage } from "../../lib/localstorage";
import axiosInstance from "../../api/axios";

type Subscription = {
  plan: "FREE" | "STARTER" | "PRO";
  status: "ACTIVE" | "CANCELED";
};

type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
  token: string;
  role: string;
  subscription: Subscription;
};

type AuthStates = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthContextType = {
  user: User | null;
  authStates: AuthStates;
  setUser: (user: User | null) => void;
  setAuthStates: (authStates: AuthStates) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [authStates, setAuthStates] = useState<AuthStates>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const getUserBasedOnToken = async () => {
      const token = manageLocalStorage.get("token");
      if (!token) {
        setAuthStates((prev) => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        // Backend validates token automatically and returns user data
        const res = await axiosInstance.get("/auth/user");
        const data = res.data;
        setUser(data.user);
        setAuthStates({
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        // Axios interceptor handles 401 (token refresh) and auth-related 400 errors (redirects to /signin)
        // Only set error state for network errors or other non-auth errors
        console.error("Error fetching user:", error);
        setUser(null);
        setAuthStates({
          isAuthenticated: false,
          isLoading: false,
          error: "Error fetching user. Please try again.",
        });
      }
    };
    
    getUserBasedOnToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authStates,
        setUser,
        setAuthStates,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
