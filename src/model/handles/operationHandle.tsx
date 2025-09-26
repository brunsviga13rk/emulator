import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter, EventHandler } from '../events'
import { InputAction, Selectable, UserAction } from '../selectable'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'
import { Knob, KnobEventType } from './knob'
import { Brunsviga13rk } from '../brunsviga13rk'

/**
 * Events emitted by the operation crank.
 */
export enum OperationHandleEventType {
    /**
     * When addition is performed by clockwise rotation.
     */
    Add,
    /**
     * When subtraction is performed by counter-clockwise rotation.
     */
    Subtract,
    /**
     * Emitted when addition animation has finished.
     */
    AddEnded,
    /**
     * Emitted when subtraction animation has finished.
     */
    SubtractEnded,
}

export type OperationHandleAddEvent = undefined
export type OperationHandleSubtractEvent = undefined
export type OperationHandleAddEndedEvent = undefined
export type OperationHandleSubtractEndedEvent = undefined

export type OperationHandleEvent =
    | OperationHandleAddEvent
    | OperationHandleSubtractEvent
    | OperationHandleAddEndedEvent
    | OperationHandleSubtractEndedEvent

/**
 * Crank used for addition and subtraction operation.
 * Clockwise rotation of the crank performs addition, a counter clockwise
 * roation results in subtraction.
 * The animation of the crank includes extruding and reseting the knob used to
 * lock the crank in position which makes the animation non-linear unlike
 * other animation.
 */
export class OperationHandle
    implements
        ActionHandler,
        Selectable,
        EventBroker<
            OperationHandleEventType,
            OperationHandleEvent,
            OperationHandle
        >
{
    /**
     * Knob used to lock the crank during reset and configuration.
     */
    protected knob: Knob
    protected mesh: Object3D<Object3DEventMap>
    protected animationState: AnimationScalarState
    /**
     * Track operational state of animation.
     */
    protected currentOperation: OperationHandleEventType | undefined = undefined
    private emitter: EventEmitter<
        OperationHandleEventType,
        OperationHandleEvent,
        OperationHandle
    >

    public constructor(scene: Group<Object3DEventMap>) {
        this.animationState = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.5
        )
        this.knob = new Knob(scene)
        this.mesh = scene.getObjectByName('crank')!
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getAvailableUserActions(): UserAction[] {
        return [
            [InputAction.LeftClick, 'Add'],
            [InputAction.RightClick, 'Subtract'],
        ]
    }

    public registerEventSubscribtions() {
        const knobEmitter = this.knob.getEmitter()

        knobEmitter.subscribe(
            KnobEventType.Extruded,
            new EventHandler(() => {
                const sign =
                    this.currentOperation == OperationHandleEventType.Add
                        ? -1.0
                        : 1.0

                Brunsviga13rk.getInstance().selector_sprocket.rotateAll(
                    sign * -10
                )

                this.animationState.targetState =
                    this.animationState.getLatestTarget() + Math.PI * 2 * sign
            })
        )

        knobEmitter.subscribe(
            KnobEventType.AtRest,
            new EventHandler(() => {
                switch (this.currentOperation) {
                    case OperationHandleEventType.Add:
                        this.emitter.emit(
                            OperationHandleEventType.AddEnded,
                            undefined
                        )
                        break
                    case OperationHandleEventType.Subtract:
                        this.emitter.emit(
                            OperationHandleEventType.SubtractEnded,
                            undefined
                        )
                        break
                }

                this.currentOperation = undefined
            })
        )
    }

    onClick(event: MouseEvent): void {
        switch (event.button) {
            // Primary button has been pressed.
            case 0:
                this.add()
                break
            // Secondary button has been pressed.
            case 2:
                this.subtract()
                break
        }
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return [this.mesh]
    }

    /**
     * Perform addition. Emits `OperationHandleEventType.Add` and cause
     * `OperationHandleEventType.AddEnded` when the animation finished.
     *
     */
    public add() {
        // add -> knob extrude -> rotate -> knob intrude -> done

        // Prevent crank from bein continouuisly accelerating.
        if (this.currentOperation != undefined) return

        this.knob.extrude()

        this.emitter.emit(OperationHandleEventType.Add, undefined)
        this.currentOperation = OperationHandleEventType.Add
    }

    /**
     * Perform subtraction. Emits `OperationHandleEventType.Subtract` and cause
     * `OperationHandleEventType.SubtractEnded` when the animation finished.
     *
     */
    public subtract() {
        // Prevent crank from bein continouuisly accelerating.
        if (this.currentOperation != undefined) return

        this.knob.extrude()

        this.emitter.emit(OperationHandleEventType.Subtract, undefined)
        this.currentOperation = OperationHandleEventType.Subtract
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.mesh.rotation.z = this.animationState.currentState

        this.knob.perform(delta)
        this.knob.rotate(this.animationState.currentState)

        if (this.knob.isExtruded() && this.animationState.isAnimationDone()) {
            this.knob.reset()
        }
    }

    getEmitter(): EventEmitter<
        OperationHandleEventType,
        undefined,
        OperationHandle
    > {
        return this.emitter
    }
}
