export interface Horario {
  lunes: string[];
  martes: string[];
  miercoles: string[];
  jueves: string[];
  viernes: string[];
  sabado: string[];
}

export interface HorariosSede {
  virtual?: Horario;
  presencial?: Horario;
}

export interface Doctor {
  nombre: string;
  codigo_cmp: string;
  especialidad: string;
  sedes: string[];
  tipo_atencion: string;
  horarios: {
    [sede: string]: HorariosSede;
  };
}
