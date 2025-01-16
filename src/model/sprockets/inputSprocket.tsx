import { Group, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from '../sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'
import {
    InputWheelDecrementEvent,
    InputWheelEventType,
    InputWheelIncrementEvent,
} from '../inputWheel'
export class InputSprocket extends SprocketWheel {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'input_sprocket_wheel', 10, 0, 5.125, 10)
    }

    public registerActionEvents() {
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
