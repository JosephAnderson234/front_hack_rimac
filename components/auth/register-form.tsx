import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sexo, setSexo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'La contraseña debe tener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'La contraseña debe tener al menos una letra minúscula';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'La contraseña debe tener al menos un número';
    }
    return null;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !sexo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    console.log('[RegisterForm] Iniciando registro con:', { name, email, sexo });
    setIsLoading(true);
    try {
      await register({ name, email, password, sexo });
      console.log('[RegisterForm] Registro exitoso');
      // El layout se encargará de la redirección automáticamente
    } catch (error: any) {
      console.error('[RegisterForm] Error en registro:', error);
      Alert.alert(
        'Error',
        error.message || 'Error al registrarse. Intenta con otro email.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Crear Cuenta
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.icon, color: colors.text },
        ]}
        placeholder="Nombre"
        placeholderTextColor={colors.icon}
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.icon, color: colors.text },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.icon, color: colors.text },
        ]}
        placeholder="Contraseña"
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <View style={styles.sexoContainer}>
        <ThemedText style={styles.sexoLabel}>Sexo</ThemedText>
        <View style={styles.sexoButtons}>
          <TouchableOpacity
            style={[
              styles.sexoButton,
              sexo === 'masculino' && { backgroundColor: colors.tint },
              { borderColor: colors.icon },
            ]}
            onPress={() => setSexo('masculino')}
            disabled={isLoading}
          >
            <ThemedText
              style={[
                styles.sexoButtonText,
                sexo === 'masculino' && styles.sexoButtonTextActive,
              ]}
            >
              Masculino
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexoButton,
              sexo === 'femenino' && { backgroundColor: colors.tint },
              { borderColor: colors.icon },
            ]}
            onPress={() => setSexo('femenino')}
            disabled={isLoading}
          >
            <ThemedText
              style={[
                styles.sexoButtonText,
                sexo === 'femenino' && styles.sexoButtonTextActive,
              ]}
            >
              Femenino
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexoButton,
              sexo === 'otro' && { backgroundColor: colors.tint },
              { borderColor: colors.icon },
            ]}
            onPress={() => setSexo('otro')}
            disabled={isLoading}
          >
            <ThemedText
              style={[
                styles.sexoButtonText,
                sexo === 'otro' && styles.sexoButtonTextActive,
              ]}
            >
              Otro
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

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
  title: {
    marginBottom: 20,
    textAlign: 'center',
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
  sexoContainer: {
    gap: 8,
  },
  sexoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  sexoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sexoButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  sexoButtonText: {
    fontSize: 14,
  },
  sexoButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
