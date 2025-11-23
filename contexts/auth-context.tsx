import { LoginRequest, RegisterRequest } from '@/interfaces/auth';
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUser,
  isAuthenticated,
} from '@/services/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  correo: string;
  nombre: string;
  sexo: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('[AuthContext] Verificando autenticación...');
    try {
      const authenticated = await isAuthenticated();
      console.log('[AuthContext] ¿Autenticado?:', authenticated);
      if (authenticated) {
        const userData = await getCurrentUser();
        console.log('[AuthContext] Datos de usuario:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('[AuthContext] Error verificando autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    console.log('[AuthContext] Llamando a apiLogin...');
    const response = await apiLogin(data);
    console.log('[AuthContext] Respuesta de login:', response);
    setUser({
      correo: response.usuario.correo,
      nombre: response.usuario.nombre,
      sexo: response.usuario.sexo,
      rol: response.usuario.rol,
    });
  };

  const register = async (data: RegisterRequest) => {
    console.log('[AuthContext] Llamando a apiRegister...');
    const response = await apiRegister(data);
    console.log('[AuthContext] Respuesta de registro:', response);
    setUser({
      correo: response.usuario.correo,
      nombre: response.usuario.nombre,
      sexo: response.usuario.sexo,
      rol: response.usuario.rol,
    });
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const updateUserRole = async (newRole: string) => {
    if (user) {
      const updatedUser = { ...user, rol: newRole };
      setUser(updatedUser);
      
      // Guardar en localStorage
      const { tokenStorage } = await import('@/services/auth/storage');
      await tokenStorage.saveUserData(updatedUser);
      console.log('[AuthContext] Rol actualizado y guardado:', newRole);
    }
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
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
