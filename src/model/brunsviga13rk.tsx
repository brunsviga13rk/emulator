import {
    Group,
    Intersection,
    Object3D,
    Object3DEventMap,
    Raycaster,
    Vector2,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Engine } from '../engine'
import { ActionHandler } from '../actionHandler'
import { SprocketWheel } from './sprocketWheel'
import { InputWheel } from './inputWheel'
import { Selectable } from './selectable'

export class Brunsviga13rk implements ActionHandler {
    /**
     * Scene containing all meshes of the Brunsviga 13 RK.
     * @default
     * undefined
     */
    scene: Group<Object3DEventMap> | undefined = undefined
    /**
     * Currently selected objects.
     * @default
     * undefined
     */
    selected:
        | [Selectable, Intersection<Object3D<Object3DEventMap>>]
        | undefined = undefined
    /**
     * All objects that can be selected.
     * @default
     * []
     */
    selectables: Selectable[] = []
    raycaster: Raycaster
    pointer: Vector2
    engine: Engine

    input_sprocket!: SprocketWheel
    counter_sprocket!: SprocketWheel
    result_sprocket!: SprocketWheel
    selector_sprocket!: InputWheel

    constructor(engine: Engine) {
        this.engine = engine
        this.raycaster = new Raycaster()
        this.pointer = new Vector2()

        // Load model.
        const loader = new GLTFLoader()
        loader.load(
            './brunsviga.glb',
            (gltf) => {
                // Store scene in object and assign to engine for rendering.
                this.scene = gltf.scene
                engine.scene.add(gltf.scene)

                this.input_sprocket = SprocketWheel.fromScene(
                    this.scene,
                    'input_sprocket_wheel',
                    11,
                    0,
                    5.125
                )
                this.counter_sprocket = SprocketWheel.fromScene(
                    this.scene,
                    'counter_sprocket_wheel',
                    8
                )
                this.result_sprocket = SprocketWheel.fromScene(
                    this.scene,
                    'result_sprocket_wheel',
                    13
                )

                this.selector_sprocket = new InputWheel(this.scene)

                this.selectables = []
                this.selectables.push(this.selector_sprocket)
            },
            undefined,
            function (error) {
                console.error(error)
            }
        )

        this.engine.renderer.domElement.onmousemove = (event) => {
            this.onMouseMove(event)
        }

        this.engine.renderer.domElement.onmouseup = (event) => {
            this.onClick(event)
        }
    }

    onClick(event: MouseEvent) {
        if (this.selected) {
            this.selected[0].onClick(event, this.selected[1].object)
        }
    }

    perform(delta: number): void {
        if (this.scene) {
            this.input_sprocket.perform(delta)
            this.counter_sprocket.perform(delta)
            this.result_sprocket.perform(delta)
            this.selector_sprocket.perform(delta)
        }
    }

    onMouseMove(event: MouseEvent) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.engine.camera)

        if (this.scene) {
            this.selected = undefined

            for (const selectable of this.selectables) {
                const intersection = this.raycaster.intersectObjects(
                    selectable.getObjects()
                )

                if (intersection.length) {
                    const closest = intersection[0]
                    if (
                        this.selected &&
                        this.selected[1].distance > closest.distance
                    ) {
                        this.selected = [selectable, closest]
                    } else {
                        this.selected = [selectable, closest]
                    }
                }
            }

            const selection = []
            if (this.selected) {
                selection.push(this.selected[1].object)
            }

            const [, outlinePass] = this.engine.passes
            outlinePass.selectedObjects = selection
        }
    }
}
