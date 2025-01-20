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
import { InputSprocket } from './sprockets/inputSprocket'
import { Handle } from './handles/handle'
import { OperationHandle } from './handles/operationHandle'
import { ResultSprocket } from './sprockets/resultSprocket'

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

    input_sprocket!: InputSprocket
    counter_sprocket!: SprocketWheel
    result_sprocket!: ResultSprocket
    selector_sprocket!: InputWheel
    delete_handle!: Handle
    delete_input_handle!: Handle
    operation_crank!: OperationHandle

    private static instance: Brunsviga13rk | undefined = undefined

    public static createInstance(engine: Engine): Brunsviga13rk {
        if (!Brunsviga13rk.instance) {
            Brunsviga13rk.instance = new Brunsviga13rk(engine)
        }

        return Brunsviga13rk.instance
    }

    public static getInstance(): Brunsviga13rk {
        if (!Brunsviga13rk.instance) {
            throw new Error('No instance created yet')
        }
        return Brunsviga13rk.instance
    }

    private constructor(engine: Engine) {
        this.engine = engine
        this.raycaster = new Raycaster()
        this.pointer = new Vector2()

        // Load model.
        const loader = new GLTFLoader()
        loader.load(
            './brunsviga.glb',
            (gltf) => {
                // Store scene in object and assign to engine for rendering.
                engine.scene.add(gltf.scene)
                this.scene = gltf.scene

                this.input_sprocket = new InputSprocket(this.scene)
                this.counter_sprocket = SprocketWheel.fromScene(
                    this.scene,
                    'counter_sprocket_wheel',
                    8
                )
                this.result_sprocket = new ResultSprocket(this.scene)

                this.selector_sprocket = new InputWheel(this.scene)
                this.delete_handle = new Handle(this.scene, 'deletion', 0, 2)
                this.delete_input_handle = new Handle(
                    this.scene,
                    'total_deletion_lever',
                    0,
                    2
                )

                this.operation_crank = new OperationHandle(this.scene)

                this.selectables = []
                this.selectables.push(this.selector_sprocket)
                this.selectables.push(this.delete_handle)
                this.selectables.push(this.delete_input_handle)
                this.selectables.push(this.operation_crank)

                this.input_sprocket.registerActionEvents()
                this.selector_sprocket.registerActionEvents()
                this.result_sprocket.registerActionEvents()
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
            this.delete_handle.perform(delta)
            this.delete_input_handle.perform(delta)
            this.operation_crank.perform(delta)
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
