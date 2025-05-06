import { Group, Object3D, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from './sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'
import {
    InputWheelDecrementEvent,
    InputWheelEventType,
    InputWheelIncrementEvent,
} from './inputWheel'
import { HandleEventType } from '../handles/handle'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from '../animation'

/**
 * Maximum value the input sprocket supports.
 */
export const MAX_INPUT_SPROCKET_VALUE = 9999999999

export class InputSprocket extends SprocketWheel {
    private resetIndicator: Object3D<Object3DEventMap>
    private resetIndicatorAnimation: AnimationScalarState

    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'input_sprocket_wheel', 10, 0, 3.925, 10)

        this.resetIndicator = scene.getObjectByName('input_reset_indicator')!
        this.resetIndicatorAnimation = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.25
        )
        this.resetIndicatorAnimation.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.resetIndicator.rotation.y += delta as number
            })
        )
    }

    public reset() {
        this.resetIndicatorAnimation.targetState = -Math.abs(
            Math.PI * 2.0 - this.resetIndicatorAnimation.currentState
        )

        super.reset()
    }

    public perform(delta: number): void {
        this.resetIndicatorAnimation.advance(delta)
        super.perform(delta)
    }

    public registerActionEvents() {
        this.registerInputSelectorEvents()
        this.registerDeleteHandleEvents()
    }

    private registerDeleteHandleEvents() {
        const emitter = Brunsviga13rk.getInstance().delete_handle.getEmitter()

        emitter.subscribe(
            HandleEventType.PullDown,
            new EventHandler(() => {
                this.reset()
            })
        )

        Brunsviga13rk.getInstance()
            .delete_input_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => {
                    this.reset()
                })
            )
    }

    private registerInputSelectorEvents() {
        const emitter =
            Brunsviga13rk.getInstance().selector_sprocket.getEmitter()

        emitter.subscribe(
            InputWheelEventType.Increment,
            new EventHandler((event: InputWheelIncrementEvent) => {
                this.rotate(event.digit, 1)
            })
        )

        emitter.subscribe(
            InputWheelEventType.Decrement,
            new EventHandler((event: InputWheelDecrementEvent) => {
                this.rotate(event.digit, -1)
            })
        )
    }
}
