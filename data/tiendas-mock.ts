import { Tienda } from '@/interfaces/tiendas';

// Función para generar tiendas aleatorias para un medicamento
export const generarTiendasParaMedicamento = (medicamento: string): Tienda[] => {
  // Normalizar el nombre del medicamento para URL (minúsculas, sin espacios)
  const medicamentoUrl = medicamento.toLowerCase().replace(/\s+/g, '-');
  
  const tiendas: Tienda[] = [
    {
      id: '1',
      nombre: 'Farmacia Universal',
      direccion: 'Av. Arequipa 1234, Miraflores',
      distancia: 0.5,
      precio: 45.90,
      disponible: true,
      horario: '24 horas',
      telefono: '01-234-5678',
      urlTiendaOnline: `https://www.farmaciauniversal.com.pe/producto/${medicamentoUrl}`,
      rating: 4.5,
    },
    {
      id: '2',
      nombre: 'Boticas BTL',
      direccion: 'Av. Larco 567, Miraflores',
      distancia: 0.8,
      precio: 42.50,
      disponible: true,
      horario: '8:00 AM - 10:00 PM',
      telefono: '01-345-6789',
      urlTiendaOnline: `https://www.btl.com.pe/medicamentos/${medicamentoUrl}`,
      rating: 4.2,
    },
    {
      id: '3',
      nombre: 'InkaFarma',
      direccion: 'Av. Benavides 890, Miraflores',
      distancia: 1.2,
      precio: 48.00,
      disponible: true,
      horario: '24 horas',
      telefono: '01-456-7890',
      urlTiendaOnline: `https://www.inkafarma.pe/search?q=${encodeURIComponent(medicamento)}`,
      rating: 4.0,
    },
    {
      id: '4',
      nombre: 'Mifarma',
      direccion: 'Av. Pardo 345, Miraflores',
      distancia: 1.5,
      precio: 39.90,
      disponible: true,
      horario: '7:00 AM - 11:00 PM',
      telefono: '01-567-8901',
      urlTiendaOnline: `https://www.mifarma.com.pe/buscar?q=${encodeURIComponent(medicamento)}`,
      rating: 4.3,
    },
    {
      id: '5',
      nombre: 'Farmacia Arcángel',
      direccion: 'Calle Los Pinos 123, San Isidro',
      distancia: 2.0,
      precio: 52.00,
      disponible: false,
      horario: '9:00 AM - 9:00 PM',
      telefono: '01-678-9012',
      urlTiendaOnline: `https://www.farmaciaarcangel.pe/producto/${medicamentoUrl}`,
      rating: 3.8,
    },
    {
      id: '6',
      nombre: 'Boticas Fasa',
      direccion: 'Av. Javier Prado 456, San Isidro',
      distancia: 2.3,
      precio: 44.50,
      disponible: true,
      horario: '8:00 AM - 10:00 PM',
      telefono: '01-789-0123',
      urlTiendaOnline: `https://www.fasa.com.pe/catalogo/${medicamentoUrl}`,
      rating: 4.1,
    },
    {
      id: '7',
      nombre: 'Farmacia del Ahorro',
      direccion: 'Av. Conquistadores 789, San Isidro',
      distancia: 2.8,
      precio: 37.90,
      disponible: true,
      horario: '24 horas',
      telefono: '01-890-1234',
      urlTiendaOnline: `https://www.farmaciadelahorro.pe/producto/${medicamentoUrl}`,
      rating: 4.4,
    },
    {
      id: '8',
      nombre: 'Boticas Hogar y Salud',
      direccion: 'Av. Salaverry 234, Jesús María',
      distancia: 3.2,
      precio: 46.00,
      disponible: true,
      horario: '7:00 AM - 11:00 PM',
      telefono: '01-901-2345',
      urlTiendaOnline: `https://www.hogarysalud.pe/medicamento/${medicamentoUrl}`,
      rating: 3.9,
    },
  ];

  return tiendas;
};

// Función para ordenar tiendas por mejor opción (precio bajo + distancia corta)
export const ordenarTiendasPorMejorOpcion = (tiendas: Tienda[]): Tienda[] => {
  // Filtrar solo tiendas disponibles
  const tiendasDisponibles = tiendas.filter(t => t.disponible);

  // Calcular score para cada tienda (menor es mejor)
  // Score = (precio normalizado * 0.6) + (distancia normalizada * 0.4)
  // Damos más peso al precio (60%) que a la distancia (40%)
  
  const precioMin = Math.min(...tiendasDisponibles.map(t => t.precio));
  const precioMax = Math.max(...tiendasDisponibles.map(t => t.precio));
  const distanciaMin = Math.min(...tiendasDisponibles.map(t => t.distancia));
  const distanciaMax = Math.max(...tiendasDisponibles.map(t => t.distancia));

  const tiendasConScore = tiendasDisponibles.map(tienda => {
    // Normalizar precio (0-1, donde 0 es el más barato)
    const precioNormalizado = precioMax > precioMin 
      ? (tienda.precio - precioMin) / (precioMax - precioMin)
      : 0;

    // Normalizar distancia (0-1, donde 0 es el más cercano)
    const distanciaNormalizada = distanciaMax > distanciaMin
      ? (tienda.distancia - distanciaMin) / (distanciaMax - distanciaMin)
      : 0;

    // Calcular score final (menor es mejor)
    const score = (precioNormalizado * 0.6) + (distanciaNormalizada * 0.4);

    return {
      ...tienda,
      score,
    };
  });

  // Ordenar por score (menor primero)
  return tiendasConScore
    .sort((a, b) => a.score - b.score)
    .map(({ score, ...tienda }) => tienda);
};

// Función para obtener la mejor tienda
export const obtenerMejorTienda = (tiendas: Tienda[]): Tienda | null => {
  const ordenadas = ordenarTiendasPorMejorOpcion(tiendas);
  return ordenadas.length > 0 ? ordenadas[0] : null;
};
