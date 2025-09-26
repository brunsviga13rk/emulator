import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../actionHandler'
import { InputAction, Selectable, UserAction } from './selectable'
import {
    AnimationScalarConditon,
    AnimationScalarState,
    AnimationScalarStateEventType,
    AnimationScalarStatePassedCondition,
    CubicEaseInOutInterpolation,
} from './animation'
import { EventBroker, EventEmitter, EventHandler, Tautology } from './events'
import { Brunsviga13rk } from './brunsviga13rk'
import { DetailPanel } from '../render/Details'

export enum Direction {
    Left = -1.0,
    Right = 1.0,
}

export enum SledEventType {
    ShiftLeft,
    ShiftRight,
}

export type SledShiftLeftEvent = { digit: number }
export type SledShiftRightEvent = { digit: number }

export type InputWheelEvent = SledShiftLeftEvent | SledShiftRightEvent

export class Sled
    implements
        ActionHandler,
        Selectable,
        EventBroker<SledEventType, InputWheelEvent, Sled>
{
    protected handle: Object3D<Object3DEventMap>
    protected appendages: Object3D<Object3DEventMap>[]
    protected handleAnimationState: AnimationScalarState
    protected animationState: AnimationScalarState
    protected offset: number
    protected emitter: EventEmitter<SledEventType, InputWheelEvent, Sled>

    public constructor(scene: Group<Object3DEventMap>) {
        this.handle = scene.getObjectByName('sledge_handle')!
        this.appendages = [
            this.handle,
            scene.getObjectByName('sled')!,
            scene.getObjectByName('deletion')!,
            scene.getObjectByName('result_deletionn_lever')!,
            scene.getObjectByName('result_reset_indicator')!,
        ]
        this.appendages = this.appendages.concat(
            getCommataMeshes(scene, 'result_commata_', 3)
        )
        this.appendages = this.appendages.concat(
            getSprocketWheelMeshes(scene, 'result_sprocket_wheel', 13)
        )

        this.handleAnimationState = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.15
        )
        this.handleAnimationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StatePassed,
            new EventHandler(
                () => {
                    this.handleAnimationState.targetState = 0
                },
                new AnimationScalarStatePassedCondition(
                    0.2
                ) as AnimationScalarConditon
            )
        )
        this.handleAnimationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StatePassed,
            new EventHandler(
                () => {
                    this.handleAnimationState.targetState = 0
                },
                new AnimationScalarStatePassedCondition(
                    -0.2
                ) as AnimationScalarConditon
            )
        )
        this.handleAnimationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.handle.rotation.y += delta as number
            })
        )

        this.animationState = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.1
        )
        this.animationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.appendages.forEach((mesh) => {
                    mesh.position.z += delta as number
                })
            })
        )
        this.offset = 0
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel(
            'Move sled',
            'Set input registers to zero.',
            'brunsviga/sled.jpg'
        )
    }

    getEmitter(): EventEmitter<
        SledEventType,
        InputWheelEvent,
        Sled,
        Tautology
    > {
        return this.emitter
    }

    onClick(event: MouseEvent): void {
        switch (event.button) {
            case 0:
                this.shift(Direction.Right)
                break
            case 2:
                this.shift(Direction.Left)
                break
        }
    }

    public shift(direction: Direction) {
        if (
            this.offset + direction > -1e-3 &&
            this.offset + direction < 7.0 + 1e-3
        ) {
            this.offset += direction as number

            Brunsviga13rk.getInstance().result_sprocket.offset = this.offset
            Brunsviga13rk.getInstance().counter_sprocket.offset = this.offset

            this.handleAnimationState.targetState = -0.21 * direction

            this.animationState.targetState =
                this.animationState.getLatestTarget() +
                0.0057 * (direction as number)

            if (direction > 0.0) {
                this.emitter.emit(SledEventType.ShiftLeft, { digit: 1 })
            } else {
                this.emitter.emit(SledEventType.ShiftRight, { digit: 1 })
            }
        }
    }

    public getOffset(): number {
        return this.offset
    }

    getAvailableUserActions(): UserAction[] {
        return [
            [InputAction.LeftClick, 'Move sled to the right'],
            [InputAction.RightClick, 'Move sled to the left'],
        ]
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return [this.handle]
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.handleAnimationState.advance(delta)
    }
}

function getCommataMeshes(
    scene: Group<Object3DEventMap>,
    name: string,
    amount: number
): Object3D<Object3DEventMap>[] {
    const meshes = []

    for (let i = 1; i <= amount; i++) {
        meshes.push(scene.getObjectByName(name + i.toString())!)
    }

    return meshes
}

function getSprocketWheelMeshes(
    scene: Group<Object3DEventMap>,
    name: string,
    amount: number
): Object3D<Object3DEventMap>[] {
    const meshes = []

    const formatNumber = (num: number) => num.toString().padStart(3, '0')
    for (let i = 1; i <= amount; i++) {
        const wheelName = name + formatNumber(i)
        meshes.push(scene.getObjectByName(wheelName)!)
    }

    return meshes
}
