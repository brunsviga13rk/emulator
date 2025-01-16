import { Group, MathUtils, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../actionHandler'

const ANGULAR_VELOCITY = 1e-2

export class SprocketWheel implements ActionHandler {
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
    protected targetRotation: number[]
    protected currentRotation: number[]
    protected angleLimits: [minAngle: number, maxAngle: number]
    /**
     * Decimal digits currently displayed by the sprocket wheel.
     */
    protected decimalDigits: number[]

    protected constructor(
        wheels: Object3D<Object3DEventMap>[],
        digits: number,
        minAngle: number,
        maxAngle: number,
        base: number
    ) {
        this.digits = digits
        this.wheels = wheels
        this.targetRotation = new Array(digits)
        this.currentRotation = new Array(digits)
        this.decimalDigits = new Array(digits).fill(0)
        for (let i = 0; i < this.digits; i++) {
            this.wheels[i].rotation.y += minAngle
            this.targetRotation[i] = this.wheels[i].rotation.y + minAngle
            this.currentRotation[i] = this.wheels[i].rotation.y + minAngle
        }
        this.angleLimits = [minAngle, maxAngle]
        this.base = base
    }

    public perform(delta: number): void {
        for (let i = 0; i < this.digits; i++) {
            // Time scale factor derived from frame time.
            const factor = Math.min(1, ANGULAR_VELOCITY * delta)
            const angle =
                (this.targetRotation[i] - this.currentRotation[i]) * factor

            this.wheels[i].rotation.y += angle
            this.currentRotation[i] += angle
        }
    }

    public getDisplayValue(): number {
        let sum = 0
        let base = 1

        for (let i = 0; i < this.digits; i++) {
            sum += this.decimalDigits[i] * base
            base *= 10
        }

        return sum
    }

    public rotate(digit: number, increment: number) {
        let digitValue = this.decimalDigits[digit - 1] + increment
        const [minAngle, maxAngle] = this.angleLimits

        if (digitValue > this.base - 1) {
            this.targetRotation[digit - 1] -=
                Math.PI * 2.0 -
                maxAngle +
                minAngle +
                (maxAngle - minAngle) / this.base
        } else if (digitValue < 0) {
            this.targetRotation[digit - 1] +=
                Math.PI * 2.0 -
                maxAngle +
                (maxAngle - minAngle) / this.base +
                minAngle
        } else {
            // Increment digit rotation.
            this.targetRotation[digit - 1] -=
                ((maxAngle - minAngle) / this.base) * increment
        }

        digitValue = MathUtils.euclideanModulo(digitValue, this.base)

        this.decimalDigits[digit - 1] = digitValue
    }

    public static fromScene(
        scene: Group<Object3DEventMap>,
        name: string,
        digits: number,
        minAngle: number = 0.0,
        maxAngle: number = Math.PI * 2.0
    ): SprocketWheel {
        const wheels = []

        const formatNumber = (num: number) => num.toString().padStart(3, '0')
        for (let i = 1; i <= digits; i++) {
            const wheelName = name + formatNumber(i)
            wheels.push(scene.getObjectByName(wheelName)!)
        }

        return new SprocketWheel(wheels, digits, minAngle, maxAngle, 10)
    }
}
