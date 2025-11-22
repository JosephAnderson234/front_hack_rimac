# 🔍 Solución: Tokens No Encontrados

## ✅ Diagnóstico Completo

He probado tu API y encontré el problema:

### La API está funcionando, pero...

Cuando hago login con credenciales de prueba (`test@example.com`), la API responde:

```json
Status: 401
{
  "error": "Credenciales inválidas"
}
```

**Esto es CORRECTO** - la API está funcionando, simplemente rechaza credenciales incorrectas.

## 🎯 El Problema Real

El error "La respuesta del servidor no contiene tokens válidos" ocurre porque:

1. **Estás usando credenciales incorrectas** - La API devuelve error 401
2. El código ahora maneja mejor los errores y te dice exactamente qué pasó
3. Necesitas usar un usuario registrado válido

## ✅ Solución

### Opción 1: Registra un nuevo usuario

1. Ve a la pestaña "Perfil"
2. Cambia a "Registrarse"
3. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: mínimo 6 caracteres
4. Presiona "Registrarse"

Si el registro es exitoso, verás en la consola:
```
[AuthService] Respuesta parseada: {
  "message": "...",
  "usuario": {...},
  "acces_token": "eyJ...",
  "id_token": "eyJ..."
}
[AuthService] Guardando tokens...
[TokenStorage] Tokens guardados exitosamente
```

### Opción 2: Usa credenciales existentes

Si ya tienes un usuario registrado en tu backend, úsalo para hacer login.

## 🔧 Mejoras Implementadas

### 1. Mejor manejo de errores HTTP

Ahora el código:
- Lee la respuesta completa como texto primero
- La parsea como JSON
- Muestra el contenido exacto en los logs
- Distingue entre errores de autenticación (401) y otros errores

### 2. Mensajes de error más claros

Antes:
```
Error: La respuesta del servidor no contiene tokens válidos
```

Ahora:
```
Error: Credenciales inválidas
```

O si el login es exitoso pero sin tokens:
```
Error: Login exitoso pero el servidor no devolvió tokens.
Verifica la configuración del backend.
```

### 3. Logs detallados

Verás en la consola:
```
[AuthService] Respuesta (texto): {"error": "Credenciales inválidas"}
[AuthService] Respuesta parseada: {
  "error": "Credenciales inválidas"
}
```

## 📊 Cómo Verificar que Funciona

### 1. Abre la consola de desarrollo

### 2. Intenta registrarte

Deberías ver:
```
[RegisterForm] Iniciando registro con: {...}
[AuthService] Register request: https://...
[AuthService] Register status: 200
[AuthService] Respuesta (texto): {...}
[AuthService] Respuesta parseada: {
  "acces_token": "...",
  "id_token": "..."
}
[AuthService] Guardando tokens...
[TokenStorage] Tokens guardados exitosamente
```

### 3. Si hay error, verás exactamente qué devolvió la API

Por ejemplo:
```
[AuthService] Respuesta parseada: {
  "error": "El email ya está registrado"
}
```

## 🐛 Posibles Problemas

### Problema 1: "Credenciales inválidas"

**Causa**: Email o contraseña incorrectos

**Solución**: 
- Registra un nuevo usuario
- O verifica las credenciales

### Problema 2: "El email ya está registrado"

**Causa**: Ya existe un usuario con ese email

**Solución**: 
- Usa el login en lugar de registro
- O usa otro email

### Problema 3: "Login exitoso pero el servidor no devolvió tokens"

**Causa**: Tu backend está devolviendo 200 OK pero sin los campos `acces_token` e `id_token`

**Solución**: 
- Revisa la configuración de tu backend
- Verifica que esté devolviendo los tokens en la respuesta
- Revisa los logs para ver qué campos está devolviendo

### Problema 4: La API usa `access_token` (con 2 "s")

**Causa**: Tu API usa el nombre correcto `access_token` en lugar de `acces_token`

**Solución**: Actualiza `interfaces/auth.ts`:
```typescript
export interface AuthLoginResponse {
  message: string;
  email: string;
  role: string;
  access_token: string;  // Cambiar de acces_token a access_token
  id_token: string;
}
```

## ✅ Checklist

- [ ] La API responde (no hay errores de red)
- [ ] Estás usando credenciales válidas
- [ ] Ves los logs de `[AuthService] Respuesta parseada:`
- [ ] La respuesta incluye `acces_token` e `id_token`
- [ ] Los tokens se guardan exitosamente
- [ ] Redirige al home después del login

## 💡 Tip

Para probar rápidamente si tu API funciona, puedes usar este comando en tu terminal:

```bash
# Registro
node -e "fetch('https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev/register', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Test',email:'test@test.com',password:'test123'})}).then(r=>r.json()).then(console.log)"

# Login
node -e "fetch('https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'test@test.com',password:'test123'})}).then(r=>r.json()).then(console.log)"
```

Esto te mostrará exactamente qué devuelve tu API.
