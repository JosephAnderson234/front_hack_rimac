import {
    ActivarModoFamiliarResponse,
    AgregarDependienteRequest,
    AgregarDependienteResponse,
    ListarDependientesResponse,
} from '@/interfaces/familia';
import { authenticatedFetch } from '@/services/auth';
import Constants from 'expo-constants';

const API_URL_FAMILIA =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_URL ||
  process.env.EXPO_PUBLIC_AUTH_URL ||
  'https://blkmrdvd75.execute-api.us-east-1.amazonaws.com/dev';

class FamiliaError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'FamiliaError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  console.log('[FamiliaService] Respuesta (texto):', text);

  let data;
  try {
    data = JSON.parse(text);
    console.log('[FamiliaService] Respuesta parseada:', JSON.stringify(data, null, 2));
  } catch (e) {
    throw new FamiliaError('La respuesta del servidor no es JSON válido', response.status);
  }

  if (!response.ok) {
    throw new FamiliaError(
      data.error || data.message || `Error ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

export const activarModoFamiliar = async (): Promise<ActivarModoFamiliarResponse> => {
  console.log('[FamiliaService] Activar modo familiar request:', `${API_URL_FAMILIA}/activar-modo-familiar`);
  try {
    const response = await authenticatedFetch(`${API_URL_FAMILIA}/activar-modo-familiar`, {
      method: 'PUT',
    });
    console.log('[FamiliaService] Activar modo familiar status:', response.status);

    const result = await handleResponse<ActivarModoFamiliarResponse>(response);
    console.log('[FamiliaService] Activar modo familiar result:', result);

    return result;
  } catch (error) {
    console.error(`[FamiliaService] Error en ${API_URL_FAMILIA}/activar-modo-familiar:`, error);
    if (error instanceof FamiliaError) {
      throw error;
    }
    throw new FamiliaError(`Error de conexión con ${API_URL_FAMILIA}/activar-modo-familiar`);
  }
};

export const listarDependientes = async (): Promise<ListarDependientesResponse> => {
  console.log('[FamiliaService] Listar dependientes request:', `${API_URL_FAMILIA}/listar-dependientes`);
  try {
    const response = await authenticatedFetch(`${API_URL_FAMILIA}/listar-dependientes`, {
      method: 'GET',
    });
    console.log('[FamiliaService] Listar dependientes status:', response.status);

    const result = await handleResponse<ListarDependientesResponse>(response);
    console.log('[FamiliaService] Listar dependientes result:', result);

    return result;
  } catch (error) {
    console.error(`[FamiliaService] Error en ${API_URL_FAMILIA}/listar-dependientes:`, error);
    if (error instanceof FamiliaError) {
      throw error;
    }
    throw new FamiliaError(`Error de conexión con ${API_URL_FAMILIA}/listar-dependientes`);
  }
};

export const agregarDependiente = async (
  data: AgregarDependienteRequest
): Promise<AgregarDependienteResponse> => {
  // Crear una copia sin correo_tutor para que el backend lo tome del token
  const { correo_tutor, ...dataWithoutEmail } = data;
  
  console.log('[FamiliaService] Agregar dependiente request:', `${API_URL_FAMILIA}/agregar-dependiente`);
  console.log('[FamiliaService] Data original:', data);
  console.log('[FamiliaService] Data a enviar (sin correo_tutor):', dataWithoutEmail);
  
  try {
    const response = await authenticatedFetch(`${API_URL_FAMILIA}/agregar-dependiente`, {
      method: 'POST',
      body: JSON.stringify(dataWithoutEmail),
    });
    console.log('[FamiliaService] Agregar dependiente status:', response.status);

    const result = await handleResponse<AgregarDependienteResponse>(response);
    console.log('[FamiliaService] Agregar dependiente result:', result);

    return result;
  } catch (error) {
    console.error(`[FamiliaService] Error en ${API_URL_FAMILIA}/agregar-dependiente:`, error);
    if (error instanceof FamiliaError) {
      throw error;
    }
    throw new FamiliaError(`Error de conexión con ${API_URL_FAMILIA}/agregar-dependiente`);
  }
};
