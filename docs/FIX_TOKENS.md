# Fix: Error al Guardar Tokens

## 🐛 Problema Original

```
Error: Invalid value provided to SecureStore. 
Values must be strings; consider JSON-encoding your values if they are serializable.
```

## ✅ Solución Implementada

### 1. Validación de Tokens en Storage

Agregado validación en `services/auth/storage.ts`:
- Verifica que los tokens sean strings válidos
- Verifica que no sean `null` o `undefined`
- Lanza error descriptivo si faltan

```typescript
if (!accessToken || typeof accessToken !== 'string') {
  throw new Error('Access token inválido');
}
```

### 2. Validación en API Service

Agregado validación en `services/auth/api.ts`:
- Verifica que la respuesta contenga los tokens
- Log detallado de la respuesta parseada
- Error descriptivo si faltan tokens

```typescript
if (!result.acces_token || !result.id_token) {
  throw new AuthError('La respuesta del servidor no contiene tokens válidos');
}
```

### 3. Logs Mejorados

Ahora verás en la consola:
```
[AuthService] Respuesta parseada: {
  "message": "...",
  "email": "...",
  "role": "...",
  "acces_token": "...",
  "id_token": "..."
}
[AuthService] Guardando tokens...
[TokenStorage] Tokens guardados exitosamente
```

## 🔍 Debugging

Si el error persiste, revisa:

### 1. Formato de la Respuesta de la API

La API debe devolver:
```json
{
  "message": "Login exitoso",
  "email": "user@example.com",
  "role": "user",
  "acces_token": "eyJhbGc...",  // ⚠️ Nota: "acces" con una sola "s"
  "id_token": "eyJhbGc..."
}
```

### 2. Verifica los Logs

Busca en la consola:
```
[AuthService] Respuesta parseada: {...}
```

Si ves `null`, `undefined`, o los campos no existen, el problema está en la API.

### 3. Prueba la API Directamente

```bash
curl -X POST https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Verifica que la respuesta incluya `acces_token` e `id_token`.

## 🎯 Casos Comunes

### Caso 1: API devuelve tokens pero con nombres diferentes

Si tu API usa `access_token` (con dos "s") en lugar de `acces_token`:

**Solución**: Actualiza `interfaces/auth.ts`:
```typescript
export interface AuthLoginResponse {
  message: string;
  email: string;
  role: string;
  access_token: string;  // Cambiar aquí
  id_token: string;
}
```

### Caso 2: Tokens vienen en un objeto anidado

Si la respuesta es:
```json
{
  "data": {
    "tokens": {
      "access": "...",
      "id": "..."
    }
  }
}
```

**Solución**: Actualiza la interfaz y el código de guardado.

### Caso 3: API no devuelve tokens

Si la API solo devuelve un mensaje de éxito sin tokens:

**Solución**: Necesitas modificar tu backend para que devuelva los tokens, o implementar un flujo de autenticación diferente.

## 📊 Checklist de Verificación

- [ ] La API devuelve `acces_token` e `id_token`
- [ ] Los tokens son strings válidos (no null/undefined)
- [ ] Los nombres de los campos coinciden con la interfaz
- [ ] Ves el log `[TokenStorage] Tokens guardados exitosamente`
- [ ] No hay errores de SecureStore en la consola

## 💡 Nota sobre el Typo

La API usa `acces_token` (una sola "s") en lugar de `access_token` (dos "s").
Esto es probablemente un typo en el backend, pero el código está adaptado para funcionar con eso.
