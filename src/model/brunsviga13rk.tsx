import { Group, Object3D, Object3DEventMap, Raycaster, Vector2 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Engine } from '../engine'
import { ActionHandler } from '../actionHandler'
import { SprocketWheel } from './sprocketWheel'

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
     * []
     */
    selected: Object3D<Object3DEventMap>[] = []
    /**
     * All objects that can be selected.
     * @default
     * []
     */
    selectables: Object3D[] = []
    raycaster: Raycaster
    pointer: Vector2
    engine: Engine

    input_sprocket!: SprocketWheel
    counter_sprocket!: SprocketWheel
    result_sprocket!: SprocketWheel

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

                this.selectables.push(this.scene.getObjectByName('sled')!)
                this.selectables.push(
                    this.scene.getObjectByName('sledge_handle')!
                )

                this.input_sprocket = SprocketWheel.fromScene(
                    this.scene,
                    'input_sprocket_wheel',
                    11
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
            },
            undefined,
            function (error) {
                console.error(error)
            }
        )

        this.engine.renderer.domElement.onmousemove = (event) => {
            this.onMouseMove(event)
        }
        this.engine.renderer.domElement.onclick = (event) => {
            this.onClick(event)
        }
    }

    onClick(event: MouseEvent) {
        this.result_sprocket.rotate(1, 1)
    }

    perform(): void {
        if (this.scene) {
            this.input_sprocket.perform()
            this.counter_sprocket.perform()
            this.result_sprocket.perform()
        }
    }

    onMouseMove(event: MouseEvent) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.engine.camera)

        if (this.scene) {
            const intersection = this.raycaster.intersectObjects(
                this.selectables
            )

            this.selected = []

            if (intersection.length) {
                this.selected.push(intersection[0].object)
            }

            const [, outlinePass] = this.engine.passes
            outlinePass.selectedObjects = this.selected
        }
    }
}
