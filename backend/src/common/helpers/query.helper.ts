/**
 * Helper para parsear parâmetros de ordenação de queries
 *
 * Converte strings de ordenação em objetos que o TypeORM pode entender
 *
 * @example
 * parseOrder('name:ASC')                 // { name: 'ASC' }
 * parseOrder('createdAt:DESC')           // { createdAt: 'DESC' }
 * parseOrder('name:ASC,createdAt:DESC')  // { name: 'ASC', createdAt: 'DESC' }
 * parseOrder()                           // { id: 'ASC' } (padrão)
 *
 * @param orderQuery - String com formato "campo:direção" separado por vírgulas
 * @returns Objeto com campos e direções de ordenação
 */
export function parseOrder(
  orderQuery?: string,
): Record<string, 'ASC' | 'DESC'> {
  // Se não foi fornecida ordenação, usa ordenação padrão por ID ascendente
  if (!orderQuery) return { id: 'ASC' };

  // Separa por vírgula e processa cada par campo:direção
  return orderQuery.split(',').reduce(
    (acc, fieldOrder) => {
      // Separa o campo e a direção (ex: "name:ASC" -> ["name", "ASC"])
      const [field, direction] = fieldOrder.split(':');

      // Valida se o campo existe e a direção é válida (ASC ou DESC)
      if (field && ['ASC', 'DESC'].includes(direction)) {
        acc[field] = direction as 'ASC' | 'DESC';
      }
      return acc;
    },
    {} as Record<string, 'ASC' | 'DESC'>,
  );
}
