import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dependiente } from '@/interfaces/familia';
import { activarModoFamiliar, agregarDependiente, listarDependientes } from '@/services/familia';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Text as RNText,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FamiliaScreen() {
    const { user, updateUserRole } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [isTutor, setIsTutor] = useState(false);
    const [dependientes, setDependientes] = useState<Dependiente[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [nombre, setNombre] = useState('');
    const [cumpleanos, setCumpleanos] = useState('');
    const [parentesco, setParentesco] = useState('HIJO');
    const [sexo, setSexo] = useState('M');

    useEffect(() => {
        if (user?.rol === 'TUTOR') {
            setIsTutor(true);
            cargarDependientes();
        }
    }, [user]);

    const cargarDependientes = async () => {
        try {
            setLoading(true);
            const response = await listarDependientes();
            setDependientes(response.dependientes);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudieron cargar los dependientes');
        } finally {
            setLoading(false);
        }
    };

    const handleActivarModoFamiliar = async () => {
        try {
            setLoading(true);
            const response = await activarModoFamiliar();
            Alert.alert('Éxito', response.message);
            updateUserRole(response.rol_nuevo);
            setIsTutor(true);
            cargarDependientes();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo activar el modo familiar');
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarDependiente = async () => {
        if (!nombre || !cumpleanos) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        console.log('[FamiliaScreen] Usuario actual:', user);
        console.log('[FamiliaScreen] Correo a enviar:', user?.correo);

        try {
            setLoading(true);
            const response = await agregarDependiente({
                correo_tutor: user?.correo || '',
                nombre,
                cumpleanos,
                parentesco,
                sexo,
            });
            Alert.alert('Éxito', response.message);
            setModalVisible(false);
            // Limpiar form
            setNombre('');
            setCumpleanos('');
            setParentesco('HIJO');
            setSexo('M');
            // Recargar lista
            cargarDependientes();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo agregar el dependiente');
        } finally {
            setLoading(false);
        }
    };

    // Vista para usuarios sin modo familiar activado
    if (!isTutor) {
        return (
            <ThemedView style={styles.container}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.centerContent}>
                    <View style={[styles.emptyStateCard, { backgroundColor: colors.background }]}>
                        <Ionicons name="people-outline" size={80} color={colors.tint} />
                        <ThemedText type="title" style={styles.emptyTitle}>
                            Modo Familia
                        </ThemedText>
                        <ThemedText style={styles.emptyText}>
                            Activa el modo familia para gestionar dependientes y compartir información de salud
                        </ThemedText>
                        <TouchableOpacity
                            style={[styles.activateButton, { backgroundColor: colors.tint }]}
                            onPress={handleActivarModoFamiliar}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="heart-outline" size={24} color="#fff" />
                                    <RNText style={styles.buttonText}>Activar Modo Familia</RNText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ThemedView>
        );
    }

    // Vista para tutores
    return (
        <ThemedView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title">Familia</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Gestiona tus dependientes
                    </ThemedText>
                </ThemedView>

                {/* Botón agregar dependiente */}
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.tint }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                    <RNText style={styles.addButtonText}>Agregar Dependiente</RNText>
                </TouchableOpacity>

                {/* Lista de dependientes */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.tint} />
                    </View>
                ) : dependientes.length === 0 ? (
                    <View style={styles.emptyList}>
                        <Ionicons name="person-add-outline" size={48} color={colors.icon.default} />
                        <ThemedText style={styles.emptyListText}>
                            No tienes dependientes registrados
                        </ThemedText>
                    </View>
                ) : (
                    <ThemedView style={styles.membersList}>
                        {dependientes.map((dependiente: Dependiente) => (
                            <TouchableOpacity
                                key={dependiente.dependiente_id}
                                style={[styles.memberCard, { backgroundColor: colors.background }]}
                            >
                                <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
                                    <Ionicons
                                        name={dependiente.sexo === 'M' ? 'male' : 'female'}
                                        size={32}
                                        color="#fff"
                                    />
                                </View>
                                <View style={styles.memberInfo}>
                                    <ThemedText style={styles.memberName}>
                                        {dependiente.nombre}
                                    </ThemedText>
                                    <ThemedText style={styles.memberRelation}>
                                        {dependiente.parentesco} • {dependiente.cumpleanos}
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color={colors.icon.default} />
                            </TouchableOpacity>
                        ))}
                    </ThemedView>
                )}
            </ScrollView>

            {/* Modal para agregar dependiente */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText type="subtitle">Agregar Dependiente</ThemedText>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Nombre completo</ThemedText>
                                <TextInput
                                    style={[styles.input, { 
                                        backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                                        color: colors.text.primary 
                                    }]}
                                    placeholder="Ej: Juan Pérez"
                                    placeholderTextColor={colors.icon.secondary}
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Fecha de nacimiento</ThemedText>
                                <TextInput
                                    style={[styles.input, { 
                                        backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                                        color: colors.text.primary 
                                    }]}
                                    placeholder="YYYY-MM-DD (Ej: 2015-05-20)"
                                    placeholderTextColor={colors.icon.secondary}
                                    value={cumpleanos}
                                    onChangeText={setCumpleanos}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Parentesco</ThemedText>
                                <View style={styles.radioGroup}>
                                    {['HIJO', 'HIJA', 'PADRE', 'MADRE', 'OTRO'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.radioButton,
                                                parentesco === option && {
                                                    backgroundColor: colors.tint,
                                                },
                                            ]}
                                            onPress={() => setParentesco(option)}
                                        >
                                            <RNText
                                                style={[
                                                    styles.radioText,
                                                    { color: parentesco === option ? '#fff' : colors.text.primary },
                                                ]}
                                            >
                                                {option}
                                            </RNText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>Sexo</ThemedText>
                                <View style={styles.radioGroup}>
                                    <TouchableOpacity
                                        style={[
                                            styles.radioButton,
                                            sexo === 'M' && { backgroundColor: colors.tint },
                                        ]}
                                        onPress={() => setSexo('M')}
                                    >
                                        <RNText
                                            style={[
                                                styles.radioText,
                                                { color: sexo === 'M' ? '#fff' : colors.text.primary },
                                            ]}
                                        >
                                            Masculino
                                        </RNText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.radioButton,
                                            sexo === 'F' && { backgroundColor: colors.tint },
                                        ]}
                                        onPress={() => setSexo('F')}
                                    >
                                        <RNText
                                            style={[
                                                styles.radioText,
                                                { color: sexo === 'F' ? '#fff' : colors.text.primary },
                                            ]}
                                        >
                                            Femenino
                                        </RNText>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: colors.tint }]}
                                onPress={handleAgregarDependiente}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <RNText style={styles.buttonText}>Agregar</RNText>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    centerContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    subtitle: {
        marginTop: 8,
        opacity: 0.7,
    },
    emptyStateCard: {
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    emptyTitle: {
        marginTop: 20,
        marginBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: 24,
        lineHeight: 22,
    },
    activateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        minWidth: 200,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyList: {
        padding: 40,
        alignItems: 'center',
    },
    emptyListText: {
        marginTop: 16,
        opacity: 0.7,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    membersList: {
        padding: 16,
        gap: 12,
    },
    memberCard: {
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
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    memberRelation: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 4,
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // colors.utils.modalOverlay
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalForm: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    radioButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    radioText: {
        fontSize: 14,
        fontWeight: '500',
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
});
