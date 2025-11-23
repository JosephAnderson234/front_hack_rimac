export interface Receta {
  producto: string;
  dosis: string;
  frecuencia_valor: number;
  frecuencia_unidad: string;
  duracion: string;
}

export interface RecetaDetalle {
  receta_id: string;
  correo: string;
  url_firmada: string;
  paciente: string | null;
  institucion: string;
  recetas: Receta[];
  fecha_subida: string;
}

export interface UploadRecetaResponse {
  message: string;
  receta_id: string;
  url_firmada: string;
  data: {
    paciente: string | null;
    institucion: string;
    recetas: Receta[];
  };
}

export interface GetRecetasResponse {
  message: string;
  count: number;
  data: RecetaDetalle[];
}

export interface GetRecetaDetalleResponse {
  message: string;
  data: RecetaDetalle;
}

export interface UpdateRecetaRequest {
  paciente: string;
  institucion: string;
  recetas: Receta[];
}

export interface UpdateRecetaResponse {
  message: string;
  data: RecetaDetalle;
}

export interface DeleteRecetaResponse {
  message: string;
  receta_id: string;
}
