# Flujo de Autenticación Actualizado

## 🎯 Nueva Estructura

La app ahora tiene un flujo de autenticación apropiado:

### Pantallas Creadas

```
app/
├── sign-in.tsx          # Pantalla de inicio de sesión
├── sign-up.tsx          # Pantalla de registro
└── (tabs)/
    ├── index.tsx        # Home (requiere auth)
    ├── explore.tsx      # Explore (requiere auth)
    ├── steps.tsx        # Contador de pasos (requiere auth)
    └── auth.tsx         # Perfil del usuario (requiere auth)
```

## 🔄 Flujo de Navegación

### Usuario NO Autenticado

```
App inicia → Verifica auth → No hay usuario → Redirige a /sign-in
```

Desde `/sign-in`:
- Puede iniciar sesión
- Puede ir a `/sign-up` para registrarse

### Usuario Autenticado

```
App inicia → Verifica auth → Usuario existe → Redirige a /(tabs)
```

Desde `/(tabs)`:
- Puede navegar entre todas las pestañas
- En la pestaña "Perfil" puede ver sus datos
- Puede cerrar sesión (redirige a `/sign-in`)

## 📱 Pantallas

### Sign In (`/sign-in`)
- Formulario de login
- Link a registro
- Redirección automática a tabs después del login exitoso

### Sign Up (`/sign-up`)
- Formulario de registro
- Link a login
- Redirección automática a tabs después del registro exitoso

### Perfil (`/(tabs)/auth`)
- Muestra datos del usuario (email, nombre, rol)
- Botón de cerrar sesión
- Solo accesible si está autenticado

## 🔐 Protección de Rutas

El `app/_layout.tsx` maneja la protección automáticamente:

```typescript
// Si no está autenticado y no está en sign-in/sign-up
if (!user && !inAuthScreens) {
  router.replace('/sign-in');
}

// Si está autenticado y está en sign-in/sign-up
if (user && inAuthScreens) {
  router.replace('/(tabs)');
}
```

## ✅ Características

1. **Redirección automática** - No necesitas llamar a `router.replace()` manualmente
2. **Persistencia de sesión** - Si cierras y abres la app, sigues autenticado
3. **Protección de rutas** - No puedes acceder a tabs sin estar autenticado
4. **UX mejorada** - Flujo claro entre login/registro/app

## 🧪 Cómo Probar

### 1. Primera vez (sin usuario)
```
1. Abre la app
2. Verás la pantalla de Sign In
3. Presiona "Regístrate"
4. Completa el formulario
5. Automáticamente te lleva a las tabs
```

### 2. Usuario existente
```
1. Abre la app
2. Verás la pantalla de Sign In
3. Ingresa tus credenciales
4. Automáticamente te lleva a las tabs
```

### 3. Cerrar sesión
```
1. Ve a la pestaña "Perfil"
2. Presiona "Cerrar Sesión"
3. Automáticamente te lleva a Sign In
4. Los tokens se eliminan
```

### 4. Persistencia
```
1. Inicia sesión
2. Cierra la app completamente
3. Abre la app nuevamente
4. Automáticamente te lleva a las tabs (sigues autenticado)
```

## 🎨 Personalización

### Cambiar la pantalla inicial después del login

En `app/_layout.tsx`:
```typescript
if (user && inAuthScreens) {
  router.replace('/(tabs)/steps'); // Ir a una pestaña específica
}
```

### Agregar más validaciones

En `app/_layout.tsx`, puedes agregar lógica adicional:
```typescript
// Ejemplo: Redirigir a onboarding si es primera vez
if (user && !user.hasCompletedOnboarding) {
  router.replace('/onboarding');
}
```

## 📊 Logs de Debugging

Verás estos logs en la consola:

```
[RootLayout] User: { email: "...", role: "..." }
[RootLayout] Segments: ["sign-in"]
[RootLayout] Autenticado, redirigiendo a tabs...
```

O:

```
[RootLayout] User: null
[RootLayout] Segments: ["(tabs)", "index"]
[RootLayout] No autenticado, redirigiendo a sign-in...
```

## 🔧 Troubleshooting

### La app no redirige después del login

**Causa**: El contexto no se está actualizando

**Solución**: Verifica que `AuthProvider` esté en `app/_layout.tsx` y que el login actualice el estado correctamente

### Bucle infinito de redirecciones

**Causa**: La lógica de redirección está mal configurada

**Solución**: Asegúrate de que `isLoading` sea `false` antes de redirigir

### No puedo acceder a las tabs

**Causa**: No estás autenticado

**Solución**: Inicia sesión primero. Los tabs solo son accesibles con autenticación.

## 💡 Mejoras Futuras

- [ ] Pantalla de splash mientras verifica autenticación
- [ ] Animaciones de transición entre pantallas
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Onboarding para nuevos usuarios
- [ ] Refresh tokens automático
