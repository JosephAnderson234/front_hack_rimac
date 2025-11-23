import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@/interfaces/auth';
import Constants from 'expo-constants';
import { tokenStorage } from './storage';

// En Expo, las variables de entorno se acceden desde Constants.expoConfig.extra
const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_URL ||
  process.env.EXPO_PUBLIC_AUTH_URL ||
  'https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev';

console.log('[AuthService] Inicializando con API_URL:', API_URL);
console.log('[AuthService] Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
console.log('[AuthService] process.env.EXPO_PUBLIC_AUTH_URL:', process.env.EXPO_PUBLIC_AUTH_URL);

// Manejo de errores mejorado
class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  console.log('[AuthService] Respuesta (texto):', text);
  
  let data;
  try {
    data = JSON.parse(text);
    console.log('[AuthService] Respuesta parseada:', JSON.stringify(data, null, 2));
  } catch (e) {
    throw new AuthError('La respuesta del servidor no es JSON válido', response.status);
  }

  if (!response.ok) {
    throw new AuthError(
      data.error || data.message || `Error ${response.status}`,
      response.status,
      data
    );
  }
  
  return data;
}

// Login
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  console.log('[AuthService] Login request:', `${API_URL}/login`, data);
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('[AuthService] Login status:', response.status);

    const result = await handleResponse<AuthResponse>(response);
    console.log('[AuthService] Login result:', result);

    // Validar que los tokens existan
    if (!result.access_token || !result.id_token) {
      console.error('[AuthService] Tokens faltantes en respuesta:', result);
      console.error('[AuthService] Campos disponibles:', Object.keys(result));
      throw new AuthError(
        'Login exitoso pero el servidor no devolvió tokens. ' +
        'Verifica la configuración del backend.'
      );
    }

    // Guardar tokens automáticamente
    console.log('[AuthService] Guardando tokens...');
    await tokenStorage.saveTokens(result.access_token, result.id_token);
    await tokenStorage.saveUserData({
      correo: result.usuario.correo,
      nombre: result.usuario.nombre,
      sexo: result.usuario.sexo,
      rol: result.usuario.rol,
    });

    return result;
  } catch (error) {
    console.error(`[AuthService] Error en ${API_URL}/login:`, error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(`Error de conexión con ${API_URL}/login`);
  }
};

// Registro
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  console.log('[AuthService] Register request:', `${API_URL}/register`, data);
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('[AuthService] Register status:', response.status);

    const result = await handleResponse<AuthResponse>(response);
    console.log('[AuthService] Register result:', result);

    // Validar que los tokens existan
    if (!result.access_token || !result.id_token) {
      console.error('[AuthService] Tokens faltantes en respuesta:', result);
      console.error('[AuthService] Campos disponibles:', Object.keys(result));
      throw new AuthError(
        'Registro exitoso pero el servidor no devolvió tokens. ' +
        'Verifica la configuración del backend.'
      );
    }

    // Guardar tokens automáticamente
    console.log('[AuthService] Guardando tokens...');
    await tokenStorage.saveTokens(result.access_token, result.id_token);
    await tokenStorage.saveUserData({
      correo: result.usuario.correo,
      nombre: result.usuario.nombre,
      sexo: result.usuario.sexo,
      rol: result.usuario.rol,
    });

    return result;
  } catch (error) {
    console.error(`[AuthService] Error en ${API_URL}/register:`, error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(`Error de conexión con ${API_URL}/register`);
  }
};

// Logout
export const logout = async (): Promise<void> => {
  await tokenStorage.clearTokens();
};

// Verificar si está autenticado
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await tokenStorage.getAccessToken();
  return !!token;
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  return await tokenStorage.getUserData();
};

// Helper para hacer peticiones autenticadas
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await tokenStorage.getIdToken();

  if (!token) {
    throw new AuthError('No autenticado', 401);
  }
  console.log(token)
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
