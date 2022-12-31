import useDecimalSeparator from 'hooks/parsing/useDecimalSeparator';

/**
 * Parse a number using the current locale or the provided one.
 * @param s - The number to parse.
 * @param locale - The locale to us, if empty use the current one.
 */
const useParseFloat = (s: string, locale?: string) => {
  const separator = useDecimalSeparator(locale);
  // Remove thousand separators, and put a point where the decimal separator occurs
  const string = Array.from(s, (c) => (c === separator ? '.' : c)).join('');
  return parseFloat(string);
};

export default useParseFloat;
