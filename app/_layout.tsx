import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
    if (isLoading) return;
    if (!rootNavigationState?.key) return;

    console.log('[RootLayout] User:', user);
    console.log('[RootLayout] Segments:', segments);

    const inAuthScreens = segments[0] === 'sign-in' || segments[0] === 'sign-up';
    const inTabs = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const isIndex = segments.length === 0 || segments[0] === 'index';

    // Permitir index y onboarding sin autenticación
    if (isIndex || inOnboarding) {
      return;
    }

    // Si no está autenticado y no está en pantallas de auth, redirigir a sign-in
    if (!user && !inAuthScreens) {
      console.log('[RootLayout] No autenticado, redirigiendo a sign-in...');
      router.replace('/sign-in');
    }
    // Si está autenticado y está en pantallas de auth, redirigir a tabs
    else if (user && inAuthScreens) {
      console.log('[RootLayout] Autenticado, redirigiendo a tabs...');
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, rootNavigationState?.key]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
