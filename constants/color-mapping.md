# Mapeo de Colores - Sistema de Tema

Este documento mapea todos los colores usados en la aplicación al sistema de tema centralizado.

## Colores del Tema (constants/theme.ts)

### Tema Oscuro (Principal)

#### Fondos y Superficies
- `colors.bg` - `#111418` - Fondo principal
- `colors.surface` - `#161A20` - Contenedores y secciones
- `colors.card` - `#1B2129` - Tarjetas y modales
- `colors.border` - `#2A313A` - Bordes sutiles

#### Texto
- `colors.text.primary` - `#FFFFFF` - Texto principal (blanco puro)
- `colors.text.secondary` - `#D1D5DB` - Texto secundario (gris muy claro)
- `colors.text.muted` - `#9CA3AF` - Texto terciario (gris medio claro)
- `colors.text.inverse` - `#0F1216` - Texto sobre fondos claros

#### Acciones y Acentos
- `colors.accent.primary` - `#2EC4B6` - Teal médico (acción principal)
- `colors.accent.primaryHover` - `#27AFA3` - Hover state
- `colors.accent.primaryPressed` - `#1F978C` - Pressed state
- `colors.accent.secondary` - `#4DA3FF` - Azul info (acción secundaria)
- `colors.tint` - Alias de `colors.accent.primary`

#### Estados Semánticos
- `colors.status.success` - `#34D399` - Verde (éxito, salud positiva)
- `colors.status.warning` - `#FBBF24` - Ámbar (advertencia)
- `colors.status.error` - `#F87171` - Rojo (error, crítico)
- `colors.status.info` - `#60A5FA` - Azul (información)

#### Iconos
- `colors.icon.default` - `#D1D5DB` - Icono por defecto
- `colors.icon.active` - `#2EC4B6` - Icono activo
- `colors.icon.secondary` - `#9CA3AF` - Icono secundario
- `colors.icon.disabled` - `#6B7280` - Icono deshabilitado
- `colors.icon.success` - `#34D399` - Icono éxito
- `colors.icon.warning` - `#FBBF24` - Icono advertencia
- `colors.icon.error` - `#F87171` - Icono error
- `colors.icon.info` - `#60A5FA` - Icono información

#### Overlays y Sombras
- `colors.overlay.scrim` - `rgba(10, 12, 14, 0.6)` - Overlay de modales
- `colors.overlay.shadow` - `rgba(0, 0, 0, 0.35)` - Sombras
- `colors.overlay.focus` - `rgba(77, 163, 255, 0.4)` - Anillo de enfoque
- `colors.overlay.pressed` - `rgba(46, 196, 182, 0.15)` - Overlay de pressed state

#### Utilidades de Color
- `colors.utils.modalOverlay` - `rgba(0, 0, 0, 0.5)` - Overlay oscuro para modales
- `colors.utils.divider` - `rgba(255, 255, 255, 0.1)` - Divisores sutiles
- `colors.utils.chipBackground` - `rgba(128, 128, 128, 0.15)` - Fondo de chips/tags
- `colors.utils.borderSubtle` - `rgba(0, 0, 0, 0.05)` - Bordes muy sutiles
- `colors.utils.cancelButton` - `rgba(128, 128, 128, 0.2)` - Botón cancelar
- `colors.utils.whiteTransparent.high` - `rgba(255, 255, 255, 0.9)` - Blanco casi opaco
- `colors.utils.whiteTransparent.medium` - `rgba(255, 255, 255, 0.8)` - Blanco semi-transparente
- `colors.utils.whiteTransparent.low` - `rgba(255, 255, 255, 0.2)` - Blanco muy transparente

## Colores Especiales por Contexto

### Colores de Especialidades Médicas (agendas.tsx)
```typescript
const especialidadColors = {
  'Medicina Interna': '#FF6B6B',
  'Psiquiatría': '#9B59B6',
  'Pediatría': '#3498DB',
  'Cirugía General': '#E74C3C',
  'Oftalmología': '#1ABC9C',
  'Ginecología y Obstetricia': '#E91E63',
  'Gastroenterología': '#FF9800',
  'Ortopedia y Traumatología': '#2ECC71',
};
```

### Colores de Calidad de Sueño (salud.tsx)
```typescript
const sleepQualityColors = {
  excellent: '#4CAF50',
  good: '#8BC34A',
  fair: '#FFC107',
  poor: '#F44336',
};
```

### Colores de Estado de Sueño
- Durmiendo: `#9B59B6` (Púrpura)
- Indicador en vivo: `#4CAF50` (Verde)

### Colores de Tiendas (receta-detalle.tsx)
- Mejor opción badge: `#FFD700` (Dorado)
- Mejor opción background: `#FFF9E6` (Amarillo claro)
- Mejor opción text: `#B8860B` (Dorado oscuro)
- Precio badge: `#4CAF50` (Verde)

### Colores de Botones de Acción
- Eliminar/Cerrar sesión: `#FF6B6B` (Rojo)
- Botones primarios: `colors.tint` (#2EC4B6)
- Texto en botones: `#FFFFFF` (Blanco)

## Colores Neutrales Comunes

### Sombras
- Todas las sombras usan: `shadowColor: '#000'` (Negro)
- Opacidad varía según contexto (0.1 - 0.35)

### Fondos de Placeholder
- Imágenes sin cargar: `#f0f0f0` (Gris muy claro)

### Bordes Sutiles
- Bordes de modal: `#eee` (Gris claro)
- Bordes de radio buttons: `#ddd` (Gris medio)

## Uso Correcto

### ✅ Correcto
```typescript
// Usar colores del tema
<Text style={{ color: colors.text.primary }}>Texto</Text>
<View style={{ backgroundColor: colors.background }}>
<Ionicons color={colors.icon.default} />
```

### ❌ Incorrecto
```typescript
// NO usar colores hardcodeados
<Text style={{ color: '#fff' }}>Texto</Text>
<View style={{ backgroundColor: '#111418' }}>
<Ionicons color="#B8C0CC" />
```

## Excepciones Permitidas

Los siguientes colores pueden permanecer hardcodeados por razones específicas:

1. **Blanco puro en botones primarios**: `#FFFFFF` - Para máximo contraste sobre fondos de color
2. **Negro en sombras**: `#000` - Estándar de React Native
3. **Colores de especialidades médicas**: Mantienen identidad visual específica
4. **Colores de calidad de sueño**: Sistema de semáforo estándar

## Migración de Colores Hardcodeados

Si encuentras un color hardcodeado que no está en las excepciones:

1. Identifica el propósito del color
2. Busca el token equivalente en `constants/theme.ts`
3. Reemplaza el valor hardcodeado con `colors.{token}`
4. Si no existe un token apropiado, considera agregarlo al tema

## Notas de Accesibilidad

- Todos los colores de texto cumplen con WCAG AA (contraste mínimo 4.5:1)
- Los colores de UI cumplen con contraste mínimo 3:1
- El texto blanco (#FFFFFF) sobre fondos oscuros garantiza máxima legibilidad
