import { Result, ResultAsync } from 'neverthrow';

/**
 * Utility function to wrap a promise in a Result.
 * @param promise - The promise to wrap.
 * @param errorMessage - Error message returned if the promise rejects with an object
 * that is not an instance of {@link Error}.
 */
export const promiseToResult = <T>(
  promise: Promise<T>,
  errorMessage: string,
): ResultAsync<T, Error> => {
  return ResultAsync.fromPromise(promise, (e: any) =>
    e?.message ? (e as Error) : new Error(errorMessage),
  );
};

/**
 * Function to unwrap the value from {@link Result} object.
 * This function will throw the error if the {@link Result} object is an error.
 * @param result - The Result object to unwrap.
 */
export const unwrapResult = <T>(result: Result<T, Error>): T => {
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
};
