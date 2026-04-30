/**
 * Utilidades para el proyecto NASA - Eventos Astronómicos
 * Funciones helper para manipulación de fechas, filtrado y formateo
 */

/**
 * Formatea una fecha en formato legible
 * @param {string} dateString - Fecha en formato 'YYYY-MM-DD'
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", options);
};

/**
 * Calcula días restantes hasta un evento
 * @param {string} eventDate - Fecha del evento 'YYYY-MM-DD'
 * @returns {number} Número de días restantes
 */
export const getDaysUntilEvent = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determina si un evento está próximo (menos de 7 días)
 * @param {string} eventDate - Fecha del evento
 * @returns {boolean}
 */
export const isUpcoming = (eventDate) => {
  const daysUntil = getDaysUntilEvent(eventDate);
  return daysUntil >= 0 && daysUntil <= 7;
};

/**
 * Filtra eventos por tipo
 * @param {Array} events - Array de eventos
 * @param {string} type - Tipo de evento a filtrar
 * @returns {Array} Eventos filtrados
 */
export const filterByType = (events, type) => {
  return events.filter((event) => event.type === type);
};

/**
 * Filtra eventos por dificultad
 * @param {Array} events - Array de eventos
 * @param {string} difficulty - Nivel de dificultad
 * @returns {Array} Eventos filtrados
 */
export const filterByDifficulty = (events, difficulty) => {
  return events.filter((event) => event.difficulty === difficulty);
};

/**
 * Ordena eventos por fecha
 * @param {Array} events - Array de eventos
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Eventos ordenados
 */
export const sortByDate = (events, order = "asc") => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Obtiene eventos del mes actual
 * @param {Array} events - Array de eventos
 * @returns {Array} Eventos del mes actual
 */
export const getEventsThisMonth = (events) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });
};

/**
 * Genera un color basado en el tipo de evento
 * @param {string} type - Tipo de evento
 * @returns {string} Código de color hexadecimal
 */
export const getEventColor = (type) => {
  const colorMap = {
    "Lluvia de Meteoros": "#4a90e2",
    "Eclipse Solar": "#ff8c00",
    "Eclipse Lunar": "#ff6347",
    "Oposición Planetaria": "#ff4444",
    "Conjunción Planetaria": "#9370db",
    "Luna Llena": "#ffd700",
    "Paso de Satélite": "#00bfff",
    "Evento Planetario": "#ff69b4",
    "Evento Solar": "#ffa500",
  };

  return colorMap[type] || "#4a90e2";
};

/**
 * Valida si una fecha está en el futuro
 * @param {string} dateString - Fecha a validar
 * @returns {boolean}
 */
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Obtiene eventos futuros solamente
 * @param {Array} events - Array de eventos
 * @returns {Array} Eventos futuros
 */
export const getFutureEvents = (events) => {
  return events.filter((event) => isFutureDate(event.date));
};

/**
 * Busca eventos por término de búsqueda
 * @param {Array} events - Array de eventos
 * @param {string} searchTerm - Término a buscar
 * @returns {Array} Eventos que coinciden
 */
export const searchEvents = (events, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return events.filter(
    (event) =>
      event.title.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.type.toLowerCase().includes(term),
  );
};

/**
 * Obtiene estadísticas de eventos
 * @param {Array} events - Array de eventos
 * @returns {Object} Estadísticas
 */
export const getEventStats = (events) => {
  const stats = {
    total: events.length,
    byType: {},
    byDifficulty: {},
    upcoming: 0,
  };

  events.forEach((event) => {
    // Contar por tipo
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

    // Contar por dificultad
    stats.byDifficulty[event.difficulty] =
      (stats.byDifficulty[event.difficulty] || 0) + 1;

    // Contar próximos
    if (isUpcoming(event.date)) {
      stats.upcoming += 1;
    }
  });

  return stats;
};

/**
 * Convierte tiempo en formato 24h a 12h
 * @param {string} time24 - Tiempo en formato 24h (ej: "14:30")
 * @returns {string} Tiempo en formato 12h (ej: "2:30 PM")
 */
export const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Trunca texto largo
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
