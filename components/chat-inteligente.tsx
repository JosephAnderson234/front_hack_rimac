import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { tokenStorage } from '@/services/auth/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

interface Mensaje {
  id: string;
  texto: string;
  esUsuario: boolean;
  timestamp: Date;
}

interface ChatInteligenteProps {
  visible: boolean;
  onClose: () => void;
  contextoInicial: 'Estadisticas' | 'Servicios' | 'Recetas' | 'General';
}

const CHAT_API_URL = 'https://rk6wgnrpsc.execute-api.us-east-1.amazonaws.com/dev/agente/consultar';

export function ChatInteligente({ visible, onClose, contextoInicial }: ChatInteligenteProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scrollViewRef = useRef<ScrollView>(null);

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contexto, setContexto] = useState<string>(contextoInicial);

  // Actualizar contexto cuando cambie el prop
  useEffect(() => {
    console.log('[ChatInteligente] Contexto inicial actualizado:', contextoInicial);
    setContexto(contextoInicial);
  }, [contextoInicial]);

  // Log cuando se abre/cierra el modal
  useEffect(() => {
    if (visible) {
      console.log('[ChatInteligente] Modal abierto. Contexto:', contexto, 'Mensajes:', mensajes.length);
    } else {
      console.log('[ChatInteligente] Modal cerrado');
    }
  }, [visible]);

  const enviarMensaje = async () => {
    if (!inputText.trim() || isLoading) {
      console.log('[ChatInteligente] Mensaje vacío o ya está cargando');
      return;
    }

    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      texto: inputText.trim(),
      esUsuario: true,
      timestamp: new Date(),
    };

    console.log('[ChatInteligente] Enviando mensaje:', {
      texto: mensajeUsuario.texto,
      contexto: contexto,
      timestamp: mensajeUsuario.timestamp.toISOString(),
    });

    setMensajes((prev) => [...prev, mensajeUsuario]);
    setInputText('');
    setIsLoading(true);

    try {
      console.log('[ChatInteligente] Obteniendo token...');
      const token = await tokenStorage.getIdToken();
      
      if (!token) {
        console.error('[ChatInteligente] Token no encontrado');
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('[ChatInteligente] Token obtenido:', token.substring(0, 20) + '...');

      const requestBody = {
        mensaje: mensajeUsuario.texto,
        contexto: contexto,
      };

      console.log('[ChatInteligente] Request body:', requestBody);
      console.log('[ChatInteligente] Endpoint:', CHAT_API_URL);

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[ChatInteligente] Response status:', response.status);
      console.log('[ChatInteligente] Response headers:', JSON.stringify(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ChatInteligente] Error response:', errorText);
        throw new Error(`Error en la respuesta: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[ChatInteligente] Response data:', JSON.stringify(data, null, 2));
      
      const mensajeBot: Mensaje = {
        id: (Date.now() + 1).toString(),
        texto: data.respuesta || data.message || 'Lo siento, no pude procesar tu mensaje.',
        esUsuario: false,
        timestamp: new Date(),
      };

      console.log('[ChatInteligente] Mensaje del bot:', mensajeBot.texto.substring(0, 100) + '...');

      setMensajes((prev) => [...prev, mensajeBot]);
      
      // Scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      console.log('[ChatInteligente] Mensaje enviado exitosamente');
    } catch (error: any) {
      console.error('[ChatInteligente] Error completo:', error);
      console.error('[ChatInteligente] Error stack:', error.stack);
      Alert.alert('Error', error.message || 'No se pudo enviar el mensaje');
      
      const mensajeError: Mensaje = {
        id: (Date.now() + 1).toString(),
        texto: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        esUsuario: false,
        timestamp: new Date(),
      };
      setMensajes((prev) => [...prev, mensajeError]);
    } finally {
      setIsLoading(false);
      console.log('[ChatInteligente] Proceso finalizado');
    }
  };

  const cambiarContexto = (nuevoContexto: string) => {
    console.log('[ChatInteligente] Cambiando contexto:', contexto, '->', nuevoContexto);
    setContexto(nuevoContexto);
  };

  const limpiarChat = () => {
    console.log('[ChatInteligente] Limpiando chat. Mensajes eliminados:', mensajes.length);
    setMensajes([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.tint }]}>
          <View style={styles.headerLeft}>
            <Ionicons name="chatbubbles" size={32} color="#fff" />
            <View>
              <Text style={styles.headerTitle}>Chat Inteligente</Text>
              <Text style={styles.headerSubtitle}>Contexto: {contexto}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={limpiarChat} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selector de contexto */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.contextSelector}
          contentContainerStyle={styles.contextSelectorContent}
        >
          {['General', 'Estadisticas', 'Servicios', 'Recetas'].map((ctx) => (
            <TouchableOpacity
              key={ctx}
              style={[
                styles.contextChip,
                contexto === ctx && { backgroundColor: colors.tint },
                contexto !== ctx && { backgroundColor: 'rgba(128,128,128,0.2)' },
              ]}
              onPress={() => cambiarContexto(ctx)}
            >
              <Text
                style={[
                  styles.contextChipText,
                  contexto === ctx && styles.contextChipTextActive,
                ]}
              >
                {ctx}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mensajes */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {mensajes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={64} color={colors.icon.default} />
              <ThemedText style={styles.emptyText}>
                ¡Hola! Soy tu asistente inteligente
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Pregúntame lo que necesites sobre {contexto.toLowerCase()}
              </ThemedText>
            </View>
          ) : (
            mensajes.map((mensaje) => (
              <View
                key={mensaje.id}
                style={[
                  styles.messageBubble,
                  mensaje.esUsuario ? styles.userBubble : styles.botBubble,
                  mensaje.esUsuario && { backgroundColor: colors.tint },
                  !mensaje.esUsuario && { backgroundColor: 'rgba(128,128,128,0.2)' },
                ]}
              >
                {mensaje.esUsuario ? (
                  <Text
                    style={[
                      styles.messageText,
                      styles.userMessageText,
                    ]}
                  >
                    {mensaje.texto}
                  </Text>
                ) : (
                  <Markdown
                    style={{
                      body: {
                        color: colors.text.primary,
                        fontSize: 16,
                        lineHeight: 22,
                      },
                      heading1: {
                        color: colors.text.primary,
                        fontSize: 24,
                        fontWeight: '700',
                        marginBottom: 8,
                      },
                      heading2: {
                        color: colors.text.primary,
                        fontSize: 20,
                        fontWeight: '700',
                        marginBottom: 6,
                      },
                      heading3: {
                        color: colors.text.primary,
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 4,
                      },
                      paragraph: {
                        color: colors.text.primary,
                        fontSize: 16,
                        lineHeight: 22,
                        marginBottom: 8,
                      },
                      strong: {
                        fontWeight: '700',
                      },
                      em: {
                        fontStyle: 'italic',
                      },
                      bullet_list: {
                        marginBottom: 8,
                      },
                      ordered_list: {
                        marginBottom: 8,
                      },
                      list_item: {
                        color: colors.text.primary,
                        fontSize: 16,
                        lineHeight: 22,
                        marginBottom: 4,
                      },
                      code_inline: {
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        color: colors.text.primary,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      },
                      code_block: {
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        color: colors.text.primary,
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      },
                      fence: {
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        color: colors.text.primary,
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      },
                      blockquote: {
                        backgroundColor: 'rgba(128,128,128,0.2)',
                        borderLeftWidth: 4,
                        borderLeftColor: colors.tint,
                        paddingLeft: 12,
                        paddingVertical: 8,
                        marginBottom: 8,
                      },
                      link: {
                        color: colors.tint,
                        textDecorationLine: 'underline',
                      },
                      hr: {
                        backgroundColor: 'rgba(128,128,128,0.3)',
                        height: 1,
                        marginVertical: 12,
                      },
                      table: {
                        borderWidth: 1,
                        borderColor: 'rgba(128,128,128,0.3)',
                        borderRadius: 8,
                        marginBottom: 8,
                      },
                      thead: {
                        backgroundColor: 'rgba(128,128,128,0.2)',
                      },
                      th: {
                        color: colors.text.primary,
                        fontWeight: '700',
                        padding: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(128,128,128,0.3)',
                      },
                      td: {
                        color: colors.text.primary,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(128,128,128,0.3)',
                      },
                    }}
                  >
                    {mensaje.texto}
                  </Markdown>
                )}
                <Text
                  style={[
                    styles.messageTime,
                    mensaje.esUsuario && styles.userMessageTime,
                  ]}
                >
                  {mensaje.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          )}
          {isLoading && (
            <View style={[styles.messageBubble, styles.botBubble, { backgroundColor: 'rgba(128,128,128,0.2)' }]}>
              <ActivityIndicator size="small" color={colors.tint} />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text.primary }]}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor={colors.icon.secondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.tint },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={enviarMensaje}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    minHeight: Platform.OS === 'ios' ? 120 : 100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 6,
  },
  contextSelector: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  contextSelectorContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  contextChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contextChipText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
  },
  contextChipTextActive: {
    fontWeight: '600',
    opacity: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    gap: 6,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#fff',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.65,
    color: '#fff',
  },
  userMessageTime: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 90,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(128,128,128,0.15)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
