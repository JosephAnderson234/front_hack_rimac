import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Doctor } from '@/interfaces/doctor';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Data mockeada de doctores
const DOCTORES_MOCK: Doctor[] = [
  {
    nombre: 'Terry Mora Monica Tatiana',
    codigo_cmp: '034572',
    especialidad: 'Medicina Interna',
    sedes: ['San Borja', 'Surco'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: ['15:00 a 17:00'],
          miercoles: [''],
          jueves: [''],
          viernes: ['15:00 a 21:00'],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
      },
      Surco: {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: ['15:00 a 19:00'],
          martes: ['09:00 a 13:00'],
          miercoles: ['15:00 a 19:00'],
          jueves: [''],
          viernes: [''],
          sabado: ['14:30 a 19:00'],
        },
      },
    },
  },
  {
    nombre: 'Soto Anamaco Nelson Felipe',
    codigo_cmp: '016284',
    especialidad: 'Medicina Interna',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: ['15:00 a 19:00'],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: ['15:00 a 19:00'],
          martes: [''],
          miercoles: [''],
          jueves: ['15:00 a 19:00'],
          viernes: [''],
          sabado: ['08:00 a 16:00'],
        },
      },
    },
  },
  {
    nombre: 'Caceres Vargas Doris',
    codigo_cmp: '015719',
    especialidad: 'Psiquiatría',
    sedes: ['San Borja', 'Lima'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: ['08:30 a 12:00'],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: ['08:00 a 12:00'],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: ['08:00 a 12:00', '14:00 a 19:00'],
          miercoles: [''],
          jueves: ['08:00 a 12:00', '15:00 a 20:00'],
          viernes: ['15:00 a 20:00'],
          sabado: [''],
        },
      },
      Lima: {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: ['16:00 a 20:00'],
          viernes: [''],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Flores Bustamante Claver Reynaldo',
    codigo_cmp: '013978',
    especialidad: 'Psiquiatría',
    sedes: ['San Borja', 'Surco'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: ['16:00 a 20:00'],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: ['15:00 a 20:00'],
          martes: [''],
          miercoles: ['08:00 a 13:00', '15:00 a 20:00'],
          jueves: ['15:00 a 18:00'],
          viernes: ['08:00 a 12:00'],
          sabado: ['08:00 a 14:00'],
        },
      },
      Surco: {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: ['15:00 a 19:00'],
        },
      },
    },
  },
  {
    nombre: 'Ingar Armijo Wilfredo Humberto',
    codigo_cmp: '017823',
    especialidad: 'Pediatría',
    sedes: ['San Borja', 'San Isidro'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: ['15:00 a 19:00'],
          miercoles: [''],
          jueves: ['15:00 a 18:00'],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: ['08:00 a 13:00', '15:00 a 20:00'],
          martes: [''],
          miercoles: ['08:00 a 13:00'],
          jueves: [''],
          viernes: ['08:00 a 13:00', '15:00 a 20:00'],
          sabado: [''],
        },
      },
      'San Isidro': {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: [''],
          miercoles: ['15:00 a 20:00'],
          jueves: [''],
          viernes: [''],
          sabado: ['15:00 a 19:00'],
        },
      },
    },
  },
  {
    nombre: 'Llanos Rodriguez Gumercindo Rodolfo',
    codigo_cmp: '009932',
    especialidad: 'Cirugía General',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial',
    horarios: {
      'San Borja': {
        presencial: {
          lunes: ['12:00 a 16:00'],
          martes: [''],
          miercoles: [''],
          jueves: ['08:00 a 12:00'],
          viernes: ['12:00 a 16:00'],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Palomino Guerrero Carmen',
    codigo_cmp: '015897',
    especialidad: 'Medicina Interna',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: ['15:00 a 20:00'],
          jueves: [''],
          viernes: ['15:00 a 20:00'],
          sabado: [''],
        },
        presencial: {
          lunes: ['08:00 a 14:00', '14:00 a 20:00'],
          martes: ['08:00 a 15:00', '15:00 a 20:00'],
          miercoles: ['08:00 a 13:00'],
          jueves: ['08:00 a 15:00', '15:00 a 19:00'],
          viernes: [''],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Mejia Barrutia Ana Maria',
    codigo_cmp: '012882',
    especialidad: 'Oftalmología',
    sedes: ['San Isidro'],
    tipo_atencion: 'Presencial',
    horarios: {
      'San Isidro': {
        presencial: {
          lunes: [''],
          martes: ['08:00 a 13:00'],
          miercoles: ['15:00 a 20:00'],
          jueves: [''],
          viernes: ['14:00 a 19:00'],
          sabado: ['08:00 a 13:00'],
        },
      },
    },
  },
  {
    nombre: 'Robles Morales Carlos Ariel',
    codigo_cmp: '007101',
    especialidad: 'Oftalmología',
    sedes: ['San Borja', 'Lima'],
    tipo_atencion: 'Presencial',
    horarios: {
      'San Borja': {
        presencial: {
          lunes: [''],
          martes: [''],
          miercoles: ['14:00 a 19:00'],
          jueves: ['08:00 a 13:00'],
          viernes: ['08:00 a 13:00', '14:00 a 19:00'],
          sabado: [''],
        },
      },
      Lima: {
        presencial: {
          lunes: ['14:00 a 19:00'],
          martes: [''],
          miercoles: [''],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Urteaga Pasache Walter Gregorio',
    codigo_cmp: '014138',
    especialidad: 'Ginecología y Obstetricia',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial',
    horarios: {
      'San Borja': {
        presencial: {
          lunes: [''],
          martes: ['16:00 a 20:00'],
          miercoles: ['08:00 a 12:00'],
          jueves: ['12:00 a 13:00', '14:00 a 20:00'],
          viernes: [''],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Valladares Alvarez Guillermo Bernardo',
    codigo_cmp: '007598',
    especialidad: 'Gastroenterología',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial y Virtual',
    horarios: {
      'San Borja': {
        virtual: {
          lunes: [''],
          martes: [''],
          miercoles: ['13:40 a 18:00'],
          jueves: [''],
          viernes: [''],
          sabado: [''],
        },
        presencial: {
          lunes: [''],
          martes: ['08:00 a 13:00', '15:00 a 20:00'],
          miercoles: ['08:00 a 13:00'],
          jueves: ['08:00 a 13:00'],
          viernes: [''],
          sabado: [''],
        },
      },
    },
  },
  {
    nombre: 'Van Hemelrijck Tejada Jaime Jorge',
    codigo_cmp: '015479',
    especialidad: 'Ortopedia y Traumatología',
    sedes: ['San Borja'],
    tipo_atencion: 'Presencial',
    horarios: {
      'San Borja': {
        presencial: {
          lunes: ['14:00 a 19:30'],
          martes: [''],
          miercoles: [''],
          jueves: ['08:00 a 13:00'],
          viernes: ['14:00 a 19:30'],
          sabado: [''],
        },
      },
    },
  },
];

export default function AgendasScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  // Función para convertir nombre a formato URL
  const nombreToUrl = (nombre: string): string => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/\s+/g, '-'); // Reemplazar espacios con guiones
  };

  // Función para abrir el perfil del doctor
  const handleDoctorPress = async (doctor: Doctor) => {
    const urlNombre = nombreToUrl(doctor.nombre);
    const url = `https://clinicainternacional.com.pe/staff-medico/${urlNombre}/`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se pudo abrir el enlace');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el perfil del doctor');
      console.error('Error abriendo URL:', error);
    }
  };

  // Filtrar doctores por búsqueda
  const doctoresFiltrados = DOCTORES_MOCK.filter(
    (doctor) =>
      doctor.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.especialidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.sedes.some((sede) => sede.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Obtener icono según especialidad
  const getEspecialidadIcon = (especialidad: string): any => {
    const iconMap: { [key: string]: any } = {
      'Medicina Interna': 'medical',
      Psiquiatría: 'brain',
      Pediatría: 'happy',
      'Cirugía General': 'cut',
      Oftalmología: 'eye',
      'Ginecología y Obstetricia': 'woman',
      Gastroenterología: 'body',
      'Ortopedia y Traumatología': 'fitness',
    };
    return iconMap[especialidad] || 'medkit';
  };

  // Obtener color según especialidad
  const getEspecialidadColor = (especialidad: string): string => {
    const colorMap: { [key: string]: string } = {
      'Medicina Interna': '#FF6B6B',
      Psiquiatría: '#9B59B6',
      Pediatría: '#3498DB',
      'Cirugía General': '#E74C3C',
      Oftalmología: '#1ABC9C',
      'Ginecología y Obstetricia': '#E91E63',
      Gastroenterología: '#FF9800',
      'Ortopedia y Traumatología': '#2ECC71',
    };
    return colorMap[especialidad] || '#95A5A6';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Doctores</ThemedText>
          <ThemedText style={styles.subtitle}>
            Encuentra y agenda con nuestros especialistas
          </ThemedText>
        </ThemedView>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.icon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar por nombre, especialidad o sede..."
              placeholderTextColor={colors.icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.icon} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contador de resultados */}
        <View style={styles.resultsCount}>
          <ThemedText style={styles.resultsText}>
            {doctoresFiltrados.length} {doctoresFiltrados.length === 1 ? 'doctor' : 'doctores'}{' '}
            {searchQuery ? 'encontrados' : 'disponibles'}
          </ThemedText>
        </View>

        {/* Lista de doctores */}
        <ThemedView style={styles.doctorsList}>
          {doctoresFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.icon} />
              <ThemedText style={styles.emptyText}>
                No se encontraron doctores con ese criterio
              </ThemedText>
            </View>
          ) : (
            doctoresFiltrados.map((doctor, index) => (
              <TouchableOpacity
                key={`${doctor.codigo_cmp}-${index}`}
                style={[styles.doctorCard, { backgroundColor: colors.background }]}
                onPress={() => handleDoctorPress(doctor)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: getEspecialidadColor(doctor.especialidad) },
                  ]}
                >
                  <Ionicons
                    name={getEspecialidadIcon(doctor.especialidad)}
                    size={28}
                    color="#fff"
                  />
                </View>
                <View style={styles.doctorInfo}>
                  <ThemedText style={styles.doctorName}>{doctor.nombre}</ThemedText>
                  <View style={styles.infoRow}>
                    <Ionicons name="medical" size={14} color={colors.icon} />
                    <ThemedText style={styles.infoText}>{doctor.especialidad}</ThemedText>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={14} color={colors.icon} />
                    <ThemedText style={styles.infoText}>{doctor.sedes.join(', ')}</ThemedText>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="videocam" size={14} color={colors.icon} />
                    <ThemedText style={styles.infoText}>{doctor.tipo_atencion}</ThemedText>
                  </View>
                  <View style={styles.cmpBadge}>
                    <ThemedText style={styles.cmpText}>CMP: {doctor.codigo_cmp}</ThemedText>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.icon} />
              </TouchableOpacity>
            ))
          )}
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
    paddingTop: 60,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsCount: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 14,
    opacity: 0.7,
  },
  doctorsList: {
    padding: 16,
    gap: 12,
  },
  doctorCard: {
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
  doctorInfo: {
    flex: 1,
    gap: 6,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.7,
    flex: 1,
  },
  cmpBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  cmpText: {
    fontSize: 11,
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
