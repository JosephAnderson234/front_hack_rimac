import { useAuth } from '@/contexts/auth-context';
import { Redirect } from 'expo-router';

export default function Index() {
  const { user, isLoading } = useAuth();

  // Mostrar nada mientras carga
  if (isLoading) {
    return null;
  }

  // Redirigir según el estado de autenticación
  if (user) {
    return <Redirect href="/(tabs)/salud" />;
  }

  return <Redirect href="/sign-in" />;
}
