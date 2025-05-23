import { Group, Object3D, Object3DEventMap } from 'three'
import { InputAction, Selectable, UserAction } from '../selectable'
import { SprocketWheel } from './sprocketWheel'
import { EventBroker, EventEmitter, EventHandler } from '../events'
import { ActionHandler } from '../../actionHandler'
import { Brunsviga13rk } from '../brunsviga13rk'
import { HandleEventType } from '../handles/handle'
import { AnimationScalarState } from '../animation'

const INPUT_WHEEL_DIGITS = 10
const INPUT_WHEEL_MESH_NAME = 'selctor_sprocket_wheel'

export enum InputWheelEventType {
    Increment,
    Decrement,
}

export type InputWheelIncrementEvent = { digit: number }
export type InputWheelDecrementEvent = { digit: number }

export type InputWheelEvent =
    | InputWheelIncrementEvent
    | InputWheelDecrementEvent

export class InputWheel
    implements
        ActionHandler,
        Selectable,
        EventBroker<InputWheelEventType, InputWheelEvent, InputWheel>
{
    private wheel: SprocketWheel
    private emitter: EventEmitter<
        InputWheelEventType,
        InputWheelEvent,
        InputWheel
    >

    public constructor(scene: Group<Object3DEventMap>) {
        this.wheel = new SprocketWheel(
            scene,
            INPUT_WHEEL_MESH_NAME,
            INPUT_WHEEL_DIGITS,
            -0.05,
            1.55,
            10
        )

        // Apply inital rotation to fix global animation counter state.
        // Initialize rotation of wheels.
        // A full rotation around the "dead-zone" is required as these wheels
        // operate in reverse direction as the display sprocket wheels.
        for (let i = 1; i <= INPUT_WHEEL_DIGITS; i++) {
            this.wheel.setDigit(i, 9)

            while (AnimationScalarState.isAnyAnimationOngoing()) {
                this.wheel.perform(1.0)
            }
        }

        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getAvailableUserActions(): UserAction[] {
        return [
            [InputAction.LeftClick, 'Increment input sprocket wheel'],
            [InputAction.RightClick, 'Decrement input sprocket wheel'],
        ]
    }

    public registerActionEvents() {
        this.registerDeleteHandleEvents()
    }

    private registerDeleteHandleEvents() {
        const emitter = Brunsviga13rk.getInstance().delete_handle.getEmitter()

        emitter.subscribe(
            HandleEventType.PullDown,
            new EventHandler(() => {
                for (let i = 1; i <= this.wheel.getDigits(); i++) {
                    this.wheel.setDigit(i, 9)
                }
            })
        )

        Brunsviga13rk.getInstance()
            .delete_input_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => {
                    for (let i = 1; i <= this.wheel.getDigits(); i++) {
                        this.wheel.setDigit(i, 9)
                    }
                })
            )
    }

    public setDigit(digit: number, digitValue: number) {
        this.wheel.setDigit(digit, 9 - digitValue)
    }

    perform(delta: number): void {
        this.wheel.perform(delta)
    }

    getEmitter(): EventEmitter<
        InputWheelEventType,
        InputWheelEvent,
        InputWheel
    > {
        return this.emitter
    }

    onClick(_event: MouseEvent, object: Object3D<Object3DEventMap>): void {
        for (let i = 0; i < this.wheel.getDigits(); i++) {
            if (this.wheel.getWheels()[i].id == object.id) {
                const current_digit = this.wheel.getDecimalDigits()[i]

                switch (_event.button) {
                    // Primary button has been pressed.
                    case 0:
                        if (current_digit > 0) {
                            this.wheel.rotate(i + 1, -1)
                            this.emitter.emit(InputWheelEventType.Increment, {
                                digit: i + 1,
                            })
                        }
                        break
                    // Secondary button has been pressed.
                    case 2:
                        if (current_digit < 9) {
                            this.wheel.rotate(i + 1, 1)
                            this.emitter.emit(InputWheelEventType.Decrement, {
                                digit: i + 1,
                            })
                        }
                        break
                }

                break
            }
        }
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return this.wheel.getWheels()
    }
}
