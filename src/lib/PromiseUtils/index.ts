export * from './timeout';

/**
 * Creates a promise that resolves after the specified amount of
 * milliseconds.
 * @param ms - The amount of milliseconds that the created promise will wait
 * before resolving.
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
