import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter } from '../events'
import { Selectable } from '../selectable'

/**
 * Angular velocity multiplier.
 */
const ANGULAR_VELOCITY = 5e-3

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
    /**
     * Target euler rotation angles for each wheel.
     */
    protected targetRotation: number
    /**
     * Tracks the rotation of each wheel during animation.
     */
    protected currentRotation: number
    protected currentOperation: OperationHandleEventType | undefined = undefined
    private emitter: EventEmitter<
        OperationHandleEventType,
        OperationHandleEvent,
        OperationHandle
    >

    public constructor(scene: Group<Object3DEventMap>) {
        this.targetRotation = 0
        this.currentRotation = 0
        this.mesh = scene.getObjectByName('crank')!
        this.mesh.rotation.y += 0
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    onClick(event: MouseEvent, object: Object3D<Object3DEventMap>): void {
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

        this.currentRotation += Math.PI * 2
        this.emitter.emit(OperationHandleEventType.Add, undefined)
        this.currentOperation = OperationHandleEventType.Add
    }

    public subtract() {
        // Prevent crank from bein continouuisly accelerating.
        if (this.currentOperation != undefined) return

        this.currentRotation -= Math.PI * 2
        this.emitter.emit(OperationHandleEventType.Subtract, undefined)
        this.currentOperation = OperationHandleEventType.Subtract
    }

    perform(delta: number): void {
        // Time scale factor derived from frame time.
        const factor = Math.min(1, ANGULAR_VELOCITY * delta)
        const angle = (this.targetRotation - this.currentRotation) * factor

        this.mesh.rotation.y += angle
        this.currentRotation += angle

        if (Math.abs(this.currentRotation - this.targetRotation) < 1e-2) {
            if (this.currentOperation == OperationHandleEventType.Add) {
                this.emitter.emit(OperationHandleEventType.AddEnded, undefined)
                this.currentOperation = undefined
            }

            if (this.currentOperation == OperationHandleEventType.Subtract) {
                this.emitter.emit(
                    OperationHandleEventType.SubtractEnded,
                    undefined
                )
                this.currentOperation = undefined
            }
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
