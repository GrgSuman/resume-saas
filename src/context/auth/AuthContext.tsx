import { createContext, useEffect, useState } from "react";
import { manageLocalStorage } from "../../lib/localstorage";
import { API_URL } from "../../lib/constants";

type User = {
    id: string;
    name: string;
    email: string;
    image: string;
    token: string;
    role: string;
}

type AuthStates = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

type AuthContextType = {
    user: User | null,
    authStates: AuthStates,
    setUser: (user: User) => void,
    setAuthStates: (authStates: AuthStates) => void,
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const [authStates, setAuthStates] = useState<AuthStates>({
        isAuthenticated: false,
        isLoading: false,
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
                const res = await fetch(`${API_URL}/auth/validate`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();

                if (data.success) {
                    // Token is valid
                    setUser(data.user);
                    setAuthStates({
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });
                } else if (data.message === 'Token expired') {
                    // Try to refresh token
                    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });
                    const refreshData = await refreshRes.json();
                    
                    if (refreshRes.ok && refreshData.success) {
                        manageLocalStorage.set('token', refreshData.token);
                        setUser(refreshData.user);
                        setAuthStates({
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                    } else {
                        console.log("Refresh failed");
                        // Refresh failed
                        resetUserState();
                    }
                } else {
                    console.log("Validation failed");
                    // Other validation errors
                    resetUserState();
                }
            } catch (error) {
                console.error('Token validation error:', error);
                manageLocalStorage.remove('token');
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
            setAuthStates
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;