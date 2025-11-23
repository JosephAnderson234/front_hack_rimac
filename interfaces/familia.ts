export interface ActivarModoFamiliarResponse {
  message: string;
  correo: string;
  rol_anterior: string;
  rol_nuevo: string;
}

export interface Dependiente {
  dependiente_id: string;
  nombre: string;
  sexo: string;
  parentesco: string;
  correo_tutor: string;
  cumpleanos: string;
}

export interface ListarDependientesResponse {
  message: string;
  correo_tutor: string;
  total: number;
  dependientes: Dependiente[];
}

export interface AgregarDependienteRequest {
  correo_tutor: string;
  nombre: string;
  cumpleanos: string;
  parentesco: string;
  sexo: string;
}

export interface AgregarDependienteResponse {
  message: string;
  dependiente: Dependiente;
}
