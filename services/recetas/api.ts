import {
  DeleteRecetaResponse,
  GetRecetaDetalleResponse,
  GetRecetasResponse,
  UpdateRecetaRequest,
  UpdateRecetaResponse,
  UploadRecetaResponse,
} from '@/interfaces/recetas';
import { tokenStorage } from '@/services/auth/storage';
import Constants from 'expo-constants';

const BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_RECETAS_URL ||
  process.env.EXPO_PUBLIC_RECETAS_URL ||
  'https://your-recetas-api.com';

console.log('[RecetasService] Inicializando con BASE_URL:', BASE_URL);

class RecetasError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'RecetasError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  console.log('[RecetasService] Respuesta (texto):', text);

  let data;
  try {
    data = JSON.parse(text);
    console.log('[RecetasService] Respuesta parseada:', JSON.stringify(data, null, 2));
  } catch (e) {
    throw new RecetasError('La respuesta del servidor no es JSON válido', response.status);
  }

  if (!response.ok) {
    throw new RecetasError(
      data.error || data.message || `Error ${response.status}`,
      response.status,
      data
    );
  }

  return data;
}

// Subir receta (POST /recetas)
export const uploadReceta = async (file: any): Promise<UploadRecetaResponse> => {
  console.log('[RecetasService] Upload receta request');
  try {
    const idToken = await tokenStorage.getIdToken();
    if (!idToken) {
      throw new RecetasError('No hay token de autenticación', 401);
    }

    const formData = new FormData();
    
    // En React Native, necesitamos crear el objeto de archivo de esta manera
    const fileToUpload = {
      uri: file.uri,
      type: file.mimeType || 'image/jpeg',
      name: file.name || 'receta.jpg',
    };

    formData.append('file', fileToUpload as any);

    console.log('[RecetasService] Subiendo archivo:', fileToUpload);

    const response = await fetch(`${BASE_URL}/recetas`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    console.log('[RecetasService] Upload status:', response.status);
    const result = await handleResponse<UploadRecetaResponse>(response);
    console.log('[RecetasService] Upload result:', result);

    return result;
  } catch (error) {
    console.error(`[RecetasService] Error en ${BASE_URL}/recetas:`, error);
    if (error instanceof RecetasError) {
      throw error;
    }
    throw new RecetasError(`Error de conexión con ${BASE_URL}/recetas`);
  }
};

// Obtener todas las recetas (GET /recetas)
export const getRecetas = async (): Promise<GetRecetasResponse> => {
  console.log('[RecetasService] Get recetas request');
  try {
    const idToken = await tokenStorage.getIdToken();
    if (!idToken) {
      throw new RecetasError('No hay token de autenticación', 401);
    }

    const response = await fetch(`${BASE_URL}/recetas`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[RecetasService] Get recetas status:', response.status);
    const result = await handleResponse<GetRecetasResponse>(response);
    console.log('[RecetasService] Get recetas result:', result);

    return result;
  } catch (error) {
    console.error(`[RecetasService] Error en ${BASE_URL}/recetas:`, error);
    if (error instanceof RecetasError) {
      throw error;
    }
    throw new RecetasError(`Error de conexión con ${BASE_URL}/recetas`);
  }
};

// Obtener detalle de receta (GET /recetas/:id)
export const getRecetaDetalle = async (id: string): Promise<GetRecetaDetalleResponse> => {
  console.log('[RecetasService] Get receta detalle request:', id);
  try {
    const idToken = await tokenStorage.getIdToken();
    if (!idToken) {
      throw new RecetasError('No hay token de autenticación', 401);
    }

    const response = await fetch(`${BASE_URL}/recetas/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[RecetasService] Get receta detalle status:', response.status);
    const result = await handleResponse<GetRecetaDetalleResponse>(response);
    console.log('[RecetasService] Get receta detalle result:', result);

    return result;
  } catch (error) {
    console.error(`[RecetasService] Error en ${BASE_URL}/recetas/${id}:`, error);
    if (error instanceof RecetasError) {
      throw error;
    }
    throw new RecetasError(`Error de conexión con ${BASE_URL}/recetas/${id}`);
  }
};

// Actualizar receta (PUT /recetas/:id)
export const updateReceta = async (
  id: string,
  data: UpdateRecetaRequest
): Promise<UpdateRecetaResponse> => {
  console.log('[RecetasService] Update receta request:', id, data);
  try {
    const idToken = await tokenStorage.getIdToken();
    if (!idToken) {
      throw new RecetasError('No hay token de autenticación', 401);
    }

    const response = await fetch(`${BASE_URL}/recetas/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('[RecetasService] Update receta status:', response.status);
    const result = await handleResponse<UpdateRecetaResponse>(response);
    console.log('[RecetasService] Update receta result:', result);

    return result;
  } catch (error) {
    console.error(`[RecetasService] Error en ${BASE_URL}/recetas/${id}:`, error);
    if (error instanceof RecetasError) {
      throw error;
    }
    throw new RecetasError(`Error de conexión con ${BASE_URL}/recetas/${id}`);
  }
};

// Eliminar receta (DELETE /recetas/:id)
export const deleteReceta = async (id: string): Promise<DeleteRecetaResponse> => {
  console.log('[RecetasService] Delete receta request:', id);
  try {
    const idToken = await tokenStorage.getIdToken();
    if (!idToken) {
      throw new RecetasError('No hay token de autenticación', 401);
    }

    const response = await fetch(`${BASE_URL}/recetas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[RecetasService] Delete receta status:', response.status);
    const result = await handleResponse<DeleteRecetaResponse>(response);
    console.log('[RecetasService] Delete receta result:', result);

    return result;
  } catch (error) {
    console.error(`[RecetasService] Error en ${BASE_URL}/recetas/${id}:`, error);
    if (error instanceof RecetasError) {
      throw error;
    }
    throw new RecetasError(`Error de conexión con ${BASE_URL}/recetas/${id}`);
  }
};
