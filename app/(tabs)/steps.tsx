import { StepCounter } from '@/components/step-counter';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function StepsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Contador de Pasos</ThemedText>
        <ThemedText style={styles.subtitle}>
          Mantén tu teléfono contigo mientras caminas
        </ThemedText>
      </ThemedView>
      
      <StepCounter 
        onStepChange={(steps) => {
          // Aquí puedes agregar lógica adicional si necesitas
          // Por ejemplo, guardar en AsyncStorage, enviar a una API, etc.
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
});
