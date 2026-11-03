const roNumber = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 0 });

export function formatNumber(value: number): string {
  return roNumber.format(Math.round(value));
}

export function formatLongDate(date: Date): string {
  return date
    .toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })
    .replace(/(^|\s)(\p{L})/gu, (_match: string, space: string, letter: string) =>
      space + letter.toLocaleUpperCase('ro-RO'),
    );
}
