import { Group, Object3D, Object3DEventMap } from 'three'
import { AnimationScalarState, CubicEaseInOutInterpolation } from './animation'
import { ActionHandler } from '../actionHandler'
import { Selectable } from './selectable'

class Commata implements ActionHandler {
    protected animationState: AnimationScalarState
    protected mesh: Object3D<Object3DEventMap>

    public constructor(scene: Group<Object3DEventMap>, name: string) {
        this.animationState = new AnimationScalarState(
            0.0,
            CubicEaseInOutInterpolation,
            0.1
        )
        this.mesh = scene.getObjectByName(name)!
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
        this.mesh.position.z = this.animationState.currentState
    }

    public move(translation: number) {
        this.animationState.targetState =
            this.animationState.getLatestTarget() + translation
    }

    public getMesh(): Object3D<Object3DEventMap> {
        return this.mesh
    }
}

export class CommataBar implements ActionHandler, Selectable {
    protected commata: Commata[]

    public constructor(
        scene: Group<Object3DEventMap>,
        name: string,
        amount: number
    ) {
        this.commata = []

        for (let i = 1; i <= amount; i++) {
            this.commata.push(new Commata(scene, name + amount.toString()))
        }
    }

    onClick(event: MouseEvent, object: Object3D<Object3DEventMap>): void {}

    getObjects(): Object3D<Object3DEventMap>[] {
        return this.commata.map((commata) => commata.getMesh())
    }

    perform(delta: number): void {
        this.commata.forEach((commata) => {
            commata.perform(delta)
        })
    }
}
