import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface StepCounterProps {
  onStepChange?: (steps: number) => void;
}

export function StepCounter({ onStepChange }: StepCounterProps) {
  const [isAvailable, setIsAvailable] = useState('checking');
  const [steps, setSteps] = useState(0);
  const colorScheme = useColorScheme();

  // Referencias para el algoritmo de detección de pasos
  const lastMagnitude = useRef(0);
  const lastStepTime = useRef(0);
  const stepThreshold = useRef(0.8); // Umbral de aceleración para detectar un paso
  const minStepInterval = useRef(200); // Mínimo 300ms entre pasos

  useEffect(() => {
    const subscribe = async () => {
      const available = await Accelerometer.isAvailableAsync();
      setIsAvailable(String(available));

      if (available) {
        // Configurar frecuencia de actualización (10 veces por segundo)
        Accelerometer.setUpdateInterval(100);

        // Suscribirse a los datos del acelerómetro
        const subscription = Accelerometer.addListener(accelerometerData => {
          const { x, y, z } = accelerometerData;

          // Calcular la magnitud del vector de aceleración
          const magnitude = Math.sqrt(x * x + y * y + z * z);

          // Detectar pico de aceleración (paso)
          const currentTime = Date.now();
          const timeSinceLastStep = currentTime - lastStepTime.current;

          // Si hay un cambio significativo en la aceleración y ha pasado suficiente tiempo
          if (
            Math.abs(magnitude - lastMagnitude.current) > stepThreshold.current &&
            timeSinceLastStep > minStepInterval.current
          ) {
            setSteps(prevSteps => {
              const newSteps = prevSteps + 1;
              onStepChange?.(newSteps);
              return newSteps;
            });
            lastStepTime.current = currentTime;
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
  }, [onStepChange]);

  const tintColor = Colors[colorScheme ?? 'light'].tint;

  if (isAvailable === 'checking') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Verificando disponibilidad...</ThemedText>
      </ThemedView>
    );
  }

  if (isAvailable === 'false') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          {Platform.OS === 'web'
            ? 'El contador de pasos no está disponible en web'
            : 'El acelerómetro no está disponible en este dispositivo'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.circle, { borderColor: tintColor }]}>
        <ThemedText type="title" style={styles.stepsNumber}>
          {steps.toLocaleString()}
        </ThemedText>
        <ThemedText style={styles.stepsLabel}>pasos</ThemedText>
      </View>

      <ThemedText style={styles.hint}>
        Camina con tu teléfono para contar pasos
      </ThemedText>

      <View style={styles.infoBox}>
        <ThemedText style={styles.infoText}>
          💡 El contador usa el acelerómetro para detectar tus movimientos
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  stepsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  stepsLabel: {
    fontSize: 18,
    opacity: 0.7,
    marginTop: 8,
  },
  hint: {
    marginTop: 20,
    opacity: 0.6,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: 40,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    maxWidth: 300,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
  errorText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
