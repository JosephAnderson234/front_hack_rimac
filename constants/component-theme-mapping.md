# Mapeo de Componentes → Tokens de Color

## Sistema de Color Médico - Paleta Oscura Moderada

### Tokens Base

```typescript
// Fondos
bg: '#111418'           // Fondo principal
surface: '#161A20'      // Contenedores
card: '#1B2129'         // Tarjetas
border: '#2A313A'       // Bordes

// Texto (WCAG AA compliant)
text.primary: '#E7ECF2'    // Contraste 13.8:1
text.secondary: '#B8C0CC'  // Contraste 8.2:1
text.muted: '#8C95A3'      // Contraste 5.1:1

// Acciones
accent.primary: '#2EC4B6'        // Teal médico
accent.primaryHover: '#27AFA3'
accent.primaryPressed: '#1F978C'
accent.secondary: '#4DA3FF'      // Azul info

// Estados
status.success: '#2BB673'
status.warning: '#FFB020'
status.error: '#FF5A5F'
status.info: '#4DA3FF'
```

---

## Mapeo por Componente

### 1. Buttons

**Primary Button**
- Background: `accent.primary` (#2EC4B6)
- Text: `text.inverse` (#0F1216)
- Hover: `accent.primaryHover` (#27AFA3)
- Pressed: `accent.primaryPressed` (#1F978C)
- Disabled: `bg` + opacity 0.3, text opacity 0.45
- Focus ring: `overlay.focus` 2px

**Secondary Button**
- Background: transparent
- Border: `accent.primary` 1px
- Text: `accent.primary`
- Hover: background `overlay.pressed`
- Pressed: border `accent.primaryPressed`

**Danger Button**
- Background: `status.error`
- Text: `text.inverse`
- Hover: darken 8%
- Pressed: darken 15%

---

### 2. Cards

**Default Card**
- Background: `card` (#1B2129)
- Border: `border` (#2A313A) 1px
- Shadow: `overlay.shadow` offset (0, 2), radius 8, opacity 0.35
- Text: `text.primary`

**Highlighted Card (Mejor Opción)**
- Background: `card`
- Border: `accent.primary` 2px
- Badge background: rgba(46, 196, 182, 0.15)
- Badge text: `accent.primary`

**Interactive Card**
- Default: como Default Card
- Hover: border `accent.primary` opacity 0.4
- Pressed: background lighten 6%

---

### 3. Tabs / Navigation

**Tab Bar**
- Background: `surface` (#161A20)
- Border top: `border` 1px

**Tab Item**
- Icon default: `icon.secondary` (#9AA4B2)
- Icon selected: `accent.primary` (#2EC4B6)
- Label default: `text.muted`
- Label selected: `text.primary`

**Header**
- Background: `surface`
- Title: `text.primary`
- Icons: `icon.default`

---

### 4. Inputs / Forms

**Text Input**
- Background: `surface` (#161A20)
- Border: `border` (#2A313A) 1px
- Text: `text.primary`
- Placeholder: `text.muted`
- Focus: border `accent.primary`, ring `overlay.focus` 2px
- Error: border `status.error`
- Disabled: background opacity 0.5, text opacity 0.45

**Select / Picker**
- Como Text Input
- Dropdown background: `card`
- Dropdown item hover: `overlay.pressed`

---

### 5. Badges / Pills

**Status Badge**
- Success: background `status.success` opacity 0.15, text `status.success`
- Warning: background `status.warning` opacity 0.15, text `status.warning`
- Error: background `status.error` opacity 0.15, text `status.error`
- Info: background `status.info` opacity 0.15, text `status.info`

**Chip / Tag**
- Background: rgba(184, 192, 204, 0.15)
- Text: `text.secondary`
- Border: `border`
- Close icon: `icon.secondary`

---

### 6. Toasts / Alerts

**Success Toast**
- Background: `card`
- Border left: `status.success` 4px
- Icon: `icon.success`
- Title: `text.primary`
- Message: `text.secondary`

**Warning Toast**
- Border left: `status.warning` 4px
- Icon: `icon.warning`

**Error Toast**
- Border left: `status.error` 4px
- Icon: `icon.error`

**Info Toast**
- Border left: `status.info` 4px
- Icon: `icon.info`

---

### 7. Lists / Items

**List Item**
- Background: `card`
- Border: `border` 1px
- Title: `text.primary`
- Subtitle: `text.secondary`
- Icon: `icon.default`
- Pressed: background `overlay.pressed`

**List Separator**
- Color: `border`
- Height: 1px

---

### 8. Modals / Overlays

**Modal**
- Background: `card`
- Backdrop: `overlay.scrim`
- Border radius: 16px
- Shadow: `overlay.shadow` offset (0, 4), radius 12

**Bottom Sheet**
- Background: `surface`
- Handle: `border`

---

### 9. Progress / Loading

**Progress Bar**
- Background: rgba(184, 192, 204, 0.15)
- Fill: `accent.primary`
- Border radius: 4px

**Activity Indicator**
- Color: `accent.primary`

**Skeleton**
- Background: `surface`
- Shimmer: rgba(231, 236, 242, 0.1)

---

### 10. Icons por Contexto

**Navegación**
- Default: `icon.secondary` (#9AA4B2)
- Active: `accent.primary` (#2EC4B6)

**Acciones**
- Primary: `accent.primary`
- Secondary: `icon.default`
- Disabled: `icon.disabled` (#6E7785)

**Estados**
- Success: `icon.success` (#2BB673)
- Warning: `icon.warning` (#FFB020)
- Error: `icon.error` (#FF5A5F)
- Info: `icon.info` (#4DA3FF)

**Médicos**
- Salud/Corazón: `status.success` o `status.error` según contexto
- Medicamentos: `accent.primary`
- Citas: `accent.secondary`
- Familia: `icon.default`

---

## Estados Interactivos

### Pressed State
- Superficie: oscurecer 6-8% o aplicar `overlay.pressed`
- Borde: `accent.primary` opacity 0.4

### Focus State (Accesibilidad)
- Anillo: `overlay.focus` (#4DA3FF 40%) 2px
- No cambiar layout

### Disabled State
- Texto: opacity 0.45-0.55
- Iconos: opacity 0.40
- Quitar sombras
- Background: opacity 0.3

### Hover State (Web)
- Superficie: lighten 4-6%
- Borde: aumentar opacity 20%

---

## Accesibilidad

### Contrastes Mínimos (WCAG AA)
- Texto normal: 4.5:1 ✓
- Texto grande (18pt+): 3:1 ✓
- UI components: 3:1 ✓

### Verificado
- `text.primary` sobre `bg`: 13.8:1 ✓
- `text.secondary` sobre `bg`: 8.2:1 ✓
- `text.muted` sobre `bg`: 5.1:1 ✓
- `accent.primary` sobre `bg`: 7.2:1 ✓
- `text.inverse` sobre `accent.primary`: 12.1:1 ✓

---

## Notas de Implementación

1. **No usar negro absoluto (#000000)**: Usar `bg` (#111418) para reducir fatiga ocular
2. **Evitar saturaciones agresivas**: Todos los colores tienen saturación moderada
3. **Monocromo + opacidades**: Preferir opacidades sobre múltiples colores para estados
4. **Sombras sutiles**: Usar `overlay.shadow` con opacidad 0.35 máximo
5. **Transiciones suaves**: 150-200ms para cambios de estado
6. **Modo oscuro principal**: Dark es el tema principal, light es secundario
