import { Group, Object3D, Object3DEventMap } from 'three'
import { ActionHandler } from '../actionHandler'

export class SprocketWheel implements ActionHandler {
    /**
     * Individual wheel objects
     */
    wheels: Object3D<Object3DEventMap>[]
    /**
     * Number of digits, equals the number of wheels.
     */
    digits: number
    /**
     * Target euler rotation angles for each wheel.
     */
    targetRotation: number[]
    currentRotation: number[]

    private constructor(wheels: Object3D<Object3DEventMap>[], digits: number) {
        this.digits = digits
        this.wheels = wheels
        this.targetRotation = new Array(digits)
        this.currentRotation = new Array(digits)
        for (let i = 0; i < this.digits; i++) {
            this.targetRotation[i] = this.wheels[i].rotation.y
            this.currentRotation[i] = this.wheels[i].rotation.y
        }
    }

    perform(delta: number): void {
        for (let i = 0; i < this.digits; i++) {
            // Time scale factor derived from frame time.
            const factor = Math.min(1, 1e-2 * delta)
            const angle =
                (this.targetRotation[i] - this.currentRotation[i]) * factor
            this.wheels[i].rotation.y += angle
            this.currentRotation[i] += angle
        }
    }

    rotate(digit: number, increment: number) {
        this.targetRotation[digit - 1] -= (Math.PI / 5.0) * increment
    }

    static fromScene(
        scene: Group<Object3DEventMap>,
        name: string,
        digits: number
    ): SprocketWheel {
        const wheels = []

        const formatNumber = (num: number) => num.toString().padStart(3, '0')
        for (let i = 1; i <= digits; i++) {
            const wheelName = name + formatNumber(i)
            wheels.push(scene.getObjectByName(wheelName)!)
        }

        return new SprocketWheel(wheels, digits)
    }
}
