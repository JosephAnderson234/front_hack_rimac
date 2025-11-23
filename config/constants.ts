import Constants from 'expo-constants';

// Configuración de la aplicación
export const APP_CONFIG = {
  // URL de la API con fallbacks
  API_URL:
    Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_URL ||
    process.env.EXPO_PUBLIC_AUTH_URL ||
    'https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev',

  // Habilitar logs de debugging (desactivar en producción)
  DEBUG: __DEV__,

  // Validación de contraseñas
  MIN_PASSWORD_LENGTH: 6,

  // Claves de almacenamiento
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'auth_token',
    ID_TOKEN: 'id_token',
    USER_DATA: 'user_data',
  },
} as const;
