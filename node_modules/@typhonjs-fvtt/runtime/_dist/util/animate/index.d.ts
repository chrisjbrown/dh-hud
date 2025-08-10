/**
 * Awaits `requestAnimationFrame` calls by the counter specified. This allows asynchronous applications for direct /
 * inline style modification amongst other direct animation techniques.
 *
 * @param {number}   [cntr=1] - A positive integer greater than 0 for amount of requestAnimationFrames to wait.
 *
 * @returns {Promise<number>} Returns time of last `requestAnimationFrame` callback.
 */
declare function nextAnimationFrame(cntr?: number): Promise<number>;

/**
 * State that is available in the resolution of the {@link Promise} for {@link BasicAnimation.finished}.
 */
type BasicAnimationState = {
  /**
   * True if the animation was cancelled.
   */
  cancelled: boolean;
};
/**
 * Defines the implementation for basic animation control.
 */
interface BasicAnimation {
  /**
   * True if animation is active; note: delayed animations are not active until start.
   */
  readonly isActive: boolean;
  /**
   * True if animation is completely finished.
   */
  readonly isFinished: boolean;
  /**
   * A Promise that is resolved when animation is finished.
   */
  readonly finished: Promise<BasicAnimationState>;
  /**
   * Cancels animation when invoked.
   */
  cancel(): void;
}

export { type BasicAnimation, type BasicAnimationState, nextAnimationFrame };
