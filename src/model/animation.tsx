/**
 * Interpolation function type.
 */
export type InterpolationMethod = (a: number, b: number, k: number) => number

/**
 * Linear interpolation.
 *
 * ```
 * + y
 * |       .'
 * |     .'
 * |   .'
 * | .'
 * +---------+ x
 * ```
 * @param a
 * @param b
 * @param k
 * @returns
 */
export function LinearInterpolation(a: number, b: number, k: number) {
    return (1.0 - k) * a + b * k
}

/**
 * Cubic ease-in-out interpolation function. Makes animations as being percieved
 * "smoother".
 *
 * ```
 * + y
 * |        _..-
 * |      ,'
 * |     /
 * | _.-'
 * +-----------+ x
 * ```
 *
 * @param a
 * @param b
 * @param k
 * @returns
 */
export function CubicEaseInOutInterpolation(a: number, b: number, k: number) {
    const k2 = k * k
    return LinearInterpolation(a, b, 3 * k2 - 2 * k2 * k)
}

/**
 * Manages the state of a continouus scalar animation state that can reach "target" values
 * in a fixed amount of time. Additionally provides the possibility to modify
 * the curve at which the animation takes place. Default is linear.
 */
export class AnimationScalarState {
    /**
     * Start or "zero-time" state of animation, maybe equal to currentState
     * but generally lack behind currentState.
     */
    private zeroState: number
    /**
     * Current numerical state of the animation.
     */
    private _currentState: number
    /**
     * How close the current state is to the target state as normalized factor.
     * Required for interpolation.
     */
    private advanceFactor: number
    /**
     * Targeted numerical state of the animation.
     * The target state currently in animation is at index 0. Any targets
     * enqueued afterwards will be worked on subsequently.
     */
    private _targetState: number[]
    /**
     * Interpolation to use for animations.
     */
    private interpolation: InterpolationMethod
    /**
     * Determines whether or not the annimation is halted.
     */
    private halted: boolean
    /**
     * Number of seconds the animations take to reach each target.
     */
    private timeScale: number

    public constructor(
        initialState: number,
        interpolation: InterpolationMethod = LinearInterpolation,
        timeScale = 1
    ) {
        this.timeScale = timeScale
        this.halted = false
        this.zeroState = initialState
        this._currentState = initialState
        this._targetState = []
        this.interpolation = interpolation
        this.advanceFactor = 0.0
    }

    /**
     * Perform the next step in the animation by a time increment.
     *
     * @param delta Time increment in milliseconds.
     */
    public advance(delta: number) {
        if (this._targetState.length == 0 || this.halted) return

        const target = this._targetState[0]

        // Compute how close the target rotation is reached in range [0; 1].
        this.advanceFactor += (delta * 1e-3) / this.timeScale

        if (this.advanceFactor >= 1) {
            // End of animation reached.
            this._currentState = target
            this.zeroState = target
            // Remove first element which is the reached target.
            this._targetState.splice(0, 1)
            this.advanceFactor = 0.0
        } else {
            this._currentState = this.interpolation(
                this.zeroState,
                target,
                this.advanceFactor
            )
        }
    }

    public isAnimationDone(): boolean {
        return this._targetState.length < 1
    }

    public halt() {
        this.halted = true
    }

    public continue() {
        this.halted = false
    }

    public getLatestTarget(): number {
        const idx = this._targetState.length - 1
        if (idx < 0) return this.currentState
        return this._targetState[idx]
    }

    public set targetState(targetState: number) {
        this._targetState.push(targetState)
    }

    public get currentState(): number {
        return this._currentState
    }
}
