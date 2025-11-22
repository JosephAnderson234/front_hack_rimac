# Guía de Debugging - Autenticación

## ✅ Cambios Implementados

1. **Logs completos** en toda la cadena de autenticación
2. **API URL configurada** con fallback hardcodeado
3. **app.config.js** creado para manejar variables de entorno
4. **Mensajes de error mejorados** en los formularios

## 🔍 Cómo Verificar que Funciona

### 1. Reinicia el servidor de Expo
```bash
# Detén el servidor actual (Ctrl+C)
npm start
```

### 2. Abre la consola de desarrollo
- **Android**: Agita el dispositivo o presiona `Cmd+M` / `Ctrl+M`
- **iOS**: Presiona `Cmd+D`
- Selecciona "Debug Remote JS" o "Open Debugger"

### 3. Verifica los logs en la consola

Deberías ver estos logs cuando la app inicia:
```
[AuthService] Inicializando con API_URL: https://blkmrdvd75...
[AuthService] Constants.expoConfig?.extra: {...}
[AuthContext] Verificando autenticación...
```

### 4. Prueba el registro

Ve a la pestaña "Perfil" → "Registrarse" y completa:
- Nombre: Test User
- Email: test@example.com
- Contraseña: test123

Deberías ver en la consola:
```
[RegisterForm] Iniciando registro con: { name: 'Test User', email: 'test@example.com' }
[AuthContext] Llamando a apiRegister...
[AuthService] Register request: https://blkmrdvd75.../register
[AuthService] Register status: 200
[AuthService] Register result: {...}
[AuthContext] Respuesta de registro: {...}
[RegisterForm] Registro exitoso: {...}
```

### 5. Prueba el login

Después de registrarte, cierra sesión y vuelve a iniciar:
- Email: test@example.com
- Contraseña: test123

Deberías ver logs similares con `[LoginForm]` y `[AuthService] Login...`

## 🐛 Problemas Comunes

### La API no se llama

**Síntoma**: No ves logs de `[AuthService] Login request` o `Register request`

**Solución**:
1. Verifica que el formulario esté llamando a `login()` o `register()`
2. Revisa que no haya errores de validación antes
3. Asegúrate de que `isLoading` no esté bloqueando el botón

### Error de red

**Síntoma**: `Error de conexión con https://...`

**Solución**:
1. Verifica tu conexión a internet
2. Prueba la URL en el navegador o Postman:
   ```
   POST https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev/register
   Content-Type: application/json
   
   {
     "name": "Test",
     "email": "test@example.com",
     "password": "test123"
   }
   ```
3. Si la API requiere CORS, verifica la configuración del servidor

### Error 400/401/500

**Síntoma**: `Error en la petición a https://...`

**Solución**:
1. Revisa el formato de los datos que envías
2. Verifica que el email no esté ya registrado
3. Revisa los logs del servidor para más detalles

### Los tokens no se guardan

**Síntoma**: Login exitoso pero al recargar no está autenticado

**Solución**:
1. Verifica los logs de `[AuthService]` para ver si se guardan los tokens
2. Revisa que `expo-secure-store` esté instalado
3. En Android, verifica los permisos de la app

## 📱 Testing en Diferentes Plataformas

### Android
```bash
npm run android
```
- Abre el menú de desarrollo: `Cmd+M` / `Ctrl+M`
- Habilita "Debug Remote JS"
- Abre Chrome DevTools en `http://localhost:8081/debugger-ui`

### iOS
```bash
npm run ios
```
- Abre el menú de desarrollo: `Cmd+D`
- Habilita "Debug Remote JS"
- Usa Safari Web Inspector

### Web
```bash
npm run web
```
- Abre las DevTools del navegador (F12)
- Ve a la pestaña Console

## 🔧 Comandos Útiles

```bash
# Limpiar caché de Expo
npx expo start -c

# Reinstalar dependencias
rm -rf node_modules
npm install

# Ver logs en tiempo real (Android)
npx react-native log-android

# Ver logs en tiempo real (iOS)
npx react-native log-ios
```

## 📊 Checklist de Verificación

- [ ] El servidor de Expo está corriendo
- [ ] La consola de desarrollo está abierta
- [ ] Ves los logs de `[AuthService] Inicializando...`
- [ ] El formulario se renderiza correctamente
- [ ] Al presionar el botón, ves logs de `[LoginForm]` o `[RegisterForm]`
- [ ] Ves la petición HTTP en `[AuthService] Login/Register request`
- [ ] Ves el status code de la respuesta
- [ ] Si hay error, ves el mensaje completo en la consola

## ✅ Redirección después del Login

Después de un login/registro exitoso, la app automáticamente:
1. Guarda los tokens en almacenamiento seguro
2. Actualiza el estado del usuario en el contexto
3. Muestra un Alert de éxito
4. Redirige al home después de 500ms usando `router.replace('/(tabs)')`

Si no redirige:
- Verifica que `expo-router` esté correctamente instalado
- Revisa los logs de la consola para ver si hay errores
- Asegúrate de que la ruta `/(tabs)` existe

## 💡 Próximos Pasos

Si todo funciona:
1. Puedes remover los `console.log` para producción
2. Implementar refresh tokens
3. Agregar validación de email
4. Implementar "Olvidé mi contraseña"
5. Agregar persistencia de sesión más robusta
