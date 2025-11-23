/**
 * Sistema de colores para aplicación médica
 * Paleta oscura moderada: elegante, sobria y tranquila
 * Cumple con WCAG AA (contraste mínimo 4.5:1 para texto, 3:1 para UI)
 */

import { Platform } from 'react-native';

// Tokens de color - Paleta oscura médica
const MedicalDarkTheme = {
  // Fondos y superficies
  bg: '#111418',           // Fondo principal (near-dark, no negro absoluto)
  surface: '#161A20',      // Contenedores y secciones
  card: '#1B2129',         // Tarjetas y modales
  border: '#2A313A',       // Bordes sutiles
  
  // Texto - MEJORADO para máximo contraste y legibilidad
  text: {
    primary: '#FFFFFF',    // Texto principal - blanco puro para máxima legibilidad
    secondary: '#D1D5DB',  // Texto secundario - gris muy claro
    muted: '#9CA3AF',      // Texto terciario - gris medio claro
    inverse: '#0F1216',    // Texto sobre fondos claros
  },
  
  // Acciones y acentos
  accent: {
    primary: '#2EC4B6',         // Teal médico - acción principal
    primaryHover: '#27AFA3',    // Hover state
    primaryPressed: '#1F978C',  // Pressed state
    secondary: '#4DA3FF',       // Azul info - acción secundaria
  },
  
  // Estados semánticos
  status: {
    success: '#34D399',    // Verde - éxito, salud positiva (más brillante)
    warning: '#FBBF24',    // Ámbar - advertencia (más brillante)
    error: '#F87171',      // Rojo - error, crítico (más brillante)
    info: '#60A5FA',       // Azul - información (más brillante)
  },
  
  // Iconos por estado
  icon: {
    default: '#D1D5DB',    // Icono por defecto - más claro
    active: '#2EC4B6',     // Icono activo/acción principal
    secondary: '#9CA3AF',  // Icono secundario - más claro
    disabled: '#6B7280',   // Icono deshabilitado
    success: '#34D399',    // Icono éxito
    warning: '#FBBF24',    // Icono advertencia
    error: '#F87171',      // Icono error
    info: '#60A5FA',       // Icono información
  },
  
  // Overlays y sombras
  overlay: {
    scrim: 'rgba(10, 12, 14, 0.6)',      // Overlay de modales
    shadow: 'rgba(0, 0, 0, 0.35)',       // Sombras
    focus: 'rgba(77, 163, 255, 0.4)',    // Anillo de enfoque (accesibilidad)
    pressed: 'rgba(46, 196, 182, 0.15)', // Overlay de pressed state
  },
  
  // Utilidades de color
  utils: {
    modalOverlay: 'rgba(0, 0, 0, 0.5)',       // Overlay oscuro para modales
    divider: 'rgba(255, 255, 255, 0.1)',      // Divisores sutiles
    chipBackground: 'rgba(128, 128, 128, 0.15)', // Fondo de chips/tags
    borderSubtle: 'rgba(0, 0, 0, 0.05)',      // Bordes muy sutiles
    cancelButton: 'rgba(128, 128, 128, 0.2)', // Botón cancelar
    whiteTransparent: {
      high: 'rgba(255, 255, 255, 0.9)',       // Blanco casi opaco
      medium: 'rgba(255, 255, 255, 0.8)',     // Blanco semi-transparente
      low: 'rgba(255, 255, 255, 0.2)',        // Blanco muy transparente
    },
  },
};

// Tema claro (mantenido para compatibilidad, pero dark es principal)
const MedicalLightTheme = {
  bg: '#FFFFFF',
  surface: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E1E4E8',
  
  text: {
    primary: '#1B2129',
    secondary: '#4A5568',
    muted: '#718096',
    inverse: '#FFFFFF',
  },
  
  accent: {
    primary: '#2EC4B6',
    primaryHover: '#27AFA3',
    primaryPressed: '#1F978C',
    secondary: '#3B82F6',
  },
  
  status: {
    success: '#2BB673',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  icon: {
    default: '#4A5568',
    active: '#2EC4B6',
    secondary: '#718096',
    disabled: '#CBD5E0',
    success: '#2BB673',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    focus: 'rgba(59, 130, 246, 0.4)',
    pressed: 'rgba(46, 196, 182, 0.1)',
  },
};

// Exportar colores con compatibilidad hacia atrás
export const Colors = {
  light: {
    background: MedicalLightTheme.bg,
    tint: MedicalLightTheme.accent.primary,
    tabIconDefault: MedicalLightTheme.icon.secondary,
    tabIconSelected: MedicalLightTheme.accent.primary,
    // Tokens completos
    ...MedicalLightTheme,
  },
  dark: {
    background: MedicalDarkTheme.bg,
    tint: MedicalDarkTheme.accent.primary,
    tabIconDefault: MedicalDarkTheme.icon.secondary,
    tabIconSelected: MedicalDarkTheme.accent.primary,
    // Tokens completos
    ...MedicalDarkTheme,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
