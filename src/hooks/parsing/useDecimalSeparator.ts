/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
const useDecimalSeparator = (locale?: string) => {
  // Get the thousands and decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
};

export default useDecimalSeparator;
