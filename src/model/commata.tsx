import { Group, Object3D, Object3DEventMap } from 'three'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from './animation'
import { ActionHandler } from '../actionHandler'
import { InputAction, Selectable, UserAction } from './selectable'
import { EventBroker, EventEmitter, EventHandler, Tautology } from './events'
import { DetailPanel } from '../render/Details'

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

    perform(delta: number): void {
        this.animationState.advance(delta)
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

export enum CommataBarEventType {
    Shifted,
}

export type CommataBarShiftedLeftEvent = { commata: number[] }

export type CommataBarEvent = CommataBarShiftedLeftEvent

export class CommataBar
    implements
        ActionHandler,
        Selectable,
        EventBroker<CommataBarEventType, CommataBarEvent, CommataBar>
{
    protected commata: Commata[]
    protected bounds: [maxTranslation: number, minTranslation: number]
    protected resolution: number
    protected emitter: EventEmitter<
        CommataBarEventType,
        CommataBarEvent,
        CommataBar
    >

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

        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    getDetailPanel(): DetailPanel {
        return new DetailPanel(
            'Commata',
            'These may represent the begin of the fraction or separate thousands.'
        )
    }

    getEmitter(): EventEmitter<
        CommataBarEventType,
        CommataBarShiftedLeftEvent,
        CommataBar,
        Tautology
    > {
        return this.emitter
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
                this.moveDigit(i, sign)
            }
        }
    }

    public moveDigit(digit: number, sign: number) {
        const [minTranslation, maxTranslation] = this.bounds
        const position = this.commata[digit].getTranslation()
        const translation =
            ((maxTranslation - minTranslation) / this.resolution) * sign
        const offset = position + translation

        if (this.isDigitObstructed(this.commata[digit].digit + sign)) return

        if (offset <= maxTranslation && offset >= minTranslation) {
            this.commata[digit].move(translation)

            this.emitter.emit(CommataBarEventType.Shifted, {
                commata: this.getAllDigitShifts(),
            })
        }
    }

    public getAllDigitShifts(): number[] {
        return this.commata.map((commata) => commata.digit)
    }

    public getDigitShift(digit: number): number {
        return this.commata[digit].digit
    }

    private isDigitObstructed(digit: number) {
        return this.commata.find((commata) => commata.digit == digit)
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return this.commata.map((commata) => commata.getMesh())
    }

    perform(delta: number): void {
        this.commata.forEach((commata) => {
            commata.perform(delta)
        })
    }
}
