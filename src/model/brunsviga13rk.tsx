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
import { InputWheel } from './sprockets/inputWheel'
import { Selectable } from './selectable'
import { InputSprocket } from './sprockets/inputSprocket'
import { Handle } from './handles/handle'
import { OperationHandle } from './handles/operationHandle'
import { ResultSprocket } from './sprockets/resultSprocket'
import { CounterSprocket } from './sprockets/counterSprocket'
import { CommataBar } from './commata'
import { ResultResetHandle } from './handles/resultResetHandle'
import { CounterResetHandle } from './handles/counterResetHandle'
import { Sled } from './sled'

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
    counter_sprocket!: CounterSprocket
    result_sprocket!: ResultSprocket
    selector_sprocket!: InputWheel
    delete_handle!: Handle
    delete_input_handle!: Handle
    operation_crank!: OperationHandle
    input_commata!: CommataBar
    count_commata!: CommataBar
    result_commata!: CommataBar
    counter_reset_handle!: CounterResetHandle
    result_reset_handle!: ResultResetHandle
    sled!: Sled

    private static instance: Brunsviga13rk | undefined = undefined

    public static createInstance(
        engine: Engine,
        onModelLoaded: () => void,
        onLoadingError: (error: unknown) => void
    ): Brunsviga13rk {
        if (!Brunsviga13rk.instance) {
            Brunsviga13rk.instance = new Brunsviga13rk(
                engine,
                onModelLoaded,
                onLoadingError
            )
        }

        return Brunsviga13rk.instance
    }

    public static getInstance(): Brunsviga13rk {
        if (!Brunsviga13rk.instance) {
            throw new Error('No instance created yet')
        }
        return Brunsviga13rk.instance
    }

    private constructor(
        engine: Engine,
        onModelLoaded: () => void,
        onLoadingError: (error: unknown) => void
    ) {
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
                this.counter_sprocket = new CounterSprocket(this.scene)
                this.result_sprocket = new ResultSprocket(this.scene)
                this.sled = new Sled(this.scene)
                this.selector_sprocket = new InputWheel(this.scene)
                this.result_reset_handle = new ResultResetHandle(this.scene)
                this.counter_reset_handle = new CounterResetHandle(this.scene)
                this.delete_handle = new Handle(this.scene, 'deletion', 0, 2)
                this.delete_input_handle = new Handle(
                    this.scene,
                    'total_deletion_lever',
                    0,
                    2
                )

                this.operation_crank = new OperationHandle(this.scene)
                this.input_commata = new CommataBar(
                    this.scene,
                    'input_commata_',
                    2,
                    -0.69,
                    0.57,
                    12
                )
                this.count_commata = new CommataBar(
                    this.scene,
                    'count_commata_',
                    2,
                    -0.75,
                    0.57,
                    9
                )
                this.result_commata = new CommataBar(
                    this.scene,
                    'result_commata_',
                    3,
                    -0.835,
                    0.52,
                    13
                )

                this.selectables = []
                this.selectables.push(this.selector_sprocket)
                this.selectables.push(this.delete_handle)
                this.selectables.push(this.delete_input_handle)
                this.selectables.push(this.counter_reset_handle)
                this.selectables.push(this.operation_crank)
                this.selectables.push(this.input_commata)
                this.selectables.push(this.count_commata)
                this.selectables.push(this.result_commata)
                this.selectables.push(this.result_reset_handle)
                this.selectables.push(this.sled)

                this.input_sprocket.registerActionEvents()
                this.selector_sprocket.registerActionEvents()
                this.result_sprocket.registerActionEvents()
                this.counter_sprocket.registerActionEvents()
                this.operation_crank.registerEventSubscribtions()
                this.result_reset_handle.registerEventSubscribtions()
                this.counter_reset_handle.registerEventSubscribtions()

                onModelLoaded()

                // Handle events.
                engine.registerActionHandler(this)
            },
            undefined,
            onLoadingError
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
            this.input_commata.perform(delta)
            this.count_commata.perform(delta)
            this.result_commata.perform(delta)
            this.counter_reset_handle.perform(delta)
            this.result_reset_handle.perform(delta)
            this.sled.perform(delta)
        }
    }

    onMouseMove(event: MouseEvent) {
        const boundingRect = this.engine.parent.getBoundingClientRect()
        this.pointer.x =
            ((event.clientX - boundingRect.left) / boundingRect.width) * 2 - 1
        this.pointer.y =
            -((event.clientY - boundingRect.top) / boundingRect.height) * 2 + 1

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

            updateInputRecommendations(
                this.selected == undefined ? undefined : this.selected[0]
            )
        }
    }
}

function updateInputRecommendations(selected: Selectable | undefined) {
    const htmlElement = document.getElementById('input-action-recommendations')

    if (!htmlElement) throw new Error('no input recommendaton element')

    htmlElement.setHTMLUnsafe('')

    if (selected != undefined) {
        selected.getAvailableUserActions().forEach(([action, description]) => {
            const span = document.createElement('span')
            const icon = action as string
            span.innerHTML = `<span class="user-action"><i class="ph ${icon}"></i>${description}</span>`
            htmlElement.append(span)
        })
    }
}
