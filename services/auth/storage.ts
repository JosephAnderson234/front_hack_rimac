import { APP_CONFIG } from '@/config/constants';
import { logger } from '@/utils/logger';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const { STORAGE_KEYS } = APP_CONFIG;

/**
 * Guarda un valor en el almacenamiento seguro
 */
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

/**
 * Obtiene un valor del almacenamiento seguro
 */
async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

/**
 * Elimina un valor del almacenamiento seguro
 */
async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

/**
 * Valida que un token sea válido
 */
function validateToken(token: string, name: string): void {
  if (!token || typeof token !== 'string') {
    throw new Error(`${name} inválido`);
  }
}

/**
 * Servicio de almacenamiento seguro para tokens y datos de usuario
 */
export const tokenStorage = {
  /**
   * Guarda los tokens de acceso e ID
   */
  async saveTokens(accessToken: string, idToken: string): Promise<void> {
    try {
      validateToken(accessToken, 'Access token');
      validateToken(idToken, 'ID token');

      await setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await setItem(STORAGE_KEYS.ID_TOKEN, idToken);

      logger.log('[Storage] Tokens guardados');
    } catch (error) {
      logger.error('[Storage] Error guardando tokens:', error);
      throw error;
    }
  },

  /**
   * Obtiene el token de acceso
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      logger.error('[Storage] Error obteniendo access token:', error);
      return null;
    }
  },

  /**
   * Obtiene el token de ID
   */
  async getIdToken(): Promise<string | null> {
    try {
      return await getItem(STORAGE_KEYS.ID_TOKEN);
    } catch (error) {
      logger.error('[Storage] Error obteniendo ID token:', error);
      return null;
    }
  },

  /**
   * Elimina todos los tokens y datos de usuario
   */
  async clearTokens(): Promise<void> {
    try {
      await removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await removeItem(STORAGE_KEYS.ID_TOKEN);
      await removeItem(STORAGE_KEYS.USER_DATA);
      logger.log('[Storage] Tokens eliminados');
    } catch (error) {
      logger.error('[Storage] Error limpiando tokens:', error);
    }
  },

  /**
   * Guarda los datos del usuario
   */
  async saveUserData(userData: any): Promise<void> {
    try {
      const userString = JSON.stringify(userData);
      await setItem(STORAGE_KEYS.USER_DATA, userString);
      logger.log('[Storage] Datos de usuario guardados');
    } catch (error) {
      logger.error('[Storage] Error guardando datos de usuario:', error);
    }
  },

  /**
   * Obtiene los datos del usuario
   */
  async getUserData(): Promise<any | null> {
    try {
      const userString = await getItem(STORAGE_KEYS.USER_DATA);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      logger.error('[Storage] Error obteniendo datos de usuario:', error);
      return null;
    }
  },
};
