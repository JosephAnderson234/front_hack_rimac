import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// 1. Configurar el comportamiento de las notificaciones
// Esto controla cómo se muestran las notificaciones cuando la app está en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // Mostrar alerta visual
    shouldPlaySound: true,     // Reproducir sonido
    shouldSetBadge: false,     // No actualizar badge (contador)
    shouldShowBanner: true,    // Mostrar banner en la parte superior
    shouldShowList: true,      // Agregar a la lista de notificaciones
  }),
});

// 2. Handler para mensajes en BACKGROUND o cuando la app está CERRADA
// Este handler se ejecuta ANTES de que la app se abra
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Mensaje recibido en background:', remoteMessage);

  // AWS SNS envía mensajes "data-only" (sin notification payload)
  // Por eso debemos crear manualmente la notificación visual
  if (remoteMessage.data) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: String(remoteMessage.data.titulo || 'Notificación'),
          body: String(remoteMessage.data.default || 'Tienes un mensaje nuevo'),
          data: remoteMessage.data, // Pasamos toda la data para usarla al tocar
          sound: 'default',
        },
        trigger: null, // null = mostrar inmediatamente
      });
      console.log('✅ Notificación programada exitosamente');
    } catch (error) {
      console.error('❌ Error al programar notificación:', error);
    }
  }
});