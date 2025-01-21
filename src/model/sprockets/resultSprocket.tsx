import { Group, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from '../sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'

import { HandleEventType } from '../handles/handle'
import { OperationHandleEventType } from '../handles/operationHandle'

export class ResultSprocket extends SprocketWheel {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'result_sprocket_wheel', 13, 0, Math.PI * 2, 10)
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
    }

    private registerInputSelectorEvents() {
        const emitter = Brunsviga13rk.getInstance().operation_crank.getEmitter()
        const operand =
            Brunsviga13rk.getInstance().input_sprocket.getDecimalDigits()

        emitter.subscribe(
            OperationHandleEventType.Add,
            new EventHandler(() => {
                this.add(operand)
            })
        )

        emitter.subscribe(
            OperationHandleEventType.Subtract,
            new EventHandler(() => {
                this.subtract(operand)
            })
        )
    }
}
