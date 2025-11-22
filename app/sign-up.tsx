import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth';

export default function SignUp() {
    const { signUp, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        console.log('[SignUp] Iniciando registro con:', { name, email });
        if (!name || !email || !password) {
            console.log('[SignUp] Faltan campos');
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        try {
            console.log('[SignUp] Llamando a signUp context');
            await signUp({ name, email, password });
            console.log('[SignUp] Registro exitoso');
        } catch (error: any) {
            console.error('[SignUp] Error:', error);
            Alert.alert('Error', error.message || 'No se pudo registrar el usuario');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Registrarse</ThemedText>

            <ThemedText type="defaultSemiBold">Nombre</ThemedText>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="#888"
            />

            <ThemedText type="defaultSemiBold">Email</ThemedText>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@correo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#888"
            />

            <ThemedText type="defaultSemiBold">Contraseña</ThemedText>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                secureTextEntry
                placeholderTextColor="#888"
            />

            <Button title={isLoading ? "Cargando..." : "Registrarse"} onPress={handleSignUp} disabled={isLoading} />

            <ThemedText
                type="link"
                style={styles.link}
                onPress={() => router.back()}
            >
                ¿Ya tienes cuenta? Inicia sesión
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
    },
});
