import { LoginRequest, RegisterRequest } from '@/interfaces/auth';
import {
    login as apiLogin,
    logout as apiLogout,
    register as apiRegister,
    getCurrentUser,
    isAuthenticated,
} from '@/services/auth';
import { logger } from '@/utils/logger';
import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Datos del usuario autenticado
 */
export interface User {
  email: string;
  name?: string;
  role: string;
}

/**
 * Tipo del contexto de autenticación
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticación
 * Maneja el estado global de autenticación de la aplicación
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verifica si hay una sesión activa al iniciar la app
   */
  const checkAuth = async () => {
    logger.log('[Auth] Verificando sesión...');
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const userData = await getCurrentUser();
        setUser(userData);
        logger.log('[Auth] Sesión activa encontrada');
      } else {
        logger.log('[Auth] No hay sesión activa');
      }
    } catch (error) {
      logger.error('[Auth] Error verificando sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia sesión con email y contraseña
   */
  const login = async (data: LoginRequest) => {
    const response = await apiLogin(data);
    setUser({
      email: response.email,
      role: response.role,
    });
    logger.log('[Auth] Usuario autenticado');
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (data: RegisterRequest) => {
    const response = await apiRegister(data);
    setUser({
      email: response.usuario.email,
      name: response.usuario.name,
      role: response.usuario.role,
    });
    logger.log('[Auth] Usuario registrado');
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    await apiLogout();
    setUser(null);
    logger.log('[Auth] Sesión cerrada');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
