// eslint-disable-next-line max-classes-per-file
import { delay } from 'lib/PromiseUtils/index';

/**
 * Class that represents the result of a completed promise
 * within a specified timeout duration.
 */
export class CompletedResult<T> implements ResultI<T> {
  readonly resultData: T;

  constructor(data: T) {
    this.resultData = data;
  }

  /**
   * Gets the computed data.
   */
  get data(): T {
    return this.resultData;
  }

  isCompleted(): this is CompletedResult<T> {
    return true;
  }

  isTimedOut(): this is TimedOutResult<T> {
    return false;
  }
}

/**
 * Utility function to construct a `CompletedResult`.
 * @param data - Data that has been computed.
 */
export function completed<T>(data: T): CompletedResult<T> {
  return new CompletedResult(data);
}

/**
 * Class that represents the result when a promise
 * does not resolve within a timeout duration.
 */
class TimedOutResult<T> implements ResultI<T> {
  isCompleted(): this is CompletedResult<T> {
    return false;
  }

  isTimedOut(): this is TimedOutResult<T> {
    return true;
  }
}

/**
 * Utility function to construct a `TimedOutResult`.
 */
export function timedOut<T>(): TimedOutResult<T> {
  return new TimedOutResult();
}

/**
 * Interface that represents a result from a computation that
 * have a timeout.
 */
interface ResultI<T> {
  /**
   * Checks if the computation completed correctly.
   *
   * @returns `true` if the result represents a completed computation,
   * `false` otherwise.
   */
  isCompleted(): this is CompletedResult<T>;

  /**
   * Checks if the computation timed out.
   *
   * @returns `true` if the result represents a computation that timed out,
   * `false` otherwise.
   */
  isTimedOut(): this is TimedOutResult<T>;
}

/**
 * Type that represents the result of an operation that involves a timeout.
 * It can hold either a `CompletedResult` or a `TimedOutResult` object.
 */
type TimeoutResult<T> = CompletedResult<T> | TimedOutResult<T>;

/**
 * Class that wraps a promise to implement a timeout logic so that
 * a promise can complete correctly or complete with a timeout.
 */
export class PromiseTimeout<T> implements Promise<TimeoutResult<T>> {
  // Field used from the toString function to represent this type.
  [Symbol.toStringTag]: string;

  // The wrapped promise.
  private promise: Promise<TimeoutResult<T>>;

  private constructor(promise: Promise<T>, timeoutMs: number) {
    this[Symbol.toStringTag] = 'PromiseTimeout';
    this.promise = Promise.race<Promise<TimeoutResult<T>>>([
      promise.then(completed),
      delay(timeoutMs).then(() => timedOut()),
    ]);
  }

  /**
   * Wraps a promise and construct a `TimeoutPromise`.
   * @param promise - The promise to wrap.
   * @param timeoutMs - Amount of ms to wait before considering the
   * promise as timed out.
   */
  static wrap<T>(promise: Promise<T>, timeoutMs: number) {
    return new PromiseTimeout(promise, timeoutMs);
  }

  /**
   * Function to resolve the wrapped promise with a provided value
   * on time out.
   * @param fallbackValue - Fallback value that will be resolved if the
   * wrapped promise times out.
   * @param catchErrors - Optional flag to consider the thrown errors as
   * an execution that timed out.
   */
  async onTimeoutFallback(fallbackValue: T, catchErrors?: boolean): Promise<T> {
    const promise = this.then((result) => {
      if (result.isCompleted()) {
        return result.data;
      }
      return fallbackValue;
    });
    return catchErrors ? promise.catch(() => fallbackValue) : promise;
  }

  then<TResult1 = TimeoutResult<T>, TResult2 = never>(
    onfulfilled?: ((value: TimeoutResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<TimeoutResult<T> | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<TimeoutResult<T>> {
    return this.promise.finally(onfinally);
  }
}
