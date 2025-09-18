import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { InputAction, Selectable, UserAction } from '../selectable'
import { EventBroker, EventEmitter, EventHandler } from '../events'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'
import { DetailPanel } from '../../render/Details'

/**
 * Types of events emitted by a handle.
 */
export enum HandleEventType {
    /**
     * Emitted when the handle is being pushed up initially.
     */
    PushUp,
    /**
     * Emitted when the handle is being pulled down initially.
     */
    PullDown,
    /**
     * Emitted when the push up operation has finished.
     */
    PushUpDone,
    /**
     * Emitted when the pull down operation has finished.
     */
    PullDownDone,
}

// Event content.
// Set to be undefined as there is nothing else to store.

export type HandlePushUpEvent = undefined
export type HandlePullDownEvent = undefined
export type HandlePushUpDoneEvent = undefined
export type HandlePullDownDoneEvent = undefined

export type HandleEvent =
    | HandlePushUpEvent
    | HandlePullDownEvent
    | HandlePushUpDoneEvent
    | HandlePullDownDoneEvent

/**
 * A lever that has two operations:
 * - Push up
 * - Pull down
 *
 * Either operation is defined as a back and forth rotation around the object
 * local Y-axis by a specific amount.
 */
export class Handle
    implements
        ActionHandler,
        Selectable,
        EventBroker<HandleEventType, HandleEvent, Handle>
{
    /**
     * Mesh of the lever used for transformation.
     */
    protected mesh: Object3D<Object3DEventMap>
    protected _animationState: AnimationScalarState
    /**
     * Range in which fixed angle increments occur on the sprocket wheel.
     * Note that the minimum must be smaller than the maximum angle.
     */
    private _angleLimits: [minAngle: number, maxAngle: number]
    /**
     * State tracking whether or not the maximum limit of the levers rotation
     * is met. Primarily servers the purpose to diffrentiate between pull down
     * and push up operation during animation.
     */
    protected limitReached: boolean
    protected emitter: EventEmitter<HandleEventType, HandleEvent, Handle>

    public constructor(
        scene: Group<Object3DEventMap>,
        name: string,
        minAngle: number,
        maxAngle: number
    ) {
        this.limitReached = false
        this.emitter = new EventEmitter()
        this._angleLimits = [minAngle, maxAngle]
        this.mesh = scene.getObjectByName(name)!
        this.mesh.rotation.z += minAngle
        this._animationState = new AnimationScalarState(
            minAngle,
            CubicEaseInOutInterpolation,
            0.5
        )

        this.emitter.setActor(this)
        // Automatically push the lever back up once its been pulled down
        // completely.
        this.emitter.subscribe(
            HandleEventType.PullDownDone,
            new EventHandler(() => {
                this.pushUp()
            })
        )
    }

    getDetailPanel(): DetailPanel {
        throw new Error('not Implemented')
    }

    getAvailableUserActions(): UserAction[] {
        return [[InputAction.LeftClick, 'Pull handle']]
    }

    public get animationState(): AnimationScalarState {
        return this._animationState
    }

    getEmitter(): EventEmitter<HandleEventType, undefined, Handle> {
        return this.emitter
    }

    onClick(event: MouseEvent): void {
        if (event.button == 0) {
            this.pullDown()
        }
    }

    /**
     * Pull the lever down. Emitts `HandleEventType.PullDown`.
     */
    public pullDown() {
        const [, maxAngle] = this._angleLimits

        this.animationState.targetState = maxAngle
        this.limitReached = false

        this.emitter.emit(HandleEventType.PullDown, undefined)
    }

    /**
     * Push the lever up. Emitts `HandleEventType.PushUp`.
     */
    public pushUp() {
        const [minAngle] = this._angleLimits

        this.animationState.targetState = minAngle
        this.limitReached = true

        this.emitter.emit(HandleEventType.PushUp, undefined)
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return [this.mesh]
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.mesh.rotation.z = this.animationState.currentState

        const [minAngle, maxAngle] = this._angleLimits
        // Detect push up done state and emit event.
        if (
            Math.abs(this.animationState.currentState - minAngle) < 1e-3 &&
            this.limitReached
        ) {
            this.emitter.emit(HandleEventType.PushUpDone, undefined)
            this.limitReached = false
        }
        // Detect pull down done state and emit event.
        if (
            Math.abs(this.animationState.currentState - maxAngle) < 1e-3 &&
            !this.limitReached
        ) {
            this.emitter.emit(HandleEventType.PullDownDone, undefined)
            this.limitReached = true
        }
    }

    public get angleLimits(): [minAngle: number, maxAngle: number] {
        return this._angleLimits
    }
}
