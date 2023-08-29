/**
 * Function that checks if the provided string is empty or undefined.
 * @param str - The string to check.
 */
export const isStringEmptyOrUndefined = (str: string | undefined): boolean =>
  str === undefined || str.length === 0;

/**
 * Function that checks if the provided array is empty or undefined.
 * @param arr - The array to check.
 */
export const isArrayEmptyOrUndefined = (arr: any[] | undefined): boolean =>
  arr === undefined || arr.length === 0;
