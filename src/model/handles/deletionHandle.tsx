import { Group, Object3D, Object3DEventMap } from 'three'
import { EventHandler } from '../events'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from '../animation'
import { Handle, HandleEventType } from './handle'
import { DetailPanel } from '../../render/Details'

export class DeletionHandle extends Handle {
    protected gearMesh: Object3D<Object3DEventMap>
    protected gearAnimationState: AnimationScalarState

    public constructor(scene: Group<Object3DEventMap>) {
        super(scene, 'deletion', 0, 1.75)

        this.gearMesh = scene.getObjectByName('gear')!
        this.gearAnimationState = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.5
        )
        this.gearAnimationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.gearMesh.rotation.y += delta as number
            })
        )
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel('Clear All', 'Set all registers to zero.')
    }

    public registerEventSubscribtions() {
        super.getEmitter().subscribe(
            HandleEventType.PullDown,
            new EventHandler(() => {
                this.gearAnimationState.targetState = 1.75
            })
        )

        super.getEmitter().subscribe(
            HandleEventType.PullDownDone,
            new EventHandler(() => {
                this.gearAnimationState.targetState = 0
            })
        )
    }

    perform(delta: number): void {
        this.gearAnimationState.advance(delta)

        super.perform(delta)
    }
}
