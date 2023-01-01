import useDecimalSeparator from 'hooks/parsing/useDecimalSeparator';
import {useCallback} from 'react';

/**
 * Parse a number using the current locale or the provided one.
 * @param locale - The locale to us, if empty use the current one.
 */
const useParseFloat = (locale?: string) => {
  const separator = useDecimalSeparator(locale);
  return useCallback((s: string)  => {
    // Remove thousand separators, and put a point where the decimal separator occurs
    const string = Array.from(s, (c) => (c === separator ? '.' : c)).join('');
    return parseFloat(string);
  }, [locale]);
};

export default useParseFloat;
