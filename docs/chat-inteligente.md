# Chat Inteligente - Documentación

## Descripción
El Chat Inteligente es un asistente médico de acompañamiento que aparece como un botón flotante en las pestañas de Salud, Agendas y Recetas.

## Ubicación del Botón Flotante
- **Posición Vertical**: 100px desde la parte inferior (evita colisión con Dynamic Island y tab bar)
- **Posición Horizontal**: Lado derecho (20px del borde)
- **Tamaño**: 60x60 píxeles
- **Estilo**: Botón circular con icono de chat y sombra

## Contextos Automáticos
El chat ajusta automáticamente su contexto según la pestaña:

| Pestaña | Contexto |
|---------|----------|
| Salud | Estadisticas |
| Agendas | Servicios |
| Recetas | Recetas |

## Endpoint API
- **URL**: `https://rk6wgnrpsc.execute-api.us-east-1.amazonaws.com/dev`
- **Método**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

## Formato de Solicitud
```json
{
  "mensaje": "Hola, comentame cuál es tu propósito",
  "contexto": "General"
}
```

## Formato de Respuesta
```json
{
  "respuesta": "¡Hola! Mi principal objetivo es ser tu asistente médico...",
  "contexto": "Servicios",
  "timestamp": "2025-11-23T15:15:24.772629",
  "usuario": {
    "correo": "usuario@ejemplo.com",
    "nombre": "Nombre Usuario"
  }
}
```

## Características
- ✅ Conversación estilo WhatsApp
- ✅ Historial de mensajes mantenido durante la sesión
- ✅ Selector de contexto manual (General, Estadisticas, Servicios, Recetas)
- ✅ Indicador de carga mientras se procesa el mensaje
- ✅ Scroll automático al último mensaje
- ✅ Botón para limpiar el chat
- ✅ Autenticación con token JWT

## Archivos Modificados
1. `components/chat-inteligente.tsx` - Componente principal del chat
2. `app/(tabs)/salud.tsx` - Botón flotante con contexto "Estadisticas"
3. `app/(tabs)/agendas.tsx` - Botón flotante con contexto "Servicios"
4. `app/(tabs)/recetas.tsx` - Botón flotante con contexto "Recetas"

## Logs de Depuración

El chat incluye logs detallados para facilitar la depuración:

### Logs del Componente Chat
- `[ChatInteligente] Contexto inicial actualizado` - Cuando cambia el contexto
- `[ChatInteligente] Modal abierto/cerrado` - Estado del modal
- `[ChatInteligente] Enviando mensaje` - Detalles del mensaje y contexto
- `[ChatInteligente] Obteniendo token` - Proceso de autenticación
- `[ChatInteligente] Token obtenido` - Primeros 20 caracteres del token
- `[ChatInteligente] Request body` - Cuerpo de la petición
- `[ChatInteligente] Response status` - Código de respuesta HTTP
- `[ChatInteligente] Response data` - Datos completos de la respuesta
- `[ChatInteligente] Mensaje del bot` - Primeros 100 caracteres de la respuesta
- `[ChatInteligente] Error completo` - Detalles de errores
- `[ChatInteligente] Cambiando contexto` - Cambios de contexto manual
- `[ChatInteligente] Limpiando chat` - Cantidad de mensajes eliminados

### Logs de las Pestañas
- `[SaludScreen] Abriendo/Cerrando chat` - Acciones en pestaña Salud
- `[AgendasScreen] Abriendo/Cerrando chat` - Acciones en pestaña Agendas
- `[RecetasScreen] Abriendo/Cerrando chat` - Acciones en pestaña Recetas

### Cómo Ver los Logs
En desarrollo, los logs se pueden ver en:
- **Expo**: Terminal donde corre `expo start`
- **React Native Debugger**: Consola del debugger
- **Chrome DevTools**: Consola del navegador (para web)
- **Android**: `adb logcat` o Android Studio Logcat
- **iOS**: Xcode Console
