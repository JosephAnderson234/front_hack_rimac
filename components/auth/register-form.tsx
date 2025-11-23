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
} from 'react-native';

export function RegisterForm() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [sexo, setSexo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!nombre || !correo || !contrasena || !sexo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    console.log('[RegisterForm] Iniciando registro con:', { nombre, correo, sexo });
    setIsLoading(true);
    try {
      await register({ nombre, correo, contrasena, sexo });
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
          { borderColor: colors.icon.default, color: colors.text.primary },
        ]}
        placeholder="Nombre"
        placeholderTextColor={colors.icon.secondary}
        value={nombre}
        onChangeText={setNombre}
        editable={!isLoading}
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.icon.default, color: colors.text.primary },
        ]}
        placeholder="Correo"
        placeholderTextColor={colors.icon.secondary}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.icon.default, color: colors.text.primary },
        ]}
        placeholder="Contraseña"
        placeholderTextColor={colors.icon.secondary}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        editable={!isLoading}
      />

      <ThemedView style={styles.sexoContainer}>
        <TouchableOpacity
          style={[
            styles.sexoButton,
            { borderColor: colors.icon.default },
            sexo === 'M' && { backgroundColor: colors.tint, borderColor: colors.tint }
          ]}
          onPress={() => setSexo('M')}
          disabled={isLoading}
        >
          <ThemedText style={[styles.sexoText, sexo === 'M' && { color: '#FFFFFF' }]}>
            Masculino
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sexoButton,
            { borderColor: colors.icon.default },
            sexo === 'F' && { backgroundColor: colors.tint, borderColor: colors.tint }
          ]}
          onPress={() => setSexo('F')}
          disabled={isLoading}
        >
          <ThemedText style={[styles.sexoText, sexo === 'F' && { color: '#FFFFFF' }]}>
            Femenino
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

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
  sexoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sexoButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  sexoText: {
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
