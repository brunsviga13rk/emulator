import { Group, Object3D, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import { SprocketWheel } from './sprocketWheel'
import { Brunsviga13rk } from '../brunsviga13rk'
import { OperationHandleEventType } from '../handles/operationHandle'
import { HandleEventType } from '../handles/handle'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from '../animation'
import { SledEventType } from '../sled'

export class CounterSprocket extends SprocketWheel {
    protected counterIndicator: Object3D<Object3DEventMap>
    private counterIndicatorAnimation: AnimationScalarState
    private counterOffset: number

    private resetIndicator: Object3D<Object3DEventMap>
    private resetIndicatorAnimation: AnimationScalarState

    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'counter_sprocket_wheel', 8, 0, 2 * Math.PI, 10)
        this.counterOffset = 0
        this.counterIndicator = scene.getObjectByName(
            'counter_shift_indicator'
        )!
        this.counterIndicatorAnimation = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.1
        )
        this.counterIndicatorAnimation.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.counterIndicator.position.z += delta as number
            })
        )

        this.resetIndicator = scene.getObjectByName('counter_delete_indicator')!
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
        this.counterIndicatorAnimation.advance(delta)
        super.perform(delta)
    }

    public registerActionEvents() {
        this.registerDeleteHandleEvents()
        this.registerIndicatorEvents()
    }

    private registerIndicatorEvents() {
        const emitter = Brunsviga13rk.getInstance().sled.getEmitter()

        emitter.subscribe(
            SledEventType.ShiftLeft,
            new EventHandler(() => {
                this.counterOffset--
                this.counterIndicatorAnimation.targetState =
                    this.counterOffset * 0.00925
            })
        )

        emitter.subscribe(
            SledEventType.ShiftRight,
            new EventHandler(() => {
                this.counterOffset++
                this.counterIndicatorAnimation.targetState =
                    this.counterOffset * 0.00925
            })
        )
    }

    private registerDeleteHandleEvents() {
        const emitter = Brunsviga13rk.getInstance().operation_crank.getEmitter()

        emitter.subscribe(
            OperationHandleEventType.Add,
            new EventHandler(() => {
                this.add([1])
            })
        )

        emitter.subscribe(
            OperationHandleEventType.Subtract,
            new EventHandler(() => {
                this.subtract([1])
            })
        )

        Brunsviga13rk.getInstance()
            .counter_reset_handle.getEmitter()
            .subscribe(
                HandleEventType.PullDown,
                new EventHandler(() => {
                    this.reset()
                })
            )
    }
}
