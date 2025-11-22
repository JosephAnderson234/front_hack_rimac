import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, logout, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  if (user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.profileContainer}>
          <ThemedText type="title">Perfil</ThemedText>
          <ThemedView style={styles.infoBox}>
            <ThemedText type="defaultSemiBold">Email:</ThemedText>
            <ThemedText>{user.email}</ThemedText>
          </ThemedView>
          {user.name && (
            <ThemedView style={styles.infoBox}>
              <ThemedText type="defaultSemiBold">Nombre:</ThemedText>
              <ThemedText>{user.name}</ThemedText>
            </ThemedView>
          )}
          <ThemedView style={styles.infoBox}>
            <ThemedText type="defaultSemiBold">Rol:</ThemedText>
            <ThemedText>{user.role}</ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.tint }]}
            onPress={logout}
          >
            <ThemedText style={styles.buttonText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isLogin && { backgroundColor: colors.tint },
            ]}
            onPress={() => setIsLogin(true)}
          >
            <ThemedText
              style={[styles.toggleText, isLogin && styles.toggleTextActive]}
            >
              Iniciar Sesión
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isLogin && { backgroundColor: colors.tint },
            ]}
            onPress={() => setIsLogin(false)}
          >
            <ThemedText
              style={[styles.toggleText, !isLogin && styles.toggleTextActive]}
            >
              Registrarse
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  toggleText: {
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  profileContainer: {
    gap: 20,
  },
  infoBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 8,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
