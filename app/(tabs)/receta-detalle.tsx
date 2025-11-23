import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { generarTiendasParaMedicamento, ordenarTiendasPorMejorOpcion } from '@/data/tiendas-mock';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Receta, RecetaDetalle } from '@/interfaces/recetas';
import { Tienda } from '@/interfaces/tiendas';
import { getRecetaDetalle, updateReceta } from '@/services/recetas';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<string | null>(null);
  const [tiendasDisponibles, setTiendasDisponibles] = useState<Tienda[]>([]);

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

  const handleBuscarTiendas = (nombreMedicamento: string) => {
    console.log('[RecetaDetalle] Buscando tiendas para:', nombreMedicamento);
    const tiendas = generarTiendasParaMedicamento(nombreMedicamento);
    const tiendasOrdenadas = ordenarTiendasPorMejorOpcion(tiendas);
    setTiendasDisponibles(tiendasOrdenadas);
    setMedicamentoSeleccionado(nombreMedicamento);
  };

  const handleAbrirTiendaOnline = (url: string) => {
    Linking.openURL(url);
  };

  const handleAbrirMapa = (direccion: string) => {
    const query = encodeURIComponent(direccion);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
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
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ThemedText type="title">Detalle de Receta</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Imagen de la receta */}
        <Image source={{ uri: receta.url_firmada }} style={styles.recetaImage} />

        {/* Información general */}
        <ThemedView style={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.icon.default} />
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
                style={[styles.input, { borderColor: colors.icon.default, color: colors.text.primary }]}
                value={paciente}
                onChangeText={setPaciente}
                placeholder="Nombre del paciente"
                placeholderTextColor={colors.icon.secondary}
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
                style={[styles.input, { borderColor: colors.icon.default, color: colors.text.primary }]}
                value={institucion}
                onChangeText={setInstitucion}
                placeholder="Nombre de la institución"
                placeholderTextColor={colors.icon.secondary}
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
                      style={[styles.input, { borderColor: colors.icon.default, color: colors.text.primary }]}
                      value={med.producto}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'producto', text)}
                      placeholder="Nombre del medicamento"
                      placeholderTextColor={colors.icon.secondary}
                    />
                    <TextInput
                      style={[styles.input, { borderColor: colors.icon.default, color: colors.text.primary }]}
                      value={med.dosis}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'dosis', text)}
                      placeholder="Dosis (ej: 500 mg)"
                      placeholderTextColor={colors.icon.secondary}
                    />
                    <View style={styles.row}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.smallInput,
                          { borderColor: colors.icon.default, color: colors.text.primary },
                        ]}
                        value={String(med.frecuencia_valor)}
                        onChangeText={(text) =>
                          handleUpdateMedicamento(index, 'frecuencia_valor', parseInt(text) || 1)
                        }
                        placeholder="Cada"
                        keyboardType="numeric"
                        placeholderTextColor={colors.icon.secondary}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          styles.flex1,
                          { borderColor: colors.icon.default, color: colors.text.primary },
                        ]}
                        value={med.frecuencia_unidad}
                        onChangeText={(text) =>
                          handleUpdateMedicamento(index, 'frecuencia_unidad', text)
                        }
                        placeholder="hora/día"
                        placeholderTextColor={colors.icon.secondary}
                      />
                    </View>
                    <TextInput
                      style={[styles.input, { borderColor: colors.icon.default, color: colors.text.primary }]}
                      value={med.duracion}
                      onChangeText={(text) => handleUpdateMedicamento(index, 'duracion', text)}
                      placeholder="Duración (ej: 7 días)"
                      placeholderTextColor={colors.icon.secondary}
                    />
                  </>
                ) : (
                  <>
                    <View style={styles.medicamentoHeader}>
                      <ThemedText style={styles.medicamentoNombre}>{med.producto}</ThemedText>
                      <TouchableOpacity
                        style={[styles.buscarTiendaButton, { backgroundColor: colors.tint }]}
                        onPress={() => handleBuscarTiendas(med.producto)}
                      >
                        <Ionicons name="storefront-outline" size={16} color="#fff" />
                        <Text style={styles.buscarTiendaText}>Buscar</Text>
                      </TouchableOpacity>
                    </View>
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

          {/* Tiendas Cercanas */}
          {medicamentoSeleccionado && tiendasDisponibles.length > 0 && (
            <View style={styles.section}>
              <View style={styles.tiendasHeader}>
                <Ionicons name="storefront" size={24} color={colors.tint} />
                <ThemedText style={styles.sectionTitle}>
                  Tiendas para "{medicamentoSeleccionado}"
                </ThemedText>
              </View>
              <ThemedText style={styles.tiendasSubtitle}>
                Ordenadas por mejor precio y distancia
              </ThemedText>

              {tiendasDisponibles.map((tienda, index) => (
                <View
                  key={tienda.id}
                  style={[
                    styles.tiendaCard,
                    { backgroundColor: colors.background },
                    index === 0 && styles.mejorTiendaCard,
                  ]}
                >
                  {index === 0 && (
                    <View style={styles.mejorOpcionBadge}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.mejorOpcionText}>Mejor Opción</Text>
                    </View>
                  )}

                  <View style={styles.tiendaHeader}>
                    <View style={styles.tiendaInfo}>
                      <ThemedText style={styles.tiendaNombre}>{tienda.nombre}</ThemedText>
                      <View style={styles.tiendaRating}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <ThemedText style={styles.ratingText}>{tienda.rating}</ThemedText>
                      </View>
                    </View>
                    <View style={styles.tiendaPrecio}>
                      <Text style={styles.precioValue}>S/ {tienda.precio.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.tiendaDetalles}>
                    <View style={styles.tiendaDetalle}>
                      <Ionicons name="location-outline" size={16} color={colors.icon.default} />
                      <ThemedText style={styles.tiendaDetalleText}>
                        {tienda.distancia} km • {tienda.direccion}
                      </ThemedText>
                    </View>
                    <View style={styles.tiendaDetalle}>
                      <Ionicons name="time-outline" size={16} color={colors.icon.default} />
                      <ThemedText style={styles.tiendaDetalleText}>{tienda.horario}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.tiendaAcciones}>
                    {tienda.urlTiendaOnline && (
                      <TouchableOpacity
                        style={[styles.tiendaBoton, { borderColor: colors.tint }]}
                        onPress={() => handleAbrirTiendaOnline(tienda.urlTiendaOnline!)}
                      >
                        <Ionicons name="cart-outline" size={18} color={colors.tint} />
                        <Text style={[styles.tiendaBotonText, { color: colors.tint }]}>
                          Tienda Online
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.tiendaBoton, { borderColor: colors.tint }]}
                      onPress={() => handleAbrirMapa(tienda.direccion)}
                    >
                      <Ionicons name="navigate-outline" size={18} color={colors.tint} />
                      <Text style={[styles.tiendaBotonText, { color: colors.tint }]}>
                        Cómo llegar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

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
    color: '#FFFFFF',
  },
  sectionValue: {
    fontSize: 16,
    opacity: 0.8,
    color: '#FFFFFF',
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
  medicamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicamentoNombre: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#FFFFFF',
  },
  buscarTiendaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  buscarTiendaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  medicamentoDetalle: {
    fontSize: 14,
    opacity: 0.7,
  },
  tiendasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tiendasSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 16,
  },
  tiendaCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  mejorTiendaCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  mejorOpcionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  mejorOpcionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B8860B',
  },
  tiendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tiendaInfo: {
    flex: 1,
    gap: 4,
  },
  tiendaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tiendaRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    opacity: 0.8,
    color: '#FFFFFF',
  },
  tiendaPrecio: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  precioValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tiendaDetalles: {
    gap: 8,
    marginBottom: 12,
  },
  tiendaDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tiendaDetalleText: {
    fontSize: 13,
    opacity: 0.8,
    flex: 1,
    color: '#FFFFFF',
  },
  tiendaAcciones: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tiendaBoton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  tiendaBotonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(128, 128, 128, 0.2)', // colors.utils.cancelButton
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
