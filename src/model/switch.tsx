import { Group, Object3D, Object3DEventMap } from 'three'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from './animation'
import { EventHandler } from './events'
import { ActionHandler } from '../actionHandler'
import { InputAction, Selectable, UserAction } from './selectable'
import { DetailPanel } from '../render/Details'

export class Switch implements ActionHandler, Selectable {
    protected handle: Object3D<Object3DEventMap>
    protected animationState: AnimationScalarState
    protected resetBoth: boolean

    public constructor(scene: Group<Object3DEventMap>) {
        this.resetBoth = false
        this.handle = scene.getObjectByName('toggle_switch')!
        this.animationState = new AnimationScalarState(
            0,
            CubicEaseInOutInterpolation,
            0.15
        )
        this.animationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.handle.rotation.z += delta as number
            })
        )
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel('Switch', 'Set all registers to zero.')
    }

    public isResetBoth(): boolean {
        return !this.resetBoth
    }

    perform(delta: number): void {
        this.animationState.advance(delta)
    }

    onClick(event: MouseEvent): void {
        switch (event.button) {
            case 0:
                if (this.resetBoth) {
                    this.animationState.targetState = 0
                } else {
                    this.animationState.targetState = 0.6981317
                }
                this.resetBoth = !this.resetBoth
                break
        }
    }

    getAvailableUserActions(): UserAction[] {
        return [[InputAction.LeftClick, 'Toggle ']]
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return [this.handle]
    }
}
