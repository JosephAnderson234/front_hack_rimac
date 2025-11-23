# Healtec - Health & Fitness Tracker 🏃‍♂️

App móvil de seguimiento de salud y fitness con notificaciones push, autenticación y contador de pasos.

## ⚠️ Importante: Development Build Requerido

Esta app usa módulos nativos (Firebase Messaging, Notifee) que **NO funcionan en Expo Go**.

Debes crear un **Development Build** para ejecutar la app.

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar EAS CLI (solo una vez)

```bash
npm install -g eas-cli
eas login
```

### 3. Crear Development Build

**Opción A - Script interactivo:**
```bash
npm run build:dev
```

**Opción B - Comandos directos:**
```bash
# Android
npm run build:dev:android

# iOS
npm run build:dev:ios
```

### 4. Instalar la app en tu dispositivo

Una vez completado el build (~10-15 min), recibirás un link para descargar e instalar la app.

### 5. Iniciar el servidor de desarrollo

```bash
npm run start:dev
```

Escanea el QR con tu **Development Build** (NO con Expo Go).

## 📚 Documentación

- **[QUICK_START.md](./QUICK_START.md)** - Guía rápida de inicio
- **[DEVELOPMENT_BUILD_SETUP.md](./DEVELOPMENT_BUILD_SETUP.md)** - Configuración detallada del Development Build
- **[AWS_SNS_SETUP.md](./AWS_SNS_SETUP.md)** - Configuración de notificaciones push con AWS SNS

## 🏗️ Arquitectura

- **Framework**: Expo + React Native
- **Routing**: Expo Router (file-based routing)
- **Autenticación**: AWS Cognito + Context API
- **Notificaciones**: Firebase Cloud Messaging + Notifee + AWS SNS
- **Sensores**: Expo Sensors (pedometer)
- **Storage**: Expo SecureStore

## 📱 Características

- ✅ Autenticación con email/password
- ✅ Contador de pasos con sensor del dispositivo
- ✅ Notificaciones push (foreground, background, quit state)
- ✅ Navegación profunda desde notificaciones
- ✅ Tema claro/oscuro automático
- ✅ Protección de rutas según autenticación

## 🛠️ Scripts Disponibles

```bash
npm run start:dev          # Iniciar con development client
npm run build:dev          # Script interactivo para crear build
npm run build:dev:android  # Crear build de desarrollo para Android
npm run build:dev:ios      # Crear build de desarrollo para iOS
npm run android            # Ejecutar en Android (local)
npm run ios                # Ejecutar en iOS (local)
npm run lint               # Ejecutar linter
```

## 📂 Estructura del Proyecto

```
app/
├── (tabs)/           # Pantallas principales con tabs
├── sign-in.tsx       # Pantalla de login
├── sign-up.tsx       # Pantalla de registro
└── _layout.tsx       # Layout raíz con navegación y notificaciones

components/
├── auth/             # Componentes de autenticación
└── ui/               # Componentes de UI reutilizables

contexts/
└── auth-context.tsx  # Context de autenticación

services/
├── auth-service.ts           # Servicio de autenticación
└── notification-service.ts   # Servicio de notificaciones
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
EXPO_PUBLIC_AUTH_URL=https://tu-api.execute-api.us-east-1.amazonaws.com/dev
```

### Firebase

Asegúrate de tener `credentials_fire.json` (google-services.json) en la raíz del proyecto.

## 🧪 Testing

Para probar notificaciones:

1. Instala el Development Build
2. Copia el FCM Token de los logs
3. Usa Firebase Console o AWS SNS para enviar notificaciones de prueba

## 📖 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Firebase](https://rnfirebase.io/)
- [Notifee](https://notifee.app/)
- [AWS SNS Mobile Push](https://docs.aws.amazon.com/sns/latest/dg/sns-mobile-application-as-subscriber.html)

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
