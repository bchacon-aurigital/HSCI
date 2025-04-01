export const formatDate = (dateStr: string) => {
  if (!dateStr) return 'No disponible';
  
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return dateStr;
  }
};
  