/**
 * Class that represents a timer that can be used
 * to compute time differences.
 */
export class Timer {
  startTime: Date;

  /**
   * Construct the timer and starts it.
   */
  constructor() {
    this.startTime = new Date();
  }

  /**
   * Get the difference in milliseconds from when the
   * timer has been started.
   */
  currentMs(): number {
    const now = new Date();
    return now.getTime() - this.startTime.getTime();
  }

  /**
   * Restart the timer.
   */
  reset() {
    this.startTime = new Date();
  }
}
