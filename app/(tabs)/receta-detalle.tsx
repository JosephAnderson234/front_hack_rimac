import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Receta, RecetaDetalle } from '@/interfaces/recetas';
import { getRecetaDetalle, updateReceta } from '@/services/recetas';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RecetaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  console.log('[RecetaDetalle] Pantalla montada con id:', id);

  const [receta, setReceta] = useState<RecetaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para edición
  const [paciente, setPaciente] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [medicamentos, setMedicamentos] = useState<Receta[]>([]);

  useEffect(() => {
    console.log('[RecetaDetalle] useEffect ejecutado, id:', id);
    if (id) {
      loadRecetaDetalle();
    } else {
      console.error('[RecetaDetalle] No se recibió ID');
      Alert.alert('Error', 'No se recibió el ID de la receta');
      router.back();
    }
  }, [id]);

  const loadRecetaDetalle = async () => {
    try {
      console.log('[RecetaDetalle] Cargando detalle:', id);
      const response = await getRecetaDetalle(id);
      setReceta(response.data);
      setPaciente(response.data.paciente || '');
      setInstitucion(response.data.institucion);
      setMedicamentos(response.data.recetas);
      console.log('[RecetaDetalle] Detalle cargado');
    } catch (error: any) {
      console.error('[RecetaDetalle] Error cargando detalle:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar el detalle');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones
    if (!paciente.trim()) {
      Alert.alert('Error', 'El nombre del paciente es requerido');
      return;
    }

    if (!institucion.trim()) {
      Alert.alert('Error', 'La institución es requerida');
      return;
    }

    if (medicamentos.length === 0) {
      Alert.alert('Error', 'Debe haber al menos un medicamento');
      return;
    }

    // Validar cada medicamento
    for (const med of medicamentos) {
      if (!med.producto.trim()) {
        Alert.alert('Error', 'Todos los medicamentos deben tener un nombre');
        return;
      }
      if (!med.dosis.trim()) {
        Alert.alert('Error', 'Todos los medicamentos deben tener una dosis');
        return;
      }
      if (med.frecuencia_valor <= 0) {
        Alert.alert('Error', 'La frecuencia debe ser mayor a 0');
        return;
      }
      if (!med.duracion.trim()) {
        Alert.alert('Error', 'Todos los medicamentos deben tener una duración');
        return;
      }
    }

    setIsSaving(true);
    try {
      console.log('[RecetaDetalle] Guardando cambios...');
      const response = await updateReceta(id, {
        paciente,
        institucion,
        recetas: medicamentos,
      });

      setReceta(response.data);
      setIsEditing(false);
      Alert.alert('Éxito', 'Receta actualizada exitosamente');
      console.log('[RecetaDetalle] Cambios guardados');
    } catch (error: any) {
      console.error('[RecetaDetalle] Error guardando:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar la receta');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (receta) {
      setPaciente(receta.paciente || '');
      setInstitucion(receta.institucion);
      setMedicamentos(receta.recetas);
    }
    setIsEditing(false);
  };

  const handleAddMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      {
        producto: '',
        dosis: '',
        frecuencia_valor: 1,
        frecuencia_unidad: 'hora',
        duracion: '',
      },
    ]);
  };

  const handleRemoveMedicamento = (index: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handleUpdateMedicamento = (index: number, field: keyof Receta, value: any) => {
    const updated = [...medicamentos];
    updated[index] = { ...updated[index], [field]: value };
    setMedicamentos(updated);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Cargando detalle...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!receta) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title">Detalle de Receta</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Imagen de la receta */}
        <Image source={{ uri: receta.url_firmada }} style={styles.recetaImage} />

        {/* Información general */}
        <ThemedView style={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.icon} />
            <ThemedText style={styles.infoText}>
              {new Date(receta.fecha_subida).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </ThemedText>
          </View>

          {/* Paciente */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Paciente</ThemedText>
            {isEditing ? (
              <TextInput
                style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
                value={paciente}
                onChangeText={setPaciente}
                placeholder="Nombre del paciente"
                placeholderTextColor={colors.icon}
              />
            ) : (
              <ThemedText style={styles.sectionValue}>
                {receta.paciente || 'No especificado'}
              </ThemedText>
            )}
          </View>

          {/* Institución */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Institución</ThemedText>
            {isEditing ? (
              <TextInput
                style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
                value={institucion}
                onChangeText={setInstitucion}
                placeholder="Nombre de la institución"
                placeholderTextColor={colors.icon}
              />
            ) : (
              <ThemedText style={styles.sectionValue}>{receta.institucion}</ThemedText>
            )}
          </View>

          {/* Medicamentos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Medicamentos</ThemedText>
              {isEditing && (
                <TouchableOpacity onPress={handleAddMedicamento}>
                  <Ionicons name="add-circle" size={24} color={colors.tint} />
                </TouchableOpacity>
              )}
            </View>

            {medicamentos.map((med, index) => (
              <View
                key={index}
                style={[styles.medicamentoCard, { backgroundColor: colors.background }]}
              >
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveMedicamento(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}

                {isEditing ? (
                  <>
                    <TextInput
                      style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
                      value={med.producto}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'producto', text)}
                      placeholder="Nombre del medicamento"
                      placeholderTextColor={colors.icon}
                    />
                    <TextInput
                      style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
                      value={med.dosis}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'dosis', text)}
                      placeholder="Dosis (ej: 500 mg)"
                      placeholderTextColor={colors.icon}
                    />
                    <View style={styles.row}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.smallInput,
                          { borderColor: colors.icon, color: colors.text },
                        ]}
                        value={String(med.frecuencia_valor)}
                        onChangeText={(text) =>
                          handleUpdateMedicamento(index, 'frecuencia_valor', parseInt(text) || 1)
                        }
                        placeholder="Cada"
                        keyboardType="numeric"
                        placeholderTextColor={colors.icon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          styles.flex1,
                          { borderColor: colors.icon, color: colors.text },
                        ]}
                        value={med.frecuencia_unidad}
                        onChangeText={(text) =>
                          handleUpdateMedicamento(index, 'frecuencia_unidad', text)
                        }
                        placeholder="hora/día"
                        placeholderTextColor={colors.icon}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { borderColor: colors.icon, color: colors.text }]}
                      value={med.duracion}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'duracion', text)}
                      placeholder="Duración (ej: 7 días)"
                      placeholderTextColor={colors.icon}
                    />
                  </>
                ) : (
                  <>
                    <ThemedText style={styles.medicamentoNombre}>{med.producto}</ThemedText>
                    <ThemedText style={styles.medicamentoDetalle}>Dosis: {med.dosis}</ThemedText>
                    <ThemedText style={styles.medicamentoDetalle}>
                      Frecuencia: Cada {med.frecuencia_valor} {med.frecuencia_unidad}
                      {med.frecuencia_valor > 1 ? 's' : ''}
                    </ThemedText>
                    <ThemedText style={styles.medicamentoDetalle}>
                      Duración: {med.duracion}
                    </ThemedText>
                  </>
                )}
              </View>
            ))}
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, { backgroundColor: colors.tint }]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.editButton, { backgroundColor: colors.tint }]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    opacity: 0.7,
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
  recetaImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionValue: {
    fontSize: 16,
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    width: 80,
  },
  flex1: {
    flex: 1,
  },
  medicamentoCard: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  medicamentoNombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  medicamentoDetalle: {
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(128,128,128,0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
