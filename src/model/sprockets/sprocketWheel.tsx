import { Group, MathUtils, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../../actionHandler'
import { EventBroker, EventEmitter } from '../events'
import { AnimationScalarState, CubicEaseInOutInterpolation } from '../animation'

export enum SprocketWheelEventType {
    Increment,
    Decrement,
}

export type SprocketWheelIncrementEvent = { digit: number }
export type SprocketWheelDecrementEvent = { digit: number }

export type InputWheelEvent =
    | SprocketWheelIncrementEvent
    | SprocketWheelDecrementEvent

export class SprocketWheel
    implements
        ActionHandler,
        EventBroker<SprocketWheelEventType, InputWheelEvent, SprocketWheel>
{
    /**
     * Individual wheel objects
     */
    protected wheels: Object3D<Object3DEventMap>[]
    /**
     * Number of digits, equals the number of wheels.
     */
    protected digits: number
    /**
     * Base of each digit.
     * @default 10
     */
    protected base: number
    /**
     * Target euler rotation angles for each wheel.
     */
    protected rotationAnimations: AnimationScalarState[]
    /**
     * Range in which fixed angle increments occur on the sprocket wheel.
     * Note that the minimum must be smaller than the maximum angle.
     */
    protected angleLimits: [minAngle: number, maxAngle: number]
    /**
     * Decimal digits currently displayed by the sprocket wheel.
     */
    protected decimalDigits: number[]
    protected emitter: EventEmitter<
        SprocketWheelEventType,
        InputWheelEvent,
        SprocketWheel
    >
    /**
     * Offset applied when adding or subtracing a value.
     */
    protected _offset: number

    public constructor(
        scene: Group<Object3DEventMap>,
        name: string,
        digits: number,
        minAngle: number,
        maxAngle: number,
        base: number
    ) {
        this._offset = 0
        this.wheels = []
        this.digits = digits
        this.base = base
        this.angleLimits = [minAngle, maxAngle]
        this.rotationAnimations = []
        this.decimalDigits = new Array(digits).fill(0)
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)

        const formatNumber = (num: number) => num.toString().padStart(3, '0')
        for (let i = 1; i <= digits; i++) {
            const wheelName = name + formatNumber(i)
            this.wheels.push(scene.getObjectByName(wheelName)!)
        }

        // Initialize rotaton states.
        for (let i = 0; i < this.digits; i++) {
            this.rotationAnimations.push(
                new AnimationScalarState(
                    this.wheels[i].rotation.y + minAngle,
                    CubicEaseInOutInterpolation,
                    0.25
                )
            )
            this.wheels[i].rotation.y += minAngle
        }
    }

    getEmitter(): EventEmitter<
        SprocketWheelEventType,
        InputWheelEvent,
        SprocketWheel
    > {
        return this.emitter
    }

    public perform(delta: number): void {
        for (let i = 0; i < this.digits; i++) {
            this.rotationAnimations[i].advance(delta)
            this.wheels[i].rotation.y = this.rotationAnimations[i].currentState
        }
    }

    /**
     *
     * @returns The total value of the sprocket as displayed by all wheels.
     */
    public getDisplayValue(): number {
        let sum = 0
        let base = 1

        for (let i = 0; i < this.digits; i++) {
            sum += this.decimalDigits[i] * base
            base *= this.base
        }

        return sum
    }

    /**
     * Rotate a specific wheel of the sprocket by one increment.
     *
     * @param digit The sprocket wheel identified by the digit it represents.
     * @param increment How many digits to rotate around.
     */
    public rotate(digit: number, increment: number) {
        const idx = digit - 1
        let digitValue = this.decimalDigits[idx] + increment
        const [minAngle, maxAngle] = this.angleLimits
        let nextAngle = this.rotationAnimations[idx].getLatestTarget()

        // Rotate around "dead-zone"
        if (digitValue > this.base - 1) {
            nextAngle -= Math.PI * 2.0 - maxAngle + minAngle
        } else if (digitValue < 0) {
            nextAngle += Math.PI * 2.0 - maxAngle + minAngle
        }

        // Increment digit rotation.
        nextAngle -= ((maxAngle - minAngle) / this.base) * increment

        this.rotationAnimations[idx].targetState = nextAngle
        digitValue = MathUtils.euclideanModulo(digitValue, this.base)

        this.decimalDigits[idx] = digitValue

        // Emit events.
        if (increment > 0) {
            this.emitter.emit(SprocketWheelEventType.Increment, {
                digit: digit,
            })
        } else {
            this.emitter.emit(SprocketWheelEventType.Decrement, {
                digit: digit,
            })
        }
    }

    public add(values: number[]) {
        let overflow = 0
        for (let i = 0; i + this._offset < this.digits; i++) {
            const current = this.decimalDigits[i + this.offset]
            const increment = overflow + (values.length > i ? values[i] : 0)

            this.rotate(i + this._offset + 1, increment)

            overflow = Math.floor((current + increment) / this.base)
        }
    }

    public subtract(values: number[]) {
        let overflow = 0
        for (let i = this._offset; i + this._offset < this.digits; i++) {
            const current = this.decimalDigits[i + this.offset]
            const decrement = overflow + (values.length > i ? values[i] : 0)

            this.rotate(i + this._offset + 1, -decrement)

            overflow = -Math.floor((current - decrement) / this.base)
        }
    }

    public setDigit(digit: number, value: number) {
        this.rotate(digit, value - this.decimalDigits[digit - 1])
    }

    public reset() {
        for (let i = 0; i < this.digits; i++) {
            this.rotate(i + 1, -this.decimalDigits[i])
        }
    }

    public getWheels(): Object3D<Object3DEventMap>[] {
        return this.wheels
    }

    public getDigits(): number {
        return this.digits
    }

    public getDecimalDigits(): number[] {
        return this.decimalDigits
    }

    public get offset(): number {
        return this._offset
    }

    public set offset(offset: number) {
        this._offset = offset
    }

    /**
     * Create a new generic sprocket wheel.
     *
     * @param scene Contains the meshes of the sprocket wheels.
     * @param name Base name of the meshes.
     * @param digits Number of wheels.
     * @param minAngle
     * @param maxAngle
     * @returns
     */
    public static fromScene(
        scene: Group<Object3DEventMap>,
        name: string,
        digits: number,
        minAngle: number = 0.0,
        maxAngle: number = Math.PI * 2.0
    ): SprocketWheel {
        return new SprocketWheel(scene, name, digits, minAngle, maxAngle, 10)
    }
}
