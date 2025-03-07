export function parseOrder(
  orderQuery?: string,
): Record<string, 'ASC' | 'DESC'> {
  if (!orderQuery) return { id: 'ASC' }; // Ordem padrão

  return orderQuery.split(',').reduce(
    (acc, fieldOrder) => {
      const [field, direction] = fieldOrder.split(':');
      if (field && ['ASC', 'DESC'].includes(direction)) {
        acc[field] = direction as 'ASC' | 'DESC';
      }
      return acc;
    },
    {} as Record<string, 'ASC' | 'DESC'>,
  );
}
