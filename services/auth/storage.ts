import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const ID_TOKEN_KEY = 'id_token';
const USER_KEY = 'user_data';

// Almacenamiento seguro para tokens
export const tokenStorage = {
  async saveTokens(accessToken: string, idToken: string): Promise<void> {
    try {
      // Validar que los tokens sean strings válidos
      if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Access token inválido');
      }
      if (!idToken || typeof idToken !== 'string') {
        throw new Error('ID token inválido');
      }

      if (Platform.OS === 'web') {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(ID_TOKEN_KEY, idToken);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(ID_TOKEN_KEY, idToken);
      }
      console.log('[TokenStorage] Tokens guardados exitosamente');
    } catch (error) {
      console.error('[TokenStorage] Error guardando tokens:', error);
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo access token:', error);
      return null;
    }
  },

  async getIdToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(ID_TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(ID_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo id token:', error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ID_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      console.error('Error limpiando tokens:', error);
    }
  },

  async saveUserData(userData: any): Promise<void> {
    try {
      const userString = JSON.stringify(userData);
      if (Platform.OS === 'web') {
        localStorage.setItem(USER_KEY, userString);
      } else {
        await SecureStore.setItemAsync(USER_KEY, userString);
      }
    } catch (error) {
      console.error('Error guardando datos de usuario:', error);
    }
  },

  async getUserData(): Promise<any | null> {
    try {
      let userString: string | null;
      if (Platform.OS === 'web') {
        userString = localStorage.getItem(USER_KEY);
      } else {
        userString = await SecureStore.getItemAsync(USER_KEY);
      }
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      return null;
    }
  },
};
