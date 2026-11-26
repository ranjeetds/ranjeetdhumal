/** Compare search text without case or accents, so "godel" finds "Gödel". */
export function foldSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
