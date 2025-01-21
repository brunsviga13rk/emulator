import { Group, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from '../sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'
import { OperationHandleEventType } from '../handles/operationHandle'

export class CounterSprocket extends SprocketWheel {
    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'counter_sprocket_wheel', 8, 0, 2 * Math.PI, 10)
    }

    public registerActionEvents() {
        this.registerDeleteHandleEvents()
    }

    private registerDeleteHandleEvents() {
        const emitter = Brunsviga13rk.getInstance().operation_crank.getEmitter()

        emitter.subscribe(
            OperationHandleEventType.Add,
            new EventHandler(() => {
                this.add([1])
            })
        )
    }
}
