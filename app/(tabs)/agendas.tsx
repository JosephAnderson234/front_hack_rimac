import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AgendasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const appointments = [
    {
      id: 1,
      tipo: 'Consulta Médica',
      doctor: 'Dr. García',
      fecha: '2024-01-15',
      hora: '10:00 AM',
      icon: 'medical',
      color: '#FF6B6B',
    },
    {
      id: 2,
      tipo: 'Odontología',
      doctor: 'Dra. Martínez',
      fecha: '2024-01-18',
      hora: '3:00 PM',
      icon: 'fitness',
      color: '#4A90E2',
    },
    {
      id: 3,
      tipo: 'Control',
      doctor: 'Dr. López',
      fecha: '2024-01-22',
      hora: '11:30 AM',
      icon: 'heart',
      color: '#2ECC71',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Agendas</ThemedText>
          <ThemedText style={styles.subtitle}>
            Próximas citas médicas
          </ThemedText>
        </ThemedView>

        {/* Botón nueva cita */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <ThemedText style={styles.addButtonText}>
            Agendar Nueva Cita
          </ThemedText>
        </TouchableOpacity>

        {/* Lista de citas */}
        <ThemedView style={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              style={[styles.appointmentCard, { backgroundColor: colors.background }]}
            >
              <View style={[styles.iconContainer, { backgroundColor: appointment.color }]}>
                <Ionicons name={appointment.icon as any} size={28} color="#fff" />
              </View>
              <View style={styles.appointmentInfo}>
                <ThemedText style={styles.appointmentType}>
                  {appointment.tipo}
                </ThemedText>
                <ThemedText style={styles.appointmentDoctor}>
                  {appointment.doctor}
                </ThemedText>
                <View style={styles.dateTimeRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.icon} />
                  <ThemedText style={styles.dateTimeText}>
                    {appointment.fecha}
                  </ThemedText>
                  <Ionicons name="time-outline" size={14} color={colors.icon} />
                  <ThemedText style={styles.dateTimeText}>
                    {appointment.hora}
                  </ThemedText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.icon} />
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Recordatorios */}
        <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Recordatorios
          </ThemedText>
          <View style={styles.remindersList}>
            <View style={styles.reminderItem}>
              <Ionicons name="notifications" size={20} color="#FF9500" />
              <ThemedText style={styles.reminderText}>
                Tomar medicamento - 8:00 AM
              </ThemedText>
            </View>
            <View style={styles.reminderItem}>
              <Ionicons name="notifications" size={20} color="#FF9500" />
              <ThemedText style={styles.reminderText}>
                Ejercicio diario - 6:00 PM
              </ThemedText>
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
  appointmentsList: {
    padding: 16,
    gap: 12,
  },
  appointmentCard: {
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
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appointmentInfo: {
    flex: 1,
    gap: 4,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: '600',
  },
  appointmentDoctor: {
    fontSize: 14,
    opacity: 0.7,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: 12,
    opacity: 0.7,
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
  remindersList: {
    gap: 12,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
  },
});
