import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = async () => {
    await logout();
    router.replace('/sign-in');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Mi Perfil</ThemedText>
        </View>

        <ThemedView style={styles.profileContainer}>
          <ThemedView style={styles.infoBox}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Email
            </ThemedText>
            <ThemedText>{user?.email}</ThemedText>
          </ThemedView>

          {user?.name && (
            <ThemedView style={styles.infoBox}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Nombre
              </ThemedText>
              <ThemedText>{user.name}</ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.infoBox}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Rol
            </ThemedText>
            <ThemedText>{user?.role}</ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.tint }]}
            onPress={handleLogout}
          >
            <ThemedText style={styles.buttonText}>Cerrar Sesión</ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
    padding: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  profileContainer: {
    gap: 16,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    gap: 8,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
