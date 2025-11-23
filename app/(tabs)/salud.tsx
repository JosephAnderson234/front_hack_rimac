import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SaludScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [steps, setSteps] = useState(0);

  // Simulación de contador de pasos (en producción usarías un sensor real)
  useEffect(() => {
    // Iniciar con un valor base
    setSteps(8432);
    
    // Simular incremento de pasos cada 5 segundos
    const interval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Salud</ThemedText>
          <ThemedText style={styles.subtitle}>
            Monitorea tu bienestar
          </ThemedText>
        </ThemedView>

        {/* Contador de Pasos Principal */}
        <ThemedView style={[styles.stepsCard, { backgroundColor: colors.tint }]}>
          <View style={styles.stepsContent}>
            <Ionicons name="footsteps" size={48} color="#fff" />
            <View style={styles.stepsInfo}>
              <Text style={styles.stepsValue}>{steps.toLocaleString()}</Text>
              <Text style={styles.stepsLabel}>Pasos Hoy</Text>
            </View>
          </View>
          <View style={styles.stepsGoal}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((steps / 10000) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.goalText}>
              Meta: 10,000 pasos
            </Text>
          </View>
        </ThemedView>

        {/* Resumen de salud */}
        <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Resumen de Hoy
          </ThemedText>
          <View style={styles.statsGrid}>
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
            <View style={styles.statItem}>
              <Ionicons name="speedometer" size={32} color="#4A90E2" />
              <ThemedText style={styles.statValue}>5.2</ThemedText>
              <ThemedText style={styles.statLabel}>km</ThemedText>
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
  stepsCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  stepsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  stepsInfo: {
    flex: 1,
  },
  stepsValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  stepsGoal: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
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
    backgroundColor: 'rgba(128,128,128,0.15)',
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
