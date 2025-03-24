import { Group, Object3D, Object3DEventMap } from 'three'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter } from '../events'

/**
 * Events emitted by a knob.
 */
export enum KnobEventType {
    /**
     * Knob is pulled away from the resting position.
     */
    Extrude,
    /**
     * Knob is pulled away from the resting position to the maximum extend.
     */
    Extruded,
    /**
     * Knob is pushed towards the resting position.
     */
    Reset,
    /**
     * Knob arrived in the resting position.
     */
    AtRest,
}

// Event content.
// Set to be undefined as there is nothing else to store.

export type KnobExtrudeEvent = undefined
export type KnobExtrudedEvent = undefined
export type KnobResetEvent = undefined
export type KnobAtRestEvent = undefined

export type KnobEvent =
    | KnobExtrudeEvent
    | KnobExtrudedEvent
    | KnobAtRestEvent
    | KnobResetEvent

/**
 * A knob usually found at the end of crank. Can be pulled out of its resting
 * position and pushed back. This appens at in a linear axial motion along
 * the objects local Z-axis.
 */
export class Knob
    implements ActionHandler, EventBroker<KnobEventType, KnobEvent, Knob>
{
    protected mesh: Object3D<Object3DEventMap>
    protected animationState: AnimationScalarState
    protected emitter: EventEmitter<KnobEventType, KnobEvent, Knob>
    /**
     * Stores the current state of the knob.
     * @default undefined
     */
    protected extruded: KnobEventType | undefined = undefined
    /**
     * State tracking whether or not the maximum limit of the knobs extrusion
     * is met. Primarily serves the purpose of emitting AtRest and Extruded
     * events only once per toggled motion.
     */
    protected limitReached: boolean

    public constructor(scene: Group<Object3DEventMap>) {
        this.limitReached = true
        this.extruded = undefined
        this.mesh = scene.getObjectByName('crank_handle')!
        this.animationState = new AnimationScalarState(
            0.639462,
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
            // Determine finish state when the animation is done.
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
        this.mesh.rotation.z = angle
    }

    /**
     * Extrude the knob away from the resting position.
     * Emits `KnobEventType.Extrude`.
     */
    public extrude() {
        this.extruded = KnobEventType.Extrude
        this.limitReached = false
        this.animationState.targetState = 0.669171
        this.emitter.emit(KnobEventType.Extrude, undefined)
    }

    /**
     * Move the knob towards the resting position.
     * Emits `KnobEventType.Reset`
     */
    public reset() {
        this.extruded = KnobEventType.Reset
        this.limitReached = false
        this.animationState.targetState = 0.639462
        this.emitter.emit(KnobEventType.Reset, undefined)
    }
}
