import { createContext, useEffect, useState } from "react";
import { manageLocalStorage } from "../../lib/localstorage";
import { CREDIT_COSTS } from "../../lib/constants";
import axiosInstance from "../../api/axios";

type User = {
    id: string;
    name: string;
    email: string;
    picture: string;
    token: string;
    role: string;
    credits: number;
    isPaidUser?: boolean;
}

type AuthStates = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

type AuthContextType = {
    user: User | null,
    authStates: AuthStates,
    setUser: (user: User | null) => void,
    setAuthStates: (authStates: AuthStates) => void,
    deductCredits: (creditType?: string) => void
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const [authStates, setAuthStates] = useState<AuthStates>({
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    const resetUserState = () => {
        manageLocalStorage.remove('token');
        setUser(null);
        setAuthStates({
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    }

    const deductCredits = (creditType?: string) => {
        if (user) {
            setUser(prev => {
                if (!prev) return null;
                return { ...prev, credits: creditType ?  prev.credits - CREDIT_COSTS[creditType as keyof typeof CREDIT_COSTS] : 0 };
            });
        }
    }

    useEffect(() => {
        const validateToken = async () => {
            setAuthStates(prev => ({ ...prev, isLoading: true }));
            
            const token = manageLocalStorage.get('token');
          
            // if token is not found, set user to null and set auth states to false
            if (!token) {
                setAuthStates(prev => ({ ...prev, isLoading: false }));
                return;
            }

            // if token is found, validate it
            try {
                const res = await axiosInstance.get('/auth/validate');
                const data = res.data;

                if (data.success) {
                    // Token is valid (or was refreshed by interceptor)
                    setUser(data.user);
                    setAuthStates({
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } else {
                    console.log("Validation failed");
                    // Other validation errors
                    resetUserState();
                }
            } catch (error: unknown) {
                // Axios interceptor handles auth-related 400/401 errors globally (removes token and redirects)
                // Check if error has response (not a network error)
                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { status?: number; config?: { url?: string } } };
                    const status = axiosError.response?.status;
                    const requestUrl = axiosError.response?.config?.url || '';
                    
                    // If 401, interceptor will try to refresh token automatically
                    // If refresh fails, interceptor redirects to /signin
                    // If 400 from /auth/validate, interceptor redirects to /signin
                    // In both cases, page is redirecting, so just reset state (though redirect happens first)
                    if (status === 401 || (status === 400 && requestUrl.includes('/auth/validate'))) {
                        resetUserState();
                        return;
                    }
                    
                    // Other 400 errors (not auth-related) - don't logout, just reset state
                    if (status === 400) {
                        setUser(null);
                        setAuthStates({
                            isAuthenticated: false,
                            isLoading: false,
                            error: 'Validation failed. Please try again.'
                        });
                        return;
                    }
                }
                
                // Handle network errors (no response) - don't remove token for network issues
                console.error('Token validation error:', error);
                setUser(null);
                setAuthStates({
                    isAuthenticated: false,
                    isLoading: false,
                    error: 'Network error. Please check your connection.'
                });
            }
        };

        validateToken();
    }, []);
    

    return (
        <AuthContext.Provider value={{
            user,
            authStates,
            setUser,
            setAuthStates,
            deductCredits
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;