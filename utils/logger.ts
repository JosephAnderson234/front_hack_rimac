import { APP_CONFIG } from '@/config/constants';

/**
 * Logger que solo imprime en modo desarrollo
 */
export const logger = {
  log: (...args: any[]) => {
    if (APP_CONFIG.DEBUG) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (APP_CONFIG.DEBUG) {
      console.error(...args);
    }
  },

  warn: (...args: any[]) => {
    if (APP_CONFIG.DEBUG) {
      console.warn(...args);
    }
  },
};
