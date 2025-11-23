import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FamiliaScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const familyMembers = [
        { id: 1, nombre: 'Juan Pérez', relacion: 'Padre', edad: 45, avatar: 'man' },
        { id: 2, nombre: 'Ana Pérez', relacion: 'Madre', edad: 42, avatar: 'woman' },
        { id: 3, nombre: 'Carlos Pérez', relacion: 'Hijo', edad: 15, avatar: 'boy' },
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title">Familia</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Gestiona tu grupo familiar
                    </ThemedText>
                </ThemedView>

                {/* Botón agregar miembro */}
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.tint }]}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>
                        Agregar Miembro
                    </Text>
                </TouchableOpacity>

                {/* Lista de miembros */}
                <ThemedView style={styles.membersList}>
                    {familyMembers.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            style={[styles.memberCard, { backgroundColor: colors.background }]}
                        >
                            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                                <Ionicons name="person" size={32} color="#fff" />
                            </View>
                            <View style={styles.memberInfo}>
                                <ThemedText style={styles.memberName}>{member.nombre}</ThemedText>
                                <ThemedText style={styles.memberRelation}>
                                    {member.relacion} • {member.edad} años
                                </ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={colors.icon} />
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                {/* Actividades recientes */}
                <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                        Actividades Recientes
                    </ThemedText>
                    <View style={styles.activityList}>
                        <View style={styles.activityItem}>
                            <Ionicons name="medical" size={20} color="#FF6B6B" />
                            <ThemedText style={styles.activityText}>
                                Cita médica - Carlos Pérez
                            </ThemedText>
                            <ThemedText style={styles.activityTime}>Hoy</ThemedText>
                        </View>
                        <View style={styles.activityItem}>
                            <Ionicons name="calendar" size={20} color="#4A90E2" />
                            <ThemedText style={styles.activityText}>
                                Vacunación - Ana Pérez
                            </ThemedText>
                            <ThemedText style={styles.activityTime}>Mañana</ThemedText>
                        </View>
                    </View>
                </ThemedView>
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
        padding: 20,
    },
    subtitle: {
        marginTop: 8,
        opacity: 0.7,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    membersList: {
        padding: 16,
        gap: 12,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        gap: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '600',
    },
    memberRelation: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 4,
    },
    card: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        marginBottom: 16,
    },
    activityList: {
        gap: 16,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityText: {
        flex: 1,
        fontSize: 14,
    },
    activityTime: {
        fontSize: 12,
        opacity: 0.7,
    },
});
