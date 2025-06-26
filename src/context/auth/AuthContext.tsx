import { createContext, useState } from "react";

type AuthContextType = {
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        token: string;
        refreshToken: string;
        role: string;
    } | null;
    authStates:{
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    };
    setUser: (user: {
        id: string;
        name: string;
        email: string;
        image: string;
        token: string;
        refreshToken: string;
        role: string;
    }) => void;
    setAuthStates: (authStates: {
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    }) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{
        id: string;
        name: string;
        email: string;
        image: string;
        token: string;
        refreshToken: string;
        role: string;
    } | null>(null);

    const [authStates, setAuthStates] = useState<{
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    }>({
        isAuthenticated: true,
        isLoading: false,
        error: null
    });

    return (
        <AuthContext.Provider value={{ user, authStates, setUser, setAuthStates }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;