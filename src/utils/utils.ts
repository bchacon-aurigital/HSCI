export const formatDate = (fecha: string): string => {
    try {
      const parts = fecha.split('..');
      const [day, month, year] = parts[0].split('.');
      const time = parts[1].replace('.', ':');
      const monthIndex = parseInt(month) - 1;
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return `${parseInt(day)} de ${months[monthIndex]} de ${year}, ${time}`;
    } catch {
      return fecha;
    }
  };
  