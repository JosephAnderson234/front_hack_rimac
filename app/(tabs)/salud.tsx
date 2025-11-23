import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

interface MovementRecord {
  timestamp: number;
}

interface SleepSession {
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // en minutos
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

type SleepState = 'monitoring' | 'sleeping' | 'awake';

export default function SaludScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  // Estados de sueño
  const [sleepState, setSleepState] = useState<SleepState>('monitoring');
  const [sleepSession, setSleepSession] = useState<SleepSession>({
    startTime: null,
    endTime: null,
    duration: 0,
    quality: 'fair',
  });
  const [movementCount, setMovementCount] = useState(0);

  // Referencias para el algoritmo de detección de pasos
  const lastMagnitude = useRef(0);
  const lastStepTime = useRef(0);
  const stepThreshold = useRef(0.8);
  const minStepInterval = useRef(200);

  // Referencias para detección de sueño
  const movementHistory = useRef<MovementRecord[]>([]);
  const potentialSleepStart = useRef<Date | null>(null);
  const lastWakeCheck = useRef<Date>(new Date());
  const sleepStateRef = useRef<SleepState>('monitoring');
  const movementThreshold = useRef(0.3);

  // Limpiar movimientos antiguos
  const cleanOldMovements = () => {
    const threeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
    movementHistory.current = movementHistory.current.filter(m => m.timestamp > threeHoursAgo);
  };

  // Detectar inicio de sueño
  const checkForSleepStart = () => {
    if (sleepStateRef.current !== 'monitoring') return;

    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    const movementsInLast2Hours = movementHistory.current.filter(m => m.timestamp >= twoHoursAgo).length;

    if (movementHistory.current.length === 0 || movementHistory.current[0].timestamp > twoHoursAgo - (30 * 60 * 1000)) {
      return;
    }

    const movementsPerHour = movementsInLast2Hours / 2;

    if (movementsPerHour < 5) {
      if (!potentialSleepStart.current) {
        const firstMovementInWindow = movementHistory.current.find(m => m.timestamp >= twoHoursAgo);
        potentialSleepStart.current = firstMovementInWindow 
          ? new Date(firstMovementInWindow.timestamp)
          : new Date(twoHoursAgo);
      }

      const timeSincePotentialStart = Date.now() - potentialSleepStart.current.getTime();
      if (timeSincePotentialStart >= 2 * 60 * 60 * 1000) {
        const actualSleepStart = potentialSleepStart.current;
        setSleepSession(prev => {
          if (!prev.startTime) {
            const currentDuration = Math.floor((Date.now() - actualSleepStart.getTime()) / 60000);
            return {
              ...prev,
              startTime: actualSleepStart,
              endTime: null,
              duration: currentDuration,
            };
          }
          return prev;
        });
        setMovementCount(0);
        setSleepState('sleeping');
        sleepStateRef.current = 'sleeping';
      }
    } else {
      potentialSleepStart.current = null;
    }
  };

  // Detectar despertar
  const checkForWakeUp = () => {
    if (sleepStateRef.current !== 'sleeping') return;

    const now = Date.now();
    const thirtyMinutesAgo = now - (30 * 60 * 1000);
    const recentMovements = movementHistory.current.filter(m => m.timestamp >= thirtyMinutesAgo).length;

    if (recentMovements > 10) {
      const timeSinceLastCheck = now - lastWakeCheck.current.getTime();
      if (timeSinceLastCheck >= 5 * 60 * 1000) {
        setSleepSession(prev => {
          const endTime = new Date();
          const startTime = prev.startTime || new Date();
          const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

          const movementsPerHour = duration > 0 ? (movementCount / duration) * 60 : movementCount;
          let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair';
          if (movementsPerHour < 5) quality = 'excellent';
          else if (movementsPerHour < 10) quality = 'good';
          else if (movementsPerHour < 20) quality = 'fair';
          else quality = 'poor';

          return {
            ...prev,
            endTime,
            duration,
            quality,
          };
        });
        potentialSleepStart.current = null;
        movementHistory.current = [];
        setMovementCount(0);
        setSleepState('awake');
        sleepStateRef.current = 'awake';
      }
    } else {
      lastWakeCheck.current = new Date();
    }
  };

  // Timer para actualizar duración y verificar estado de sueño
  useEffect(() => {
    const timer = setInterval(() => {
      cleanOldMovements();
      
      if (sleepState === 'sleeping' && sleepSession.startTime) {
        const now = new Date();
        const durationInMinutes = Math.floor((now.getTime() - sleepSession.startTime.getTime()) / 60000);
        setSleepSession(prev => {
          if (prev.duration !== durationInMinutes) {
            return { ...prev, duration: durationInMinutes };
          }
          return prev;
        });
      }

      checkForSleepStart();
      checkForWakeUp();
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepState, sleepSession.startTime, movementCount]);

  // Sincronizar ref con estado
  useEffect(() => {
    sleepStateRef.current = sleepState;
  }, [sleepState]);

  // Acelerómetro
  useEffect(() => {
    const subscribe = async () => {
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(available);

      if (available) {
        Accelerometer.setUpdateInterval(1000); // 1 segundo para ambos

        const subscription = Accelerometer.addListener(accelerometerData => {
          const { x, y, z } = accelerometerData;
          const magnitude = Math.sqrt(x * x + y * y + z * z);

          // Detectar pasos
          const currentTime = Date.now();
          const timeSinceLastStep = currentTime - lastStepTime.current;

          if (
            Math.abs(magnitude - lastMagnitude.current) > stepThreshold.current &&
            timeSinceLastStep > minStepInterval.current
          ) {
            setSteps(prevSteps => prevSteps + 1);
            lastStepTime.current = currentTime;
          }

          // Detectar movimientos para sueño
          if (Math.abs(magnitude - lastMagnitude.current) > movementThreshold.current) {
            const now = Date.now();
            movementHistory.current.push({ timestamp: now });

            if (sleepStateRef.current === 'sleeping') {
              setMovementCount(prev => prev + 1);
            }
          }

          lastMagnitude.current = magnitude;
        });

        return subscription;
      }
    };

    const subscription = subscribe();
    return () => {
      subscription.then(sub => sub && sub.remove());
    };
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
          {!isAvailable && Platform.OS !== 'web' ? (
            <View style={styles.stepsUnavailable}>
              <Ionicons name="alert-circle-outline" size={48} color="#fff" />
              <Text style={styles.unavailableText}>
                Acelerómetro no disponible
              </Text>
              <Text style={styles.unavailableSubtext}>
                El contador de pasos requiere un acelerómetro
              </Text>
            </View>
          ) : Platform.OS === 'web' ? (
            <View style={styles.stepsUnavailable}>
              <Ionicons name="information-circle-outline" size={48} color="#fff" />
              <Text style={styles.unavailableText}>
                No disponible en web
              </Text>
              <Text style={styles.unavailableSubtext}>
                Usa la app móvil para contar pasos
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}
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
              <View style={[
                styles.metricIcon,
                sleepState === 'sleeping' && { backgroundColor: 'rgba(155, 89, 182, 0.2)' }
              ]}>
                <Ionicons name="moon" size={24} color="#9B59B6" />
              </View>
              <View style={styles.metricInfo}>
                <View style={styles.metricHeader}>
                  <ThemedText style={styles.metricName}>Sueño</ThemedText>
                  {sleepState === 'sleeping' && (
                    <View style={styles.sleepingBadge}>
                      <View style={styles.sleepingDot} />
                      <Text style={styles.sleepingText}>Durmiendo</Text>
                    </View>
                  )}
                </View>
                <ThemedText style={styles.metricValue}>
                  {sleepSession.duration > 0 
                    ? `${Math.floor(sleepSession.duration / 60)}h ${sleepSession.duration % 60}m`
                    : sleepState === 'monitoring' 
                      ? 'Monitoreando...'
                      : '0h 0m'
                  }
                </ThemedText>
                {sleepSession.endTime && sleepSession.quality && (
                  <View style={styles.qualityBadge}>
                    <Ionicons 
                      name="star" 
                      size={12} 
                      color={
                        sleepSession.quality === 'excellent' ? '#4CAF50' :
                        sleepSession.quality === 'good' ? '#8BC34A' :
                        sleepSession.quality === 'fair' ? '#FFC107' : '#F44336'
                      } 
                    />
                    <Text style={[
                      styles.qualityText,
                      { color: 
                        sleepSession.quality === 'excellent' ? '#4CAF50' :
                        sleepSession.quality === 'good' ? '#8BC34A' :
                        sleepSession.quality === 'fair' ? '#FFC107' : '#F44336'
                      }
                    ]}>
                      {sleepSession.quality === 'excellent' ? 'Excelente' :
                       sleepSession.quality === 'good' ? 'Buena' :
                       sleepSession.quality === 'fair' ? 'Regular' : 'Pobre'}
                    </Text>
                  </View>
                )}
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
    color: '#000',
  },
  stepsLabel: {
    fontSize: 16,
    color: '#000',
    opacity: 0.9,
    marginTop: 4,
  },
  stepsGoal: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(152, 178, 249, 0.94)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  stepsUnavailable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  unavailableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  unavailableSubtext: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
    textAlign: 'center',
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
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sleepingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sleepingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9B59B6',
  },
  sleepingText: {
    fontSize: 10,
    color: '#9B59B6',
    fontWeight: '600',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  qualityText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
