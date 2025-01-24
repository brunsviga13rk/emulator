import { Group, Object3D, Object3DEventMap } from 'three'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter } from '../events'

export enum KnobEventType {
    Extrude,
    Extruded,
    Reset,
    AtRest,
}

export type KnobExtrudeEvent = undefined
export type KnobExtrudedEvent = undefined
export type KnobResetEvent = undefined
export type KnobAtRestEvent = undefined

export type KnobEvent =
    | KnobExtrudeEvent
    | KnobExtrudedEvent
    | KnobAtRestEvent
    | KnobResetEvent

export class Knob
    implements ActionHandler, EventBroker<KnobEventType, KnobEvent, Knob>
{
    protected mesh: Object3D<Object3DEventMap>
    protected animationState: AnimationScalarState
    protected emitter: EventEmitter<KnobEventType, KnobEvent, Knob>
    protected extruded: KnobEventType | undefined = undefined
    protected limitReached: boolean

    public constructor(scene: Group<Object3DEventMap>) {
        this.limitReached = true
        this.extruded = undefined
        this.mesh = scene.getObjectByName('crank_handle')!
        this.animationState = new AnimationScalarState(
            1.83969,
            CubicEaseInOutInterpolation,
            0.15
        )
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getEmitter(): EventEmitter<KnobEventType, undefined, Knob> {
        return this.emitter
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.mesh.position.z = this.animationState.currentState

        if (this.animationState.isAnimationDone() && !this.limitReached) {
            if (this.extruded == KnobEventType.Extrude) {
                this.extruded = KnobEventType.Extruded
                this.emitter.emit(KnobEventType.Extruded, undefined)
            } else {
                this.extruded = KnobEventType.AtRest
                this.emitter.emit(KnobEventType.AtRest, undefined)
            }

            this.limitReached = true
        }
    }

    public isExtruded(): boolean {
        return this.extruded == KnobEventType.Extruded
    }

    public isAnimationDone(): boolean {
        return this.animationState.isAnimationDone()
    }

    public rotate(angle: number) {
        this.mesh.rotation.y = angle
    }

    public extrude() {
        this.extruded = KnobEventType.Extrude
        this.limitReached = false
        this.animationState.targetState = 2.0
        this.emitter.emit(KnobEventType.Extrude, undefined)
    }

    public reset() {
        this.extruded = KnobEventType.Reset
        this.limitReached = false
        this.animationState.targetState = 1.83969
        this.emitter.emit(KnobEventType.Reset, undefined)
    }
}
