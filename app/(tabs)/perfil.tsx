import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text as RNText, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleLogout = async () => {
        await logout();
        router.replace('/sign-in');
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header con botón de regreso */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                    <ThemedText type="title">Mi Perfil</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                        <Ionicons name="person" size={48} color="#fff" />
                    </View>
                    <ThemedText type="subtitle" style={styles.userName}>
                        {user?.nombre || 'Usuario'}
                    </ThemedText>
                </View>

                {/* Información del usuario */}
                <ThemedView style={styles.infoContainer}>
                    <ThemedView style={[styles.infoBox, { backgroundColor: colors.background }]}>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={20} color={colors.icon.default} />
                            <View style={styles.infoContent}>
                                <ThemedText style={styles.label}>Correo</ThemedText>
                                <ThemedText style={styles.value}>{user?.correo || 'No disponible'}</ThemedText>
                            </View>
                        </View>
                    </ThemedView>

                    <ThemedView style={[styles.infoBox, { backgroundColor: colors.background }]}>
                        <View style={styles.infoRow}>
                            <Ionicons name="person-outline" size={20} color={colors.icon.default} />
                            <View style={styles.infoContent}>
                                <ThemedText style={styles.label}>Nombre</ThemedText>
                                <ThemedText style={styles.value}>{user?.nombre || 'No disponible'}</ThemedText>
                            </View>
                        </View>
                    </ThemedView>

                    <ThemedView style={[styles.infoBox, { backgroundColor: colors.background }]}>
                        <View style={styles.infoRow}>
                            <Ionicons
                                name={user?.sexo === 'M' ? 'male' : 'female'}
                                size={20}
                                color={colors.icon.default}
                            />
                            <View style={styles.infoContent}>
                                <ThemedText style={styles.label}>Sexo</ThemedText>
                                <ThemedText style={styles.value}>
                                    {user?.sexo === 'M' ? 'Masculino' : user?.sexo === 'F' ? 'Femenino' : 'No especificado'}
                                </ThemedText>
                            </View>
                        </View>
                    </ThemedView>

                    <ThemedView style={[styles.infoBox, { backgroundColor: colors.background }]}>
                        <View style={styles.infoRow}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={colors.icon.default} />
                            <View style={styles.infoContent}>
                                <ThemedText style={styles.label}>Rol</ThemedText>
                                <ThemedText style={styles.value}>{user?.rol || 'USER'}</ThemedText>
                            </View>
                        </View>
                    </ThemedView>
                </ThemedView>

                {/* Botón de cerrar sesión */}
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: '#FF6B6B' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <RNText style={styles.buttonText}>Cerrar Sesión</RNText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    infoContainer: {
        padding: 20,
        gap: 12,
    },
    infoBox: {
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    label: {
        fontSize: 12,
        opacity: 0.7,
        color: '#FFFFFF',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
