import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth';

export default function SignIn() {
    const { signIn, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        console.log('[SignIn] Iniciando login con:', email);
        if (!email || !password) {
            console.log('[SignIn] Faltan campos');
            Alert.alert('Error', 'Por favor ingresa email y contraseña');
            return;
        }
        try {
            console.log('[SignIn] Llamando a signIn context');
            await signIn({ email, password });
            console.log('[SignIn] Login exitoso');
        } catch (error: any) {
            console.error('[SignIn] Error:', error);
            Alert.alert('Error', error.message || 'Credenciales inválidas o error de conexión');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>

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

            <Button title={isLoading ? "Cargando..." : "Ingresar"} onPress={handleSignIn} disabled={isLoading} />

            <ThemedText
                type="link"
                style={styles.link}
                onPress={() => {
                    // @ts-ignore
                    router.push('/sign-up')
                }}
            >
                ¿No tienes cuenta? Regístrate
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
