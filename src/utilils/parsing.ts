/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export function decimalSeparator(locale?: string): string {
  // Get the thousands and decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
}

/**
 * Parse a number using the current locale or the provided one.
 * @param s - The number to parse.
 * @param locale - The locale to us, if empty use the current one.
 */
export function localeParseFloat(s: string, locale?: string): number {
  const separator = decimalSeparator(locale);
  // Remove thousand separators, and put a point where the decimal separator occurs
  const string = Array.from(s, (c) => (c === separator ? '.' : c)).join('');
  // Now it can be parsed
  return parseFloat(string);
}
