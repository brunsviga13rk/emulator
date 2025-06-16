import {
    Group,
    Intersection,
    Object3D,
    Object3DEventMap,
    Raycaster,
    Vector2,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Engine } from '../render/engine'
import { ActionHandler } from '../actionHandler'
import { InputWheel } from './sprockets/inputWheel'
import { Selectable, UserAction } from './selectable'
import {
    InputSprocket,
    MAX_INPUT_SPROCKET_VALUE,
} from './sprockets/inputSprocket'
import { Handle } from './handles/handle'
import { OperationHandle } from './handles/operationHandle'
import { ResultSprocket } from './sprockets/resultSprocket'
import { CounterSprocket } from './sprockets/counterSprocket'
import { CommataBar } from './commata'
import { ResultResetHandle } from './handles/resultResetHandle'
import { CounterResetHandle } from './handles/counterResetHandle'
import { Direction, Sled } from './sled'
import { EventBroker, EventEmitter, Tautology } from './events'
import { Dispatch, SetStateAction } from 'react'
import { AnimationScalarState } from './animation'
import { Switch } from './switch'
import { DeletionHandle } from './handles/deletionHandle'

export enum BrunsvigaAnimationEventType {
    AnimationStarted,
    AnimationEnded,
}

type BrunsvigaAnimationEventContent = undefined

/**
 * Hooks executed when the machine is done initializing.
 */
export type onInitHook = (instancer: Brunsviga13rk) => void

/**
 * Milliseconds in which no animation takes place after which and AnimationEnded
 * event is emitted.
 */
const ANIMATION_END_DELAY_TIME: number = 1000

export class Brunsviga13rk
    implements
        ActionHandler,
        EventBroker<
            BrunsvigaAnimationEventType,
            BrunsvigaAnimationEventContent,
            Brunsviga13rk
        >
{
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
    engine!: Engine
    emitter: EventEmitter<
        BrunsvigaAnimationEventType,
        BrunsvigaAnimationEventContent,
        Brunsviga13rk
    >
    onInitHooks: onInitHook[]
    animationStateActive: boolean
    animationStateFinishCounter: number
    input_sprocket!: InputSprocket
    counter_sprocket!: CounterSprocket
    result_sprocket!: ResultSprocket
    selector_sprocket!: InputWheel
    delete_handle!: DeletionHandle
    delete_input_handle!: Handle
    operation_crank!: OperationHandle
    input_commata!: CommataBar
    count_commata!: CommataBar
    result_commata!: CommataBar
    counter_reset_handle!: CounterResetHandle
    result_reset_handle!: ResultResetHandle
    switch!: Switch
    sled!: Sled
    _setRecommendations!: Dispatch<SetStateAction<UserAction[]>>
    animationOngoing = false
    animationStateChangeCounter = 0

    private static instance: Brunsviga13rk = new Brunsviga13rk()

    public static initInstance(
        engine: Engine,
        onModelLoaded: () => void,
        onLoadingError: (error: unknown) => void
    ) {
        if (Brunsviga13rk.instance) {
            Brunsviga13rk.instance.init(engine, onModelLoaded, onLoadingError)
        }
    }

    public static getInstance(): Brunsviga13rk {
        return Brunsviga13rk.instance
    }

    private constructor() {
        this.onInitHooks = []
        this.animationStateActive = false
        this.animationStateFinishCounter = 0
        this.raycaster = new Raycaster()
        this.pointer = new Vector2()
        this.emitter = new EventEmitter()
        this.emitter.setActor(this)
    }

    private init(
        engine: Engine,
        onModelLoaded: () => void,
        onLoadingError: (error: unknown) => void
    ) {
        this.engine = engine

        // Load model.
        const loader = new GLTFLoader()
        loader.load(
            `${__APP_BASE_PATH__}/brunsviga.glb`,
            (gltf) => {
                let count = 0
                gltf.scene.traverse(function (child) {
                    if ((child as Mesh).isMesh) {
                        optimizeMesh(engine.renderer, child as Mesh)
                        count++
                    }
                    setLoadingEvent({
                        title: 'Optimizing Mesh',
                        progress: count / gltf.scene.children.length,
                    })
                })

                // Store scene in object and assign to engine for rendering.
                engine.scene.add(gltf.scene)
                this.scene = gltf.scene

                this.switch = new Switch(this.scene)
                this.input_sprocket = new InputSprocket(this.scene)
                this.counter_sprocket = new CounterSprocket(this.scene)
                this.result_sprocket = new ResultSprocket(this.scene)
                this.sled = new Sled(this.scene)
                this.selector_sprocket = new InputWheel(this.scene)
                this.result_reset_handle = new ResultResetHandle(this.scene)
                this.counter_reset_handle = new CounterResetHandle(this.scene)
                this.delete_handle = new DeletionHandle(this.scene)
                this.delete_input_handle = new Handle(
                    this.scene,
                    'total_deletion_lever',
                    0,
                    1.75
                )

                this.operation_crank = new OperationHandle(this.scene)
                this.input_commata = new CommataBar(
                    this.scene,
                    'input_commata_',
                    2,
                    -0.072725,
                    -0.020735,
                    9
                )
                this.count_commata = new CommataBar(
                    this.scene,
                    'count_commata_',
                    2,
                    -0.074594,
                    -0.019437,
                    6
                )
                this.result_commata = new CommataBar(
                    this.scene,
                    'result_commata_',
                    3,
                    -0.087035,
                    -0.016637,
                    12
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
                this.selectables.push(this.switch)

                this.input_sprocket.registerActionEvents()
                this.selector_sprocket.registerActionEvents()
                this.result_sprocket.registerActionEvents()
                this.counter_sprocket.registerActionEvents()
                this.operation_crank.registerEventSubscribtions()
                this.result_reset_handle.registerEventSubscribtions()
                this.counter_reset_handle.registerEventSubscribtions()
                this.delete_handle.registerEventSubscribtions()

                onModelLoaded()

                // Handle events.
                engine.registerActionHandler(this)

                // Run post init hooks.
                this.onInitHooks.forEach((hook) => hook(this))
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

    public whenReady(hook: onInitHook) {
        this.onInitHooks.push(hook)
    }

    getEmitter(): EventEmitter<
        BrunsvigaAnimationEventType,
        undefined,
        Brunsviga13rk,
        Tautology
    > {
        return this.emitter
    }

    onClick(event: MouseEvent) {
        if (this.selected && !AnimationScalarState.isAnyAnimationOngoing()) {
            this.selected[0].onClick(event, this.selected[1].object)
        }
    }

    perform(delta: number) {
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
            this.switch.perform(delta)

            // Get current frame animation state.
            const lastAnimationOngoing =
                AnimationScalarState.isAnyAnimationOngoing()

            if (this.animationOngoing && !lastAnimationOngoing) {
                this.animationStateChangeCounter += delta
            } else if (!this.animationOngoing && lastAnimationOngoing) {
                this.emitter.emit(
                    BrunsvigaAnimationEventType.AnimationStarted,
                    undefined
                )
            } else if (this.animationStateChangeCounter > 0) {
                this.animationStateChangeCounter += delta
            }

            // Store animation state for next frame.
            this.animationOngoing = lastAnimationOngoing

            if (this.animationStateChangeCounter >= ANIMATION_END_DELAY_TIME) {
                this.animationStateChangeCounter = 0
                this.emitter.emit(
                    BrunsvigaAnimationEventType.AnimationEnded,
                    undefined
                )
            }
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

            let actions: UserAction[] = []

            if (this.selected !== undefined) {
                const selected = this.selected[0]

                if (selected != undefined) {
                    actions = selected.getAvailableUserActions()
                }
            }

            this._setRecommendations(actions)
        }
    }

    public set recommendations(setter: Dispatch<SetStateAction<UserAction[]>>) {
        this._setRecommendations = setter
    }

    private async sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds)
        })
    }

    // Brunsviga 13 RK programmatic API
    // ========================================================================
    // Application interface for interacting with the Brunsviga how a human
    // would do so when describing a process.
    //
    // set
    // add
    // sub

    private _pause = false
    private _abort = false

    public setPausing(pausing: boolean) {
        this._pause = pausing
    }

    public abort() {
        this._abort = true
    }

    /**
     * Process the abort and pause flag. Either returns true to abort immediately
     * or waits until the pausing period is over.
     *
     * @returns True when the calling process is to abort, false otherwise.
     */
    private async pollAbortAndProcessPause(): Promise<boolean> {
        // Abort if prompted.
        // Abortion can happen indipendently of pausing.
        if (this._abort) {
            this._abort = false
            return true
        }

        // Wait until pausing is disabled.
        while (this._pause) {
            // Abort if prompted.
            // May happen while waiting.
            if (this._abort) {
                this._abort = false
                return true
            }

            await this.sleep(50)
        }

        return false
    }

    /**
     * Slides the nput slider to represent the given value.
     * The input value is saturated to the maximum and minimum value
     * the input sprocket can represent.
     *
     * @since 1.3.0
     * @param value
     */
    public async setInput(value: number): Promise<boolean> {
        // Negative numbers are reprented by complementary.
        if (value < 0) value = MAX_INPUT_SPROCKET_VALUE - value

        // Saturate value.
        if (value < 0) value = 0
        if (value > MAX_INPUT_SPROCKET_VALUE) value = MAX_INPUT_SPROCKET_VALUE

        let digit = 1

        // Set digits covered by value.
        for (; digit <= 10 && value >= 1; digit++) {
            if (await this.pollAbortAndProcessPause()) {
                return true
            }

            const digitValue = value % 10

            this.selector_sprocket.setDigit(digit, digitValue)
            this.input_sprocket.setDigit(digit, digitValue)

            // Remove next digit from our value.
            value = Math.floor(value / 10)
        }

        // Reset left over slider to resting position.
        for (; digit <= 10; digit++) {
            if (await this.pollAbortAndProcessPause()) {
                return true
            }

            this.selector_sprocket.setDigit(digit, 0)
            this.input_sprocket.setDigit(digit, 0)
        }

        await this.sleep(500)

        return false
    }

    public async add(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.operation_crank.add()

        await this.sleep(700)

        return false
    }

    public async subtract(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.operation_crank.subtract()

        await this.sleep(500)

        return false
    }

    public async shiftLeft(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.sled.shift(Direction.Left)

        await this.sleep(100)

        return false
    }

    public async shiftRight(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.sled.shift(Direction.Right)

        await this.sleep(100)

        return false
    }

    public async clearOutputRegister(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.result_reset_handle.pullDown()

        await this.sleep(500)

        return false
    }

    public async clearInputRegister(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.delete_input_handle.pullDown()

        await this.sleep(500)

        return false
    }

    public async clearCounterRegister(): Promise<boolean> {
        if (await this.pollAbortAndProcessPause()) {
            return true
        }

        this.counter_reset_handle.pullDown()

        await this.sleep(500)

        return false
    }

    public async clearRegisters(): Promise<boolean> {
        this.delete_handle.pullDown()
        this.repeatedShiftLeft(6)

        await this.sleep(500)

        return false
    }

    // Synchronous API to retrieve values from the state of the machine.
    // .......................................................................

    public getCounterRegisterValue(): number {
        return this.counter_sprocket.getDisplayValue()
    }

    public getDecimalShift(): number {
        return this.sled.getOffset()
    }

    public getInputRegisterValue(): number {
        return this.input_sprocket.getDisplayValue()
    }

    public getResultRegisterValue(): number {
        return this.result_sprocket.getDisplayValue()
    }

    // Convinience wrapper function around single action variants.
    // .......................................................................

    public async repeatedAdd(
        amount: number | undefined = undefined
    ): Promise<boolean> {
        if (amount == undefined) {
            return await this.add()
        } else {
            for (let i = 0; i < amount; i++) {
                if (await this.add()) {
                    return true
                }
            }
        }
        return false
    }

    public async repeatedSubtract(
        amount: number | undefined = undefined
    ): Promise<boolean> {
        if (amount == undefined) {
            return await this.subtract()
        } else {
            for (let i = 0; i < amount; i++) {
                if (await this.subtract()) {
                    return true
                }
            }
        }

        return false
    }

    public async repeatedShiftLeft(
        amount: number | undefined = undefined
    ): Promise<boolean> {
        if (amount == undefined) {
            return await this.shiftLeft()
        } else {
            for (let i = 0; i < amount; i++) {
                if (await this.shiftLeft()) {
                    return true
                }
            }
        }
        return false
    }

    public async repeatedShiftRight(
        amount: number | undefined = undefined
    ): Promise<boolean> {
        if (amount == undefined) {
            return await this.shiftRight()
        } else {
            for (let i = 0; i < amount; i++) {
                if (await this.shiftRight()) {
                    return true
                }
            }
        }
        return false
    }
}

/**
 * Perform various optimization configurations for both aestethis and peformance. These include:
 *
 *  - perf: Backface culling
 *  - perf: Disable transparency
 *  - looks: Anisotropic filtering
 *
 * @param mesh
 */
function optimizeMesh(
    renderer: WebGLRenderer,
    mesh: Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
    >
) {
    mesh.receiveShadow = true
    mesh.castShadow = true

    const optimizeTexture = (texture: Texture | null) => {
        if (!texture) return

        texture.generateMipmaps = true
        // Use anisotropic filtering for mipmaps
        // See: https://sbcode.net/threejs/anisotropic/
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    }

    const material = mesh.material as MeshStandardMaterial

    if (material.isMaterial) {
        // Enable backface-culling.
        material.side = FrontSide
        // Disable transparency
        material.transparent = false

        optimizeTexture(material.map)
        optimizeTexture(material.normalMap)
        optimizeTexture(material.roughnessMap)
        optimizeTexture(material.metalnessMap)
    }
}
