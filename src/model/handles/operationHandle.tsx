import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter } from '../events'
import { Selectable } from '../selectable'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'

export enum OperationHandleEventType {
    Add,
    Subtract,
    AddEnded,
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
    protected mesh: Object3D<Object3DEventMap>
    protected animationState: AnimationScalarState
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
            0.25
        )
        this.mesh = scene.getObjectByName('crank')!
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
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

    public add() {
        // Prevent crank from bein continouuisly accelerating.
        if (this.currentOperation != undefined) return

        this.animationState.targetState =
            this.animationState.getLatestTarget() + Math.PI * 2

        this.emitter.emit(OperationHandleEventType.Add, undefined)
        this.currentOperation = OperationHandleEventType.Add
    }

    public subtract() {
        // Prevent crank from bein continouuisly accelerating.
        if (this.currentOperation != undefined) return

        this.animationState.targetState =
            this.animationState.getLatestTarget() - Math.PI * 2
        this.emitter.emit(OperationHandleEventType.Subtract, undefined)
        this.currentOperation = OperationHandleEventType.Subtract
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.mesh.rotation.y = this.animationState.currentState

        if (!this.animationState.isAnimationDone()) return

        switch (this.currentOperation) {
            case OperationHandleEventType.Add:
                this.emitter.emit(OperationHandleEventType.AddEnded, undefined)
                break
            case OperationHandleEventType.Subtract:
                this.emitter.emit(
                    OperationHandleEventType.SubtractEnded,
                    undefined
                )
                break
        }

        this.currentOperation = undefined
    }

    getEmitter(): EventEmitter<
        OperationHandleEventType,
        undefined,
        OperationHandle
    > {
        return this.emitter
    }
}
