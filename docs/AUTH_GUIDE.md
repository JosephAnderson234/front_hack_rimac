# Guía de Autenticación

## Estructura del Sistema

El sistema de autenticación está completamente refactorizado para React Native con las siguientes mejoras:

### 📁 Archivos Creados

```
contexts/
  └── auth-context.tsx          # Context API para estado global de auth

services/auth/
  ├── index.ts                  # Exportaciones centralizadas
  ├── api.ts                    # Llamadas a la API
  └── storage.ts                # Almacenamiento seguro de tokens

components/auth/
  ├── login-form.tsx            # Formulario de login
  └── register-form.tsx         # Formulario de registro

app/(tabs)/
  └── auth.tsx                  # Pantalla de autenticación/perfil
```

## 🚀 Uso Básico

### 1. El AuthProvider ya está configurado en `app/_layout.tsx`

```tsx
import { AuthProvider } from '@/contexts/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Tu app */}
    </AuthProvider>
  );
}
```

### 2. Usar el hook useAuth en cualquier componente

```tsx
import { useAuth } from '@/contexts/auth-context';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <Text>Hola {user?.email}</Text>;
  }

  return <Text>No autenticado</Text>;
}
```

## 🔐 Características

### Almacenamiento Seguro
- **iOS/Android**: Usa `expo-secure-store` (keychain/keystore)
- **Web**: Usa `localStorage` como fallback
- Los tokens se guardan automáticamente al login/registro

### Manejo de Errores
- Clase `AuthError` personalizada
- Mensajes de error claros
- Validación de campos en formularios

### Peticiones Autenticadas
```tsx
import { authenticatedFetch } from '@/services/auth';

// Hace peticiones con el token automáticamente
const response = await authenticatedFetch('https://api.com/data');
```

## 📝 Métodos Disponibles

### Context (useAuth)
- `user` - Datos del usuario actual
- `isLoading` - Estado de carga
- `isAuthenticated` - Boolean si está autenticado
- `login(data)` - Iniciar sesión
- `register(data)` - Registrarse
- `logout()` - Cerrar sesión

### API (services/auth)
- `login(data)` - Login y guarda tokens
- `register(data)` - Registro y guarda tokens
- `logout()` - Limpia tokens
- `isAuthenticated()` - Verifica si hay token
- `getCurrentUser()` - Obtiene datos del usuario
- `authenticatedFetch(url, options)` - Fetch con auth

### Storage (tokenStorage)
- `saveTokens(access, id)` - Guarda tokens
- `getAccessToken()` - Obtiene access token
- `getIdToken()` - Obtiene id token
- `clearTokens()` - Limpia todos los tokens
- `saveUserData(data)` - Guarda datos de usuario
- `getUserData()` - Obtiene datos de usuario

## 🔧 Variables de Entorno

Actualiza tu `.env`:
```
EXPO_PUBLIC_AUTH_URL=https://tu-api.com/dev
```

**Nota**: En Expo, las variables deben empezar con `EXPO_PUBLIC_` para estar disponibles en el cliente.

## 🎨 Pantallas

### Pantalla de Auth (`app/(tabs)/auth.tsx`)
- Muestra login/registro si no está autenticado
- Muestra perfil si está autenticado
- Toggle entre login y registro
- Botón de logout

## ✅ Mejoras Implementadas

1. **Almacenamiento seguro** con expo-secure-store
2. **Context API** para estado global
3. **Manejo de errores** robusto
4. **Validación de formularios**
5. **Loading states** en todos los formularios
6. **Compatibilidad web** con fallback a localStorage
7. **TypeScript** completo con interfaces
8. **Tokens automáticos** en peticiones autenticadas
9. **Persistencia de sesión** al recargar la app
10. **UI limpia** con themed components

## 🧪 Testing

Para probar:
1. Ve a la pestaña "Perfil"
2. Registra un nuevo usuario
3. Cierra sesión
4. Inicia sesión con las credenciales
5. Los tokens se guardan automáticamente

## 🔄 Flujo de Autenticación

```
Usuario → LoginForm → useAuth.login() → api.login() 
  → Guarda tokens → Actualiza context → UI se actualiza
```
