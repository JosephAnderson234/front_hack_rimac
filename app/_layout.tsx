import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import messaging from '@react-native-firebase/messaging';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
// IMPORTANTE: Importar el handler para que se registre al inicio
import '../utils/backgroundHandler';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Esperar a que termine de cargar la autenticación
    if (isLoading) {
      console.log('[RootLayout] Cargando autenticación...');
      return;
    }
    
    // Esperar a que la navegación esté lista
    if (!rootNavigationState?.key) {
      console.log('[RootLayout] Navegación no lista...');
      return;
    }

    console.log('[RootLayout] User:', user);
    console.log('[RootLayout] Segments:', segments);

    const inAuthScreens = segments[0] === 'sign-in' || segments[0] === 'sign-up';
    const inTabs = segments[0] === '(tabs)';

    // Si no está autenticado y no está en pantallas de auth, redirigir a sign-in
    if (!user && !inAuthScreens) {
      console.log('[RootLayout] No autenticado, redirigiendo a sign-in...');
      router.replace('/sign-in');
    }
    // Si está autenticado y está en pantallas de auth, redirigir a salud
    else if (user && inAuthScreens) {
      console.log('[RootLayout] Autenticado en pantalla de auth, redirigiendo a salud...');
      router.replace('/(tabs)/salud');
    }
    // Si está autenticado pero no está en ninguna pantalla específica (app recién abierta)
    else if (user && !inTabs && !inAuthScreens) {
      console.log('[RootLayout] Autenticado al abrir app, redirigiendo a salud...');
      router.replace('/(tabs)/salud');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, segments, isLoading, rootNavigationState?.key]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // A. Configuración inicial: Permisos y Token FCM
    const setupNotifications = async () => {
      try {
        // 1. Solicitar permisos de notificaciones
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('⚠️ Permisos de notificaciones denegados');
          return;
        }

        // 2. Registrar dispositivo en Firebase (necesario para iOS)
        await messaging().registerDeviceForRemoteMessages();

        // 3. Obtener Token FCM (este es el que envías a AWS SNS)
        const token = await messaging().getToken();
        console.log('🔥 TOKEN FCM PARA AWS SNS:', token);
        
        // TODO: Enviar este token a tu backend para registrarlo en AWS SNS
        // await api.registerFCMToken(token);
      } catch (error) {
        console.error('❌ Error al configurar notificaciones:', error);
      }
    };

    setupNotifications();

    // B. Listener: Cuando el usuario TOCA la notificación (App abierta, cerrada o en background)
    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        console.log('👆 Usuario tocó la notificación:', data);

        // Navegación basada en la data recibida
        if (data?.url) {
          router.push(data.url as any);
        }
      }
    );

    // C. Listener: Mensajes en PRIMER PLANO (Foreground)
    // Cuando la app está abierta y activa
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('👀 Mensaje recibido en primer plano:', remoteMessage);

      // Mostrar notificación visual manualmente (Firebase no lo hace en foreground)
      if (remoteMessage.data) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: String(remoteMessage.data.titulo || 'Notificación'),
            body: String(remoteMessage.data.default || 'Tienes un mensaje nuevo'),
            data: remoteMessage.data,
            sound: 'default',
          },
          trigger: null, // null = mostrar inmediatamente
        });
      }
    });

    // Cleanup: Remover listeners al desmontar
    return () => {
      notificationResponseSubscription.remove();
      unsubscribeForeground();
    };
  }, [router]);

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
