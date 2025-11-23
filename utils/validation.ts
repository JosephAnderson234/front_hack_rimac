import { APP_CONFIG } from '@/config/constants';

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida un email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true };
}

/**
 * Valida una contraseña
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < APP_CONFIG.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña debe tener al menos ${APP_CONFIG.MIN_PASSWORD_LENGTH} caracteres`,
    };
  }

  return { isValid: true };
}

/**
 * Valida un nombre
 */
export function validateName(name: string): ValidationResult {
  if (!name) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (name.length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }

  return { isValid: true };
}

/**
 * Valida los datos de login
 */
export function validateLoginData(
  email: string,
  password: string
): ValidationResult {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) return passwordValidation;

  return { isValid: true };
}

/**
 * Valida los datos de registro
 */
export function validateRegisterData(
  name: string,
  email: string,
  password: string
): ValidationResult {
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) return nameValidation;

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) return passwordValidation;

  return { isValid: true };
}
