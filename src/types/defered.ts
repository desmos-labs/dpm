/**
 * Enum that represents the possible state of a Deferred.
 */
export enum DeferredState {
  Pending,
  Completed,
  Failed,
}

// Const that represent a pending deferred this is reused since can represent any pending deferred.
let PENDING_SINGLETON: Deferred<any> | null = null;

/**
 * Class that represents a value that is begin compute asynchronously.
 * Each deferred can be in one of the following state:
 * - Pending: The value is begin computed;
 * - Completed: The value has be computed correctly;
 * - Failed: The value computation has failed.
 */
export default class Deferred<T> {
  private readonly _value: T | undefined;

  private readonly _state: DeferredState;

  private readonly _error: string | undefined;

  private constructor(state: DeferredState, value: T | undefined, error: string | undefined) {
    this._state = state;
    this._value = value;
    this._error = error;
    switch (state) {
      case DeferredState.Pending:
        if (value !== undefined || error !== undefined) {
          throw new Error("Pending deferred can't have a value or error message");
        }
        break;

      case DeferredState.Completed:
        if (value === undefined || error !== undefined) {
          throw new Error('A completed deferred must have a valid value and not error message');
        }
        break;

      case DeferredState.Failed:
        if (value !== undefined || error === undefined) {
          throw new Error('A failed deferred must have a valid error message and not value');
        }
        break;
      default:
        throw new Error('Wrong deferred state');
    }
  }

  /**
   * Gets the computed value.
   * Throws an error if the value computation has not completed correctly.
   */
  value(): T {
    if (this._state === DeferredState.Completed) {
      return this._value!;
    }
    throw new Error("Can't have value of a non completed deferred");
  }

  /**
   * Gets the Deferred state.
   */
  state(): DeferredState {
    return this._state;
  }

  /**
   * Gets the error message.
   * Throws an error if the value computation has not failed.
   */
  error(): string {
    if (this._state === DeferredState.Failed) {
      return this._error!;
    }
    throw new Error("Can't have error message of a non failed deferred");
  }

  /**
   * Returns true if the computation is in progress.
   */
  isPending(): boolean {
    return this._state === DeferredState.Pending;
  }

  /**
   * Returns true if the value computation has complete correctly.
   */
  isCompleted(): boolean {
    return this._state === DeferredState.Completed;
  }

  /**
   * Returns true if the value computation failed.
   */
  isFailed(): boolean {
    return this._state === DeferredState.Failed;
  }

  /**
   * Creates a deferred in Pending state.
   */
  static pending<T>(): Deferred<T> {
    // Create just a single instance since al pending Deferred don't have value and error message.
    if (PENDING_SINGLETON === null) {
      PENDING_SINGLETON = new Deferred<any>(DeferredState.Pending, undefined, undefined);
    }

    return PENDING_SINGLETON;
  }

  /**
   * Creates a deferred in Completed state.
   * @param value: The value that as been computed.
   */
  static completed<T>(value: T): Deferred<T> {
    return new Deferred<T>(DeferredState.Completed, value, undefined);
  }

  /**
   * Creates a deferred in Failed state.
   * @param error: Message of the error occurred during the value computation.
   */
  static failed<T>(error: string): Deferred<T> {
    return new Deferred<T>(DeferredState.Failed, undefined, error);
  }
}
