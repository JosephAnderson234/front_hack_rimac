import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SaludScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Salud</ThemedText>
          <ThemedText style={styles.subtitle}>
            Monitorea tu bienestar
          </ThemedText>
        </ThemedView>

        {/* Resumen de salud */}
        <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Resumen de Hoy
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="footsteps" size={32} color={colors.tint} />
              <ThemedText style={styles.statValue}>8,432</ThemedText>
              <ThemedText style={styles.statLabel}>Pasos</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={32} color="#FF6B6B" />
              <ThemedText style={styles.statValue}>72</ThemedText>
              <ThemedText style={styles.statLabel}>BPM</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={32} color="#FF9500" />
              <ThemedText style={styles.statValue}>420</ThemedText>
              <ThemedText style={styles.statLabel}>Calorías</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Métricas de salud */}
        <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Métricas de Salud
          </ThemedText>
          <View style={styles.metricsList}>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Ionicons name="water" size={24} color="#4A90E2" />
              </View>
              <View style={styles.metricInfo}>
                <ThemedText style={styles.metricName}>Hidratación</ThemedText>
                <ThemedText style={styles.metricValue}>1.5L / 2.0L</ThemedText>
              </View>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Ionicons name="moon" size={24} color="#9B59B6" />
              </View>
              <View style={styles.metricInfo}>
                <ThemedText style={styles.metricName}>Sueño</ThemedText>
                <ThemedText style={styles.metricValue}>7h 30min</ThemedText>
              </View>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricIcon}>
                <Ionicons name="fitness" size={24} color="#2ECC71" />
              </View>
              <View style={styles.metricInfo}>
                <ThemedText style={styles.metricName}>Ejercicio</ThemedText>
                <ThemedText style={styles.metricValue}>45 minutos</ThemedText>
              </View>
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  metricsList: {
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
});
