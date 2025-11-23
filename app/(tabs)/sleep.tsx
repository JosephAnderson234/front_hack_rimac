import { StarBackground } from '@/components/star-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Accelerometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface SleepSession {
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // en minutos
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

type SleepState = 'monitoring' | 'sleeping' | 'awake';

interface MovementRecord {
  timestamp: number;
}

export default function SleepScreen() {
  const [sleepState, setSleepState] = useState<SleepState>('monitoring');
  const [sleepSession, setSleepSession] = useState<SleepSession>({
    startTime: null,
    endTime: null,
    duration: 0,
    quality: 'fair',
  });
  const [movementCount, setMovementCount] = useState(0);
  const [totalMovements, setTotalMovements] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const lastMagnitude = useRef(0);
  const movementThreshold = useRef(0.3);
  const subscriptionRef = useRef<any>(null);
  const movementHistory = useRef<MovementRecord[]>([]);
  const potentialSleepStart = useRef<Date | null>(null);
  const lastWakeCheck = useRef<Date>(new Date());
  const sleepStateRef = useRef<SleepState>('monitoring');
  const lowMovementStartTime = useRef<Date | null>(null); // Cuándo comenzó el período de bajo movimiento

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  // Limpiar movimientos antiguos (más de 3 horas)
  const cleanOldMovements = () => {
    const threeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
    movementHistory.current = movementHistory.current.filter(
      m => m.timestamp > threeHoursAgo
    );
  };

  // Calcular movimientos por hora en una ventana de tiempo
  const getMovementsPerHour = (hours: number): number => {
    const now = Date.now();
    const windowStart = now - (hours * 60 * 60 * 1000);
    const movementsInWindow = movementHistory.current.filter(
      m => m.timestamp >= windowStart
    ).length;
    
    // Si no hay suficiente historial, retornar un valor alto para evitar detección prematura
    if (movementHistory.current.length === 0) {
      return 100; // Valor alto para evitar detección
    }
    
    // Verificar que tengamos datos que cubran al menos el 80% de la ventana
    const oldestMovement = movementHistory.current[0]?.timestamp || now;
    const coverage = (now - oldestMovement) / (hours * 60 * 60 * 1000);
    
    if (coverage < 0.8) {
      // No tenemos suficiente historial, retornar valor alto
      return 100;
    }
    
    return movementsInWindow / hours;
  };

  // Detectar inicio de sueño: menos de 5 movimientos/hora durante 2 horas
  const checkForSleepStart = useCallback(() => {
    setSleepState(currentState => {
      sleepStateRef.current = currentState;
      if (currentState !== 'monitoring') return currentState;

      // Necesitamos al menos 2 horas de historial para detectar
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const movementsInLast2Hours = movementHistory.current.filter(
        m => m.timestamp >= twoHoursAgo
      ).length;
      
      // Solo verificar si tenemos suficiente historial (al menos 1.5 horas de datos)
      if (movementHistory.current.length === 0 || 
          movementHistory.current[0].timestamp > twoHoursAgo - (30 * 60 * 1000)) {
        // No tenemos suficiente historial aún, no hacer nada
        return currentState;
      }

      const movementsPerHour = movementsInLast2Hours / 2;
      
      if (movementsPerHour < 5) {
        // Si no tenemos un inicio potencial, marcarlo (cuando comenzó el período de bajo movimiento)
        if (!potentialSleepStart.current) {
          // Guardar el momento en que comenzó el período de bajo movimiento
          // Usar el timestamp del primer movimiento en la ventana de 2 horas
          const firstMovementInWindow = movementHistory.current.find(
            m => m.timestamp >= twoHoursAgo
          );
          potentialSleepStart.current = firstMovementInWindow 
            ? new Date(firstMovementInWindow.timestamp)
            : new Date(twoHoursAgo);
        }
        
        // Confirmar que llevamos al menos 2 horas con bajo movimiento
        const timeSincePotentialStart = Date.now() - potentialSleepStart.current.getTime();
        if (timeSincePotentialStart >= 2 * 60 * 60 * 1000) {
          // ¡Detectamos inicio de sueño!
          // El inicio real es cuando comenzó el período de bajo movimiento
          const actualSleepStart = potentialSleepStart.current;
          
          setSleepSession(prev => {
            // Solo actualizar si no hay un startTime ya establecido
            if (!prev.startTime) {
              // Calcular la duración actual desde el inicio real
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
          
          setMovementCount(0); // Resetear contador para la sesión de sueño
          sleepStateRef.current = 'sleeping';
          return 'sleeping';
        }
      } else {
        // Si hay muchos movimientos, resetear el inicio potencial
        potentialSleepStart.current = null;
        lowMovementStartTime.current = null;
      }
      
      return currentState;
    });
  }, []);

  // Detectar despertar: más de 10 movimientos en los últimos 30 minutos
  const checkForWakeUp = useCallback(() => {
    setSleepState(currentState => {
      sleepStateRef.current = currentState;
      if (currentState !== 'sleeping') return currentState;

      const now = Date.now();
      const thirtyMinutesAgo = now - (30 * 60 * 1000);
      const recentMovements = movementHistory.current.filter(
        m => m.timestamp >= thirtyMinutesAgo
      ).length;

      if (recentMovements > 10) {
        // Verificar que no sea un falso positivo (esperar un poco más)
        const timeSinceLastCheck = now - lastWakeCheck.current.getTime();
        if (timeSinceLastCheck >= 5 * 60 * 1000) { // Esperar 5 minutos para confirmar
          // ¡Detectamos despertar!
          setSleepSession(prev => {
            const endTime = new Date();
            const startTime = prev.startTime || new Date();
            const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
            
            // Calcular calidad
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
          lowMovementStartTime.current = null;
          movementHistory.current = [];
          setMovementCount(0);
          sleepStateRef.current = 'awake';
          return 'awake';
        }
      } else {
        lastWakeCheck.current = new Date();
      }
      
      return currentState;
    });
  }, [movementCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      cleanOldMovements();
      
      if (sleepState === 'sleeping' && sleepSession.startTime) {
        const now = new Date();
        const durationInMs = now.getTime() - sleepSession.startTime.getTime();
        const totalSeconds = Math.floor(durationInMs / 1000);
        const durationInMinutes = Math.floor(totalSeconds / 60);
        
        setElapsedSeconds(totalSeconds);
        setSleepSession(prev => {
          if (prev.duration !== durationInMinutes) {
            return { ...prev, duration: durationInMinutes };
          }
          return prev;
        });
      } else {
        setElapsedSeconds(0);
      }

      // Verificar detección de sueño cada minuto
      checkForSleepStart();
      checkForWakeUp();
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepState, sleepSession.startTime]);

  // Sincronizar ref con estado
  useEffect(() => {
    sleepStateRef.current = sleepState;
  }, [sleepState]);

  // Iniciar monitoreo automático al montar el componente
  useEffect(() => {
    startMonitoring();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);


  const startMonitoring = async () => {
    try {
      const available = await Accelerometer.isAvailableAsync();
      if (!available) {
        console.warn('Acelerómetro no disponible');
        return;
      }

      Accelerometer.setUpdateInterval(1000); // 1 segundo

      const subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        // Detectar movimiento significativo
        if (Math.abs(magnitude - lastMagnitude.current) > movementThreshold.current) {
          const now = Date.now();
          
          // Agregar a historial
          movementHistory.current.push({ timestamp: now });
          
          // Incrementar contador total siempre
          setTotalMovements(prev => prev + 1);
          
          // Si estamos durmiendo, incrementar contador de la sesión de sueño
          if (sleepStateRef.current === 'sleeping') {
            setMovementCount(prev => prev + 1);
          }
          
          // Animar indicador cuando hay movimiento
          scale.value = withSpring(1.1, { damping: 10 });
          opacity.value = withTiming(1, { duration: 200 });
          
          setTimeout(() => {
            scale.value = withSpring(1, { damping: 10 });
            opacity.value = withTiming(0.8, { duration: 200 });
          }, 300);
        }

        lastMagnitude.current = magnitude;
      });

      subscriptionRef.current = subscription;
    } catch (error) {
      console.error('Error iniciando monitoreo:', error);
    }
  };

  const resetSession = () => {
    setSleepState('monitoring');
    sleepStateRef.current = 'monitoring';
    setSleepSession({
      startTime: null,
      endTime: null,
      duration: 0,
      quality: 'fair',
    });
    setMovementCount(0);
    setTotalMovements(0);
    movementHistory.current = [];
    potentialSleepStart.current = null;
    lowMovementStartTime.current = null;
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    if (minutes > 0) {
      return `${mins}m`;
    }
    return '0m';
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FFC107';
      case 'poor': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Pobre';
      default: return 'N/A';
    }
  };

  return (
    <View style={styles.container}>
      <StarBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <MaterialIcons name="bedtime" size={40} color="#FFFFFF" />
            </View>
            <ThemedText type="title" style={styles.title}>
              Sensor de Sueño
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </ThemedText>
          </View>

          {/* Tiempo de sueño destacado */}
          <View style={[
            styles.sleepTimeContainer,
            sleepState === 'sleeping' && styles.sleepTimeContainerActive
          ]}>
            <View style={styles.sleepTimeHeader}>
              <Text style={styles.sleepTimeIcon}>⏱️</Text>
              <ThemedText style={styles.sleepTimeLabel}>Tiempo de Sueño</ThemedText>
            </View>
            <View style={styles.sleepTimeValueContainer}>
              <ThemedText type="title" style={styles.sleepTimeValue}>
                {formatTime(sleepSession.duration)}
              </ThemedText>
            </View>
            {sleepSession.startTime && (
              <View style={styles.timeRange}>
                <View style={styles.timeRangeItem}>
                  <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.8)" />
                  <ThemedText style={styles.timeRangeText}>
                    {formatDateTime(sleepSession.startTime)}
                  </ThemedText>
                </View>
                {sleepSession.endTime && (
                  <View style={styles.timeRangeItem}>
                    <MaterialIcons name="schedule" size={16} color="rgba(255, 255, 255, 0.8)" />
                    <ThemedText style={styles.timeRangeText}>
                      {formatDateTime(sleepSession.endTime)}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
            {sleepState === 'sleeping' && (
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <ThemedText style={styles.liveText}>Detectando sueño</ThemedText>
              </View>
            )}
          </View>

          <ThemedView style={styles.statsContainer}>
            {sleepSession.endTime && (
              <View style={[
                styles.statBox,
                { borderColor: getQualityColor(sleepSession.quality) + '60' }
              ]}>
                <View style={[
                  styles.statIconContainer,
                  { backgroundColor: getQualityColor(sleepSession.quality) + '20' }
                ]}>
                  <MaterialIcons name="star" size={24} color={getQualityColor(sleepSession.quality)} />
                </View>
                <ThemedText style={styles.statLabel}>Calidad</ThemedText>
                <ThemedText 
                  type="title" 
                  style={[
                    styles.statValue, 
                    { color: getQualityColor(sleepSession.quality) }
                  ]}
                >
                  {getQualityText(sleepSession.quality)}
                </ThemedText>
              </View>
            )}
          </ThemedView>

          {sleepState === 'awake' && sleepSession.endTime && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetSession}
            >
              <MaterialIcons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>Nueva Sesión</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1854',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sleepTimeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 35,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    maxWidth: '100%',
  },
  sleepTimeContainerActive: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  sleepTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sleepTimeIcon: {
    fontSize: 24,
  },
  sleepTimeLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  sleepTimeValueContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 80,
    justifyContent: 'center',
  },
  sleepTimeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'center',
    lineHeight: 56,
  },
  timeRange: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  timeRangeIcon: {
    fontSize: 16,
  },
  timeRangeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 15,
  },
  statBox: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
  },
  trackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  trackButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.5,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

