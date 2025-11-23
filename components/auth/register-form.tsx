import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logger } from '@/utils/logger';
import { validateRegisterData } from '@/utils/validation';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    // Validar datos
    const validation = validateRegisterData(name, email, password);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
      logger.log('[RegisterForm] Registro exitoso');
    } catch (error: any) {
      logger.error('[RegisterForm] Error:', error);
      Alert.alert('Error', error.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
        placeholder="Nombre"
        placeholderTextColor={colors.icon}
        value={name}
        onChangeText={setName}
        editable={!isLoading}
        autoComplete="name"
      />

      <TextInput
        style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
        autoComplete="email"
      />

      <TextInput
        style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
        placeholder="Contraseña"
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
        autoComplete="password"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Registrarse</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
