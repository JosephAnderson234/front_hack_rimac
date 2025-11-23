import { AuthLoginResponse, LoginRequest, RegisterRequest } from '@/interfaces/auth';
import { login as loginService, register as registerService } from '@/services/auth';
import { tokenStorage } from '@/services/auth/storage';
import { router } from 'expo-router';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    signIn: (data: LoginRequest) => Promise<void>;
    signUp: (data: RegisterRequest) => Promise<void>;
    signOut: () => void;
    user: AuthLoginResponse | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: async () => { },
    signUp: async () => { },
    signOut: () => { },
    user: null,
    isLoading: false,
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<AuthLoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const accessToken = await tokenStorage.getAccessToken();
            const idToken = await tokenStorage.getIdToken();
            const userData = await tokenStorage.getUserData();

            if (accessToken && idToken && userData) {
                console.log('[AuthContext] Sesión restaurada');
                setUser({
                    acces_token: accessToken,
                    id_token: idToken,
                    email: userData.email,
                    role: userData.role,
                    message: 'Sesión restaurada'
                });
            }
        } catch (error) {
            console.error('[AuthContext] Error restaurando sesión:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (data: LoginRequest) => {
        setIsLoading(true);
        console.log('[AuthContext] signIn:', data);
        try {
            const response = await loginService(data);
            console.log('[AuthContext] signIn response:', response);
            setUser(response);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('[AuthContext] signIn error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (data: RegisterRequest) => {
        setIsLoading(true);
        console.log('[AuthContext] signUp:', data);
        try {
            const response = await registerService(data);
            console.log('[AuthContext] signUp response:', response);
            // Normalizamos la respuesta para que coincida con el estado de usuario
            setUser({
                acces_token: response.acces_token,
                id_token: response.id_token,
                email: response.usuario.email,
                role: response.usuario.role,
                message: response.message
            });
            router.replace('/(tabs)');
        } catch (error) {
            console.error('[AuthContext] signUp error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await tokenStorage.clearTokens();
        setUser(null);
        // @ts-ignore
        router.replace('/sign-in');
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signUp,
                signOut,
                user,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
