import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { Selectable } from '../selectable'
import { EventBroker, EventEmitter, EventHandler } from '../events'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'

export enum HandleEventType {
    PushUp,
    PullDown,
    PushUpDone,
    PullDownDone,
}

export type HandlePushUpEvent = undefined
export type HandlePullDownEvent = undefined
export type HandlePushUpDoneEvent = undefined
export type HandlePullDownDoneEvent = undefined

export type HandleEvent =
    | HandlePushUpEvent
    | HandlePullDownEvent
    | HandlePushUpDoneEvent
    | HandlePullDownDoneEvent

export class Handle
    implements
        ActionHandler,
        Selectable,
        EventBroker<HandleEventType, HandleEvent, Handle>
{
    protected mesh: Object3D<Object3DEventMap>
    protected _animationState: AnimationScalarState
    /**
     * Range in which fixed angle increments occur on the sprocket wheel.
     * Note that the minimum must be smaller than the maximum angle.
     */
    private _angleLimits: [minAngle: number, maxAngle: number]
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
        this.mesh.rotation.y += minAngle
        this._animationState = new AnimationScalarState(
            minAngle,
            CubicEaseInOutInterpolation,
            0.5
        )

        this.emitter.setActor(this)
        this.emitter.subscribe(
            HandleEventType.PullDownDone,
            new EventHandler(() => {
                this.pushUp()
            })
        )
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

    public pullDown() {
        const [, maxAngle] = this._angleLimits

        this.animationState.targetState = maxAngle
        this.limitReached = false

        this.emitter.emit(HandleEventType.PullDown, undefined)
    }

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
        this.mesh.rotation.y = this.animationState.currentState

        const [minAngle, maxAngle] = this._angleLimits
        if (
            Math.abs(this.animationState.currentState - minAngle) < 1e-3 &&
            this.limitReached
        ) {
            this.emitter.emit(HandleEventType.PushUpDone, undefined)
            this.limitReached = false
        }
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
