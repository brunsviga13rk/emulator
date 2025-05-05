import { Group, Object3D, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from './sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'

import { HandleEventType } from '../handles/handle'
import { OperationHandleEventType } from '../handles/operationHandle'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from '../animation'

export class ResultSprocket extends SprocketWheel {
    private resetIndicator: Object3D<Object3DEventMap>
    private resetIndicatorAnimation: AnimationScalarState

    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'result_sprocket_wheel', 13, 0, Math.PI * 2, 10)

        this.resetIndicator = scene.getObjectByName('result_reset_indicator')!
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

        Brunsviga13rk.getInstance()
            .result_reset_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => {
                    this.reset()
                })
            )
    }
}
