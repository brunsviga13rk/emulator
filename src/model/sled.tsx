import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../actionHandler'
import { InputAction, Selectable, UserAction } from './selectable'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from './animation'
import { EventHandler } from './events'
import { Brunsviga13rk } from './brunsviga13rk'

export enum Direction {
    Left = -1.0,
    Right = 1.0,
}

export class Sled implements ActionHandler, Selectable {
    protected handle: Object3D<Object3DEventMap>
    protected appendages: Object3D<Object3DEventMap>[]
    protected animationState: AnimationScalarState
    protected offset: number

    public constructor(scene: Group<Object3DEventMap>) {
        this.handle = scene.getObjectByName('sledge_handle')!
        this.appendages = [
            this.handle,
            scene.getObjectByName('sled')!,
            scene.getObjectByName('deletion')!,
            scene.getObjectByName('result_deletionn_lever')!,
        ]
        this.appendages = this.appendages.concat(
            getCommataMeshes(scene, 'result_commata_', 3)
        )
        this.appendages = this.appendages.concat(
            getSprocketWheelMeshes(scene, 'result_sprocket_wheel', 13)
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

            this.animationState.targetState =
                this.animationState.getLatestTarget() +
                0.057 * (direction as number)
        }
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
