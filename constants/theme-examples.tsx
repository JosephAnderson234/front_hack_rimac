/**
 * Ejemplos de uso del sistema de colores médico
 * Estos ejemplos muestran cómo aplicar los tokens de color
 * sin cambiar layout, tamaños o lógica
 */

import { StyleSheet } from 'react-native';
import { Colors } from './theme';

// Obtener el tema (normalmente desde useColorScheme)
const colorScheme = 'dark'; // o 'light'
const colors = Colors[colorScheme];

// ============================================
// EJEMPLO 1: Botones
// ============================================

export const ButtonStyles = StyleSheet.create({
  // Botón primario (acción principal)
  primaryButton: {
    backgroundColor: colors.accent.primary,
    // Mantener padding, borderRadius, etc. sin cambios
  },
  primaryButtonText: {
    color: colors.text.inverse,
    // Mantener fontSize, fontWeight sin cambios
  },
  primaryButtonPressed: {
    backgroundColor: colors.accent.primaryPressed,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.bg,
    opacity: 0.3,
  },
  
  // Botón secundario (borde)
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  secondaryButtonText: {
    color: colors.accent.primary,
  },
  secondaryButtonPressed: {
    backgroundColor: colors.overlay.pressed,
    borderColor: colors.accent.primaryPressed,
  },
  
  // Botón de peligro
  dangerButton: {
    backgroundColor: colors.status.error,
  },
  dangerButtonText: {
    color: colors.text.inverse,
  },
});

// ============================================
// EJEMPLO 2: Tarjetas y Contenedores
// ============================================

export const CardStyles = StyleSheet.create({
  // Tarjeta estándar
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.overlay.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    // Mantener borderRadius, padding sin cambios
  },
  
  // Tarjeta destacada (mejor opción)
  highlightedCard: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    shadowColor: colors.overlay.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  
  // Badge "Mejor Opción"
  bestOptionBadge: {
    backgroundColor: 'rgba(46, 196, 182, 0.15)',
  },
  bestOptionText: {
    color: colors.accent.primary,
  },
  
  // Contenedor de superficie
  surface: {
    backgroundColor: colors.surface,
  },
  
  // Fondo principal
  background: {
    backgroundColor: colors.bg,
  },
});

// ============================================
// EJEMPLO 3: Texto e Iconos
// ============================================

export const TextStyles = StyleSheet.create({
  // Texto primario
  primaryText: {
    color: colors.text.primary,
    // Mantener fontSize, fontWeight sin cambios
  },
  
  // Texto secundario
  secondaryText: {
    color: colors.text.secondary,
  },
  
  // Texto terciario/muted
  mutedText: {
    color: colors.text.muted,
  },
  
  // Texto sobre fondos de color
  inverseText: {
    color: colors.text.inverse,
  },
  
  // Texto deshabilitado
  disabledText: {
    color: colors.text.primary,
    opacity: 0.45,
  },
});

export const IconColors = {
  // Icono por defecto
  default: colors.icon.default,
  
  // Icono activo/seleccionado
  active: colors.icon.active,
  
  // Icono secundario
  secondary: colors.icon.secondary,
  
  // Icono deshabilitado
  disabled: colors.icon.disabled,
  
  // Iconos de estado
  success: colors.icon.success,
  warning: colors.icon.warning,
  error: colors.icon.error,
  info: colors.icon.info,
};

// ============================================
// EJEMPLO 4: Inputs y Formularios
// ============================================

export const InputStyles = StyleSheet.create({
  // Input estándar
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text.primary,
    // Mantener padding, borderRadius, fontSize sin cambios
  },
  
  // Input con foco
  inputFocused: {
    borderColor: colors.accent.primary,
    shadowColor: colors.overlay.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Input con error
  inputError: {
    borderColor: colors.status.error,
  },
  
  // Input deshabilitado
  inputDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  
  // Placeholder
  placeholder: {
    color: colors.text.muted,
  },
});

// ============================================
// EJEMPLO 5: Badges y Estados
// ============================================

export const BadgeStyles = StyleSheet.create({
  // Badge de éxito
  successBadge: {
    backgroundColor: 'rgba(43, 182, 115, 0.15)',
  },
  successBadgeText: {
    color: colors.status.success,
  },
  
  // Badge de advertencia
  warningBadge: {
    backgroundColor: 'rgba(255, 176, 32, 0.15)',
  },
  warningBadgeText: {
    color: colors.status.warning,
  },
  
  // Badge de error
  errorBadge: {
    backgroundColor: 'rgba(255, 90, 95, 0.15)',
  },
  errorBadgeText: {
    color: colors.status.error,
  },
  
  // Badge de info
  infoBadge: {
    backgroundColor: 'rgba(77, 163, 255, 0.15)',
  },
  infoBadgeText: {
    color: colors.status.info,
  },
  
  // Chip/Tag genérico
  chip: {
    backgroundColor: 'rgba(184, 192, 204, 0.15)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.text.secondary,
  },
});

// ============================================
// EJEMPLO 6: Listas y Separadores
// ============================================

export const ListStyles = StyleSheet.create({
  // Item de lista
  listItem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Item presionado
  listItemPressed: {
    backgroundColor: colors.overlay.pressed,
  },
  
  // Título del item
  listItemTitle: {
    color: colors.text.primary,
  },
  
  // Subtítulo del item
  listItemSubtitle: {
    color: colors.text.secondary,
  },
  
  // Separador
  separator: {
    backgroundColor: colors.border,
    height: 1,
  },
});

// ============================================
// EJEMPLO 7: Modales y Overlays
// ============================================

export const ModalStyles = StyleSheet.create({
  // Backdrop del modal
  backdrop: {
    backgroundColor: colors.overlay.scrim,
  },
  
  // Contenedor del modal
  modalContainer: {
    backgroundColor: colors.card,
    shadowColor: colors.overlay.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    // Mantener borderRadius, padding sin cambios
  },
  
  // Bottom sheet
  bottomSheet: {
    backgroundColor: colors.surface,
  },
  
  // Handle del bottom sheet
  bottomSheetHandle: {
    backgroundColor: colors.border,
  },
});

// ============================================
// EJEMPLO 8: Progress y Loading
// ============================================

export const ProgressStyles = StyleSheet.create({
  // Barra de progreso (fondo)
  progressBar: {
    backgroundColor: 'rgba(184, 192, 204, 0.15)',
    // Mantener height, borderRadius sin cambios
  },
  
  // Barra de progreso (relleno)
  progressFill: {
    backgroundColor: colors.accent.primary,
  },
  
  // Activity indicator
  activityIndicator: {
    color: colors.accent.primary,
  },
  
  // Skeleton loader
  skeleton: {
    backgroundColor: colors.surface,
  },
});

// ============================================
// EJEMPLO 9: Navegación y Tabs
// ============================================

export const NavigationStyles = StyleSheet.create({
  // Tab bar
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  // Tab icon por defecto
  tabIconDefault: {
    color: colors.icon.secondary,
  },
  
  // Tab icon seleccionado
  tabIconSelected: {
    color: colors.accent.primary,
  },
  
  // Tab label por defecto
  tabLabelDefault: {
    color: colors.text.muted,
  },
  
  // Tab label seleccionado
  tabLabelSelected: {
    color: colors.text.primary,
  },
  
  // Header
  header: {
    backgroundColor: colors.surface,
  },
  
  // Header title
  headerTitle: {
    color: colors.text.primary,
  },
  
  // Header icon
  headerIcon: {
    color: colors.icon.default,
  },
});

// ============================================
// EJEMPLO 10: Uso en Componente
// ============================================

/*
// Ejemplo de uso en un componente funcional:

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }]}>
        <Text style={{ color: colors.text.primary }}>
          Título Principal
        </Text>
        <Text style={{ color: colors.text.secondary }}>
          Descripción secundaria
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.accent.primary }]}
        >
          <Text style={{ color: colors.text.inverse }}>
            Acción
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
*/
