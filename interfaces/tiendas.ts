export interface Tienda {
  id: string;
  nombre: string;
  direccion: string;
  distancia: number; // en kilómetros
  precio: number; // precio del medicamento
  disponible: boolean;
  horario: string;
  telefono?: string;
  urlTiendaOnline?: string;
  rating: number; // 1-5
}

export interface MedicamentoEnTienda {
  medicamento: string;
  tiendas: Tienda[];
}
