import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { Selectable } from '../selectable'
import { EventBroker, EventEmitter, EventHandler } from '../events'

/**
 * Angular velocity multiplier.
 */
const ANGULAR_VELOCITY = 1e-2

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
    /**
     * Target euler rotation angles for each wheel.
     */
    protected targetRotation: number
    /**
     * Tracks the rotation of each wheel during animation.
     */
    protected currentRotation: number
    /**
     * Range in which fixed angle increments occur on the sprocket wheel.
     * Note that the minimum must be smaller than the maximum angle.
     */
    protected angleLimits: [minAngle: number, maxAngle: number]
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
        this.angleLimits = [minAngle, maxAngle]
        this.targetRotation = minAngle
        this.currentRotation = minAngle
        this.mesh = scene.getObjectByName(name)!
        this.mesh.rotation.y += minAngle

        this.emitter.setActor(this)
        this.emitter.subscribe(
            HandleEventType.PullDownDone,
            new EventHandler(() => {
                this.pushUp()
            })
        )
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
        const [minAngle, maxAngle] = this.angleLimits
        // Prevent handle from being spammed.
        if (Math.abs(this.currentRotation - minAngle) > 1e-3) return

        this.targetRotation = maxAngle
        this.limitReached = false

        this.emitter.emit(HandleEventType.PullDown, undefined)
    }

    public pushUp() {
        const [minAngle, maxAngle] = this.angleLimits
        // Prevent handle from being spammed.
        if (Math.abs(this.currentRotation - maxAngle) > 1e-3) return

        this.targetRotation = minAngle
        this.limitReached = true

        this.emitter.emit(HandleEventType.PushUp, undefined)
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return [this.mesh]
    }

    perform(delta: number): void {
        // Time scale factor derived from frame time.
        const factor = Math.min(1, ANGULAR_VELOCITY * delta)
        const angle = (this.targetRotation - this.currentRotation) * factor

        this.mesh.rotation.y += angle
        this.currentRotation += angle

        const [minAngle, maxAngle] = this.angleLimits
        if (
            Math.abs(this.currentRotation - minAngle) < 1e-3 &&
            this.limitReached
        ) {
            this.emitter.emit(HandleEventType.PushUpDone, undefined)
            this.limitReached = false
        }
        if (
            Math.abs(this.currentRotation - maxAngle) < 1e-3 &&
            !this.limitReached
        ) {
            this.emitter.emit(HandleEventType.PullDownDone, undefined)
            this.limitReached = true
        }
    }
}
