import { Conditional, EventBroker, EventEmitter } from './events'

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
 * Type of events a scalar animation can create.
 */
export enum AnimationScalarStateEventType {
    StatePassed,
}

/**
 * Event triggered when the animation state passed by a specific value.
 */
export type AnimationScalarStatePassedEvent = number

export type AnimationScalarStateEvent = AnimationScalarStatePassedEvent

/**
 * Condition verfifying that the passed value is the correct one for a certain event.
 */
export class AnimationScalarStateCondition implements Conditional {
    /**
     * Previous state before advancing animation.
     * Only to be set by cause event.
     * @default undefined
     */
    private lastState: number | undefined
    /**
     * Next state after advancing animation.
     * Only to be set by cause event.
     * @default undefined
     */
    private nextState: number | undefined
    /**
     * State at which to trigger event.
     */
    private _state: number

    public constructor(
        state: number,
        lastState: number | undefined = undefined,
        nextState: number | undefined = undefined
    ) {
        this.lastState = lastState
        this.nextState = nextState
        this._state = state
    }

    compare(
        this: AnimationScalarStateCondition,
        other: AnimationScalarStateCondition
    ): boolean {
        if (other.lastState == undefined || other.nextState == undefined)
            throw new Error('cause condition must specify animation state')

        // The value triggering this event must reside numerically between
        // the previous and next state of the cause event.
        //
        // This will trigger the event:
        //
        // ```      state
        //           |
        //    |------+-------|
        //  previous        next
        // ```
        //
        // This won't trigger the event:
        //
        // ```                     state
        //                          |
        //    |--------------|      +
        //  previous        next
        // ```
        return (
            (other.lastState < this.state && this.state < other.nextState) ||
            (other.nextState < this.state && this.state < other.lastState)
        )
    }

    protected get state(): number {
        return this._state
    }
}

/**
 * Manages the state of a continouus scalar animation state that can reach "target" values
 * in a fixed amount of time. Additionally provides the possibility to modify
 * the curve at which the animation takes place. Default is linear.
 */
export class AnimationScalarState
    implements
        EventBroker<
            AnimationScalarStateEventType,
            AnimationScalarStateEvent,
            AnimationScalarState,
            AnimationScalarStateCondition
        >
{
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
    private _interpolation: InterpolationMethod
    /**
     * Determines whether or not the annimation is halted.
     */
    private halted: boolean
    /**
     * Number of seconds the animations take to reach each target.
     */
    private timeScale: number
    /**
     * Event emitter used to cause actions on specific states of the animation.
     */
    private emitter: EventEmitter<
        AnimationScalarStateEventType,
        AnimationScalarStateEvent,
        AnimationScalarState,
        AnimationScalarStateCondition
    >

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
        this._interpolation = interpolation
        this.advanceFactor = 0.0
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getEmitter(): EventEmitter<
        AnimationScalarStateEventType,
        number,
        AnimationScalarState,
        AnimationScalarStateCondition
    > {
        return this.emitter
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

        const lastState = this._currentState

        if (this.advanceFactor >= 1) {
            // End of animation reached.
            this._currentState = target
            this.zeroState = target
            // Remove first element which is the reached target.
            this._targetState.splice(0, 1)
            this.advanceFactor = 0.0
        } else {
            this._currentState = this._interpolation(
                this.zeroState,
                target,
                this.advanceFactor
            )
        }

        this.emitter.emit(
            AnimationScalarStateEventType.StatePassed,
            this._currentState,
            new AnimationScalarStateCondition(0, lastState, this._currentState)
        )
    }

    public get interpolation(): InterpolationMethod {
        return this._interpolation
    }

    public set interpolation(value: InterpolationMethod) {
        this._interpolation = value
    }

    /**
     *
     * @returns Wether or not any targets remain to be reached.
     */
    public isAnimationDone(): boolean {
        return this._targetState.length < 1
    }

    /**
     * Stop advancing the animation. Any proceeding call to advance()
     * won't alter the state until continue() is called.
     */
    public halt() {
        this.halted = true
    }

    /**
     * Resume advancing the animation. Any proceeding call to advance()
     * will alter the state until halt() is called.
     */
    public continue() {
        this.halted = false
    }

    /**
     * Get the most recenty requested target.
     * @returns The last registered target value.
     */
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
