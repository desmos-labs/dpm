import { completed, CompletedResult, delay, PromiseTimeout, timedOut } from 'lib/PromiseUtils';

describe('PromiseTimeout', () => {
  it('on completed resolves a CompletedResult', async () => {
    const testPromise = delay(1000).then(() => 42);
    const wrappedResult = await PromiseTimeout.wrap(testPromise, 2000);

    expect(wrappedResult.isCompleted()).toBe(true);
    expect((wrappedResult as CompletedResult<number>).data).toBe(42);
  });

  it('on timeout resolves to TimedOutResult', async () => {
    const testPromise = delay(2000).then(() => 42);
    const wrappedResult = await PromiseTimeout.wrap(testPromise, 1000);

    expect(wrappedResult.isTimedOut()).toBe(true);
  });

  it('onTimeoutFallback provides the fallback value', async () => {
    const testPromise = delay(2000).then(() => 42);
    const result = await PromiseTimeout.wrap(testPromise, 1000).onTimeoutFallback(1337);

    expect(result).toBe(1337);
  });

  it('onTimeoutFallback catches the errors', async () => {
    const testPromise = new Promise((resolve, reject) => {
      reject(new Error('test error'));
    });
    const result = await PromiseTimeout.wrap(testPromise, 1000).onTimeoutFallback(1337, true);

    expect(result).toBe(1337);
  });

  it('CompletedResult implements the ResultI correctly', () => {
    const completedResult = completed(42);
    expect(completedResult.isCompleted()).toBe(true);
    expect(completedResult.isTimedOut()).toBe(false);
    expect(completedResult.data).toBe(42);
  });

  it('TimedOutResult implements the ResultI correctly', () => {
    const completedResult = timedOut();
    expect(completedResult.isCompleted()).toBe(false);
    expect(completedResult.isTimedOut()).toBe(true);
  });
});
