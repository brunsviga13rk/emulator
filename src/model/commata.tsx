import { Group, Object3D, Object3DEventMap } from 'three'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from './animation'
import { ActionHandler } from '../actionHandler'
import { InputAction, Selectable, UserAction } from './selectable'
import { EventHandler } from './events'

class Commata implements ActionHandler {
    protected animationState: AnimationScalarState
    protected mesh: Object3D<Object3DEventMap>
    protected _digit: number

    public constructor(
        scene: Group<Object3DEventMap>,
        name: string,
        initialTranslation: number,
        digit: number
    ) {
        this._digit = digit
        this.animationState = new AnimationScalarState(
            initialTranslation,
            CubicEaseInOutInterpolation,
            0.1
        )
        this.mesh = scene.getObjectByName(name)!
        this.animationState.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.mesh.position.z += delta as number
            })
        )
    }

    perform(delta: number): boolean {
        this.animationState.advance(delta)

        return this.animationState.isAnimationDone()
    }

    public move(translation: number) {
        this.animationState.targetState =
            this.animationState.getLatestTarget() + translation

        this._digit += Math.sign(translation)
    }

    public getMesh(): Object3D<Object3DEventMap> {
        return this.mesh
    }

    public getTranslation(): number {
        return this.animationState.currentState
    }

    public get digit(): number {
        return this._digit
    }
}

export class CommataBar implements ActionHandler, Selectable {
    protected commata: Commata[]
    protected bounds: [maxTranslation: number, minTranslation: number]
    protected resolution: number

    public constructor(
        scene: Group<Object3DEventMap>,
        name: string,
        amount: number,
        minTranslation: number,
        maxTranslation: number,
        resolution: number
    ) {
        this.resolution = resolution
        this.commata = []
        this.bounds = [minTranslation, maxTranslation]

        for (let i = 1; i <= amount; i++) {
            const startPosition =
                ((maxTranslation - minTranslation) / resolution) * (i - 1) +
                minTranslation
            this.commata.push(
                new Commata(scene, name + i.toString(), startPosition, i)
            )
        }
    }

    getAvailableUserActions(): UserAction[] {
        return [
            [InputAction.LeftClick, 'Shift to the right'],
            [InputAction.RightClick, 'Shift to the left'],
        ]
    }

    onClick(event: MouseEvent, object: Object3D<Object3DEventMap>): void {
        let sign = 1.0
        switch (event.button) {
            // Primary button has been pressed.
            case 0:
                sign = 1.0
                break
            // Secondary button has been pressed.
            case 2:
                sign = -1.0
                break
        }

        for (let i = 0; i < this.commata.length; i++) {
            if (this.commata[i].getMesh().id == object.id) {
                const [minTranslation, maxTranslation] = this.bounds
                const position = this.commata[i].getTranslation()
                const translation =
                    ((maxTranslation - minTranslation) / this.resolution) * sign
                const offset = position + translation

                if (this.isDigitObstructed(this.commata[i].digit + sign)) break

                if (offset <= maxTranslation && offset >= minTranslation) {
                    this.commata[i].move(translation)
                }
            }
        }
    }

    private isDigitObstructed(digit: number) {
        return this.commata.find((commata) => commata.digit == digit)
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return this.commata.map((commata) => commata.getMesh())
    }

    perform(delta: number): boolean {
        let animationDone = true

        this.commata.forEach((commata) => {
            animationDone &&= commata.perform(delta)
        })

        return animationDone
    }
}
