import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme ?? 'light'];

  const ProfileButton = () => (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/perfil')}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="person-circle-outline" size={28} color={colors.tint} />
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        headerRight: () => <ProfileButton />,
      }}>
      <Tabs.Screen
        name="salud"
        options={{
          title: 'Salud',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="familia"
        options={{
          title: 'Familia',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agendas"
        options={{
          title: 'Agendas',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recetas"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color }) => <Ionicons name="document-text" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="receta-detalle"
        options={{
          title: 'Detalle de Receta',
          href: null, // Esto oculta la tab de la barra inferior
          headerShown: false, // Oculta el header
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          href: null, // Esto oculta la tab de la barra inferior
          headerShown: false, // Oculta el header en perfil
        }}
      />
    </Tabs>
  );
}
