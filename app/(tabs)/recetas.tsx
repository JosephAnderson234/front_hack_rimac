import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RecetaDetalle } from '@/interfaces/recetas';
import { deleteReceta, getRecetas, uploadReceta } from '@/services/recetas';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RecetasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [recetas, setRecetas] = useState<RecetaDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecetas = async () => {
    try {
      console.log('[RecetasScreen] Cargando recetas...');
      const response = await getRecetas();
      setRecetas(response.data);
      console.log('[RecetasScreen] Recetas cargadas:', response.count);
    } catch (error: any) {
      console.error('[RecetasScreen] Error cargando recetas:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar las recetas');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecetas();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRecetas();
  }, []);

  const handleUploadReceta = async () => {
    try {
      console.log('[RecetasScreen] Seleccionando archivo...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('[RecetasScreen] Selección cancelada');
        return;
      }

      const file = result.assets[0];
      console.log('[RecetasScreen] Archivo seleccionado:', file.name);

      setIsUploading(true);

      console.log('[RecetasScreen] Subiendo receta...');
      const uploadResponse = await uploadReceta(file);

      Alert.alert('Éxito', 'Receta subida y procesada exitosamente');
      console.log('[RecetasScreen] Receta subida:', uploadResponse.receta_id);

      // Recargar lista
      loadRecetas();
    } catch (error: any) {
      console.error('[RecetasScreen] Error subiendo receta:', error);
      Alert.alert('Error', error.message || 'No se pudo subir la receta');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteReceta = (recetaId: string) => {
    Alert.alert(
      'Eliminar Receta',
      '¿Estás seguro de que deseas eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[RecetasScreen] Eliminando receta:', recetaId);
              await deleteReceta(recetaId);
              Alert.alert('Éxito', 'Receta eliminada exitosamente');
              loadRecetas();
            } catch (error: any) {
              console.error('[RecetasScreen] Error eliminando receta:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar la receta');
            }
          },
        },
      ]
    );
  };

  const handleViewDetalle = (recetaId: string) => {
    console.log('[RecetasScreen] Navegando a detalle:', recetaId);
    try {
      router.push(`/(tabs)/receta-detalle?id=${recetaId}`);
    } catch (error) {
      console.error('[RecetasScreen] Error navegando:', error);
      Alert.alert('Error', 'No se pudo abrir el detalle de la receta');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <ThemedText style={styles.loadingText}>Cargando recetas...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title">Recetas Médicas</ThemedText>
          <ThemedText style={styles.subtitle}>
            {recetas.length} {recetas.length === 1 ? 'receta' : 'recetas'}
          </ThemedText>
        </ThemedView>

        {/* Botón subir receta */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.tint }]}
          onPress={handleUploadReceta}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Subir Nueva Receta</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Lista de recetas */}
        {recetas.length === 0 ? (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.icon} />
            <ThemedText style={styles.emptyText}>No tienes recetas</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Sube tu primera receta médica para comenzar
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.recetasList}>
            {recetas.map((receta) => (
              <TouchableOpacity
                key={receta.receta_id}
                style={[styles.recetaCard, { backgroundColor: colors.background }]}
                onPress={() => handleViewDetalle(receta.receta_id)}
              >
                {/* Imagen de la receta */}
                <Image source={{ uri: receta.url_firmada }} style={styles.recetaImage} />

                {/* Información */}
                <View style={styles.recetaInfo}>
                  <View style={styles.recetaHeader}>
                    <ThemedText style={styles.recetaInstitucion} numberOfLines={1}>
                      {receta.institucion}
                    </ThemedText>
                    <ThemedText style={styles.recetaFecha}>
                      {new Date(receta.fecha_subida).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </ThemedText>
                  </View>

                  {receta.paciente && (
                    <ThemedText style={styles.recetaPaciente}>
                      Paciente: {receta.paciente}
                    </ThemedText>
                  )}

                  {/* Medicamentos */}
                  <View style={styles.medicamentosContainer}>
                    {receta.recetas.slice(0, 2).map((med, index) => (
                      <View key={index} style={styles.medicamentoChip}>
                        <Ionicons name="medical" size={12} color={colors.tint} />
                        <ThemedText style={styles.medicamentoText} numberOfLines={1}>
                          {med.producto}
                        </ThemedText>
                      </View>
                    ))}
                    {receta.recetas.length > 2 && (
                      <ThemedText style={styles.masText}>
                        +{receta.recetas.length - 2} más
                      </ThemedText>
                    )}
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewDetalle(receta.receta_id)}
                  >
                    <Ionicons name="eye-outline" size={20} color={colors.tint} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteReceta(receta.receta_id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}
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
    padding: 20,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    opacity: 0.7,
    textAlign: 'center',
  },
  recetasList: {
    padding: 16,
    gap: 16,
  },
  recetaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recetaImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  recetaInfo: {
    padding: 16,
    gap: 8,
  },
  recetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recetaInstitucion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  recetaFecha: {
    fontSize: 12,
    opacity: 0.7,
  },
  recetaPaciente: {
    fontSize: 14,
    opacity: 0.8,
  },
  medicamentosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  medicamentoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  medicamentoText: {
    fontSize: 12,
    maxWidth: 100,
  },
  masText: {
    fontSize: 12,
    opacity: 0.7,
    alignSelf: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
    padding: 12,
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
  },
});
