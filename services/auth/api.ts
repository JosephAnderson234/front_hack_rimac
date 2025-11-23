import { APP_CONFIG } from '@/config/constants';
import {
  AuthLoginResponse,
  AuthRegisterResponse,
  LoginRequest,
  RegisterRequest,
} from '@/interfaces/auth';
import { logger } from '@/utils/logger';
import { tokenStorage } from './storage';

/**
 * Error personalizado para autenticación
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Procesa la respuesta HTTP y maneja errores
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  logger.log('[API] Respuesta recibida:', text.substring(0, 200));

  let data: T;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new AuthError('Respuesta inválida del servidor', response.status);
  }

  if (!response.ok) {
    const errorData = data as any;
    throw new AuthError(
      errorData.error || errorData.message || `Error ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

/**
 * Valida que la respuesta contenga los tokens necesarios
 */
function validateTokens(result: any, action: string): void {
  if (!result.access_token || !result.id_token) {
    logger.error(`[API] Tokens faltantes en ${action}:`, Object.keys(result));
    throw new AuthError(
      `${action} exitoso pero el servidor no devolvió tokens válidos`
    );
  }
}

/**
 * Guarda los tokens y datos del usuario
 */
async function saveAuthData(
  accessToken: string,
  idToken: string,
  userData: { email: string; name?: string; role: string }
): Promise<void> {
  await tokenStorage.saveTokens(accessToken, idToken);
  await tokenStorage.saveUserData(userData);
  logger.log('[API] Datos de autenticación guardados');
}

/**
 * Inicia sesión con email y contraseña
 */
export async function login(data: LoginRequest): Promise<AuthLoginResponse> {
  logger.log('[API] Iniciando login para:', data.email);

  try {
    const response = await fetch(`${APP_CONFIG.API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<AuthLoginResponse>(response);
    validateTokens(result, 'Login');

    await saveAuthData(result.access_token, result.id_token, {
      email: result.email,
      role: result.role,
    });

    logger.log('[API] Login exitoso');
    return result;
  } catch (error) {
    logger.error('[API] Error en login:', error);
    throw error instanceof AuthError ? error : new AuthError('Error de conexión');
  }
}

/**
 * Registra un nuevo usuario
 */
export async function register(
  data: RegisterRequest
): Promise<AuthRegisterResponse> {
  logger.log('[API] Iniciando registro para:', data.email);

  try {
    const response = await fetch(`${APP_CONFIG.API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<AuthRegisterResponse>(response);
    validateTokens(result, 'Registro');

    await saveAuthData(result.access_token, result.id_token, {
      email: result.usuario.email,
      name: result.usuario.name,
      role: result.usuario.role,
    });

    logger.log('[API] Registro exitoso');
    return result;
  } catch (error) {
    logger.error('[API] Error en registro:', error);
    throw error instanceof AuthError ? error : new AuthError('Error de conexión');
  }
}

/**
 * Cierra la sesión del usuario
 */
export async function logout(): Promise<void> {
  await tokenStorage.clearTokens();
  logger.log('[API] Sesión cerrada');
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await tokenStorage.getAccessToken();
  return !!token;
}

/**
 * Obtiene los datos del usuario actual
 */
export async function getCurrentUser() {
  return await tokenStorage.getUserData();
}

/**
 * Realiza una petición HTTP autenticada
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await tokenStorage.getAccessToken();

  if (!token) {
    throw new AuthError('No autenticado', 401);
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
