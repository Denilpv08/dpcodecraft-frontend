// Formatea una fecha ISO a texto legible en español
export const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calcula días desde una fecha
export const daysSince = (isoString: string): number => {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Verifica si una fecha es hoy
export const isToday = (isoString: string): boolean => {
  const date = new Date(isoString).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  return date === today;
};

// Tiempo estimado legible
export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
};
