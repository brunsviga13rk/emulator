import { Group, Object3D, Object3DEventMap } from 'three'
import { Selectable } from './selectable'
import { SprocketWheel } from './sprocketWheel'

const INPUT_WHEEL_DIGITS = 10
const INPUT_WHEEL_MESH_NAME = 'selctor_sprocket_wheel'

export class InputWheel extends SprocketWheel implements Selectable {
    public constructor(scene: Group<Object3DEventMap>) {
        const wheels = []

        const formatNumber = (num: number) => num.toString().padStart(3, '0')
        for (let i = 1; i <= INPUT_WHEEL_DIGITS; i++) {
            const wheelName = INPUT_WHEEL_MESH_NAME + formatNumber(i)
            wheels.push(scene.getObjectByName(wheelName)!)
        }

        super(wheels, INPUT_WHEEL_DIGITS, Math.PI * 0.41, Math.PI * 0.9, 10)

        // Initialize rotation of wheels.
        // A full rotation around the "dead-zone" is required as these wheels
        // operate in reverse direction as the display sprocket wheels.
        for (let i = 1; i <= INPUT_WHEEL_DIGITS; i++) {
            this.rotate(i, -1)
        }
    }

    onClick(_event: MouseEvent, object: Object3D<Object3DEventMap>): void {
        for (let i = 0; i < this.digits; i++) {
            if (this.wheels[i].id == object.id) {
                switch (_event.button) {
                    // Primary button has been pressed.
                    case 0:
                        this.rotate(i + 1, -1)
                        break
                    // Secondary button has been pressed.
                    case 2:
                        this.rotate(i + 1, 1)
                        break
                }

                break
            }
        }
    }

    getObjects(): Object3D<Object3DEventMap>[] {
        return this.wheels
    }
}
