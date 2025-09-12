import {
    Clock,
    PerspectiveCamera,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three'
import { ViewportGizmo } from 'three-viewport-gizmo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ActionHandler } from '../actionHandler'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js'
import { ACESFilmicToneMapping } from 'three'
import {
    AnimationScalarState,
    AnimationScalarStateEventType,
    CubicEaseInOutInterpolation,
} from '../model/animation'
import { EventHandler } from '../model/events'

const CameraStartPosition: Vector3 = new Vector3(-0.4, 0.2, 0.2)
const CameraZoomStart: number = 1.0

/**
 * Manages the core componentes and state required for rendering the basic scene.
 */
export class Engine {
    parent: HTMLElement
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera
    composer: EffectComposer
    passes: [
        renderPass: TAARenderPass,
        outlinePass: OutlinePass,
        outputPass: OutputPass,
    ]
    controls: OrbitControls
    gizmo!: ViewportGizmo
    handler: ActionHandler[]
    cameraResetAction: AnimationScalarState

    static instance: Engine | undefined = undefined

    public static getInstance(): Engine | undefined {
        return Engine.instance
    }

    public static new(parent: HTMLElement): Engine {
        Engine.instance = new Engine(parent)
        return Engine.instance
    }

    constructor(parent: HTMLElement) {
        this.parent = parent
        this.handler = []
        this.cameraResetAction = new AnimationScalarState(
            0.0,
            CubicEaseInOutInterpolation,
            1.0
        )
        this.cameraResetAction.getEmitter().subscribe(
            AnimationScalarStateEventType.StateChanged,
            new EventHandler((delta) => {
                this.camera.position.x += ((CameraStartPosition.x -
                    this.camera.position.x) *
                    delta) as number
                this.camera.position.y += ((CameraStartPosition.y -
                    this.camera.position.y) *
                    delta) as number
                this.camera.position.z += ((CameraStartPosition.z -
                    this.camera.position.z) *
                    delta) as number
                this.camera.zoom += ((CameraZoomStart - this.camera.zoom) *
                    delta) as number
            })
        )
        this.renderer = new WebGLRenderer({
            antialias: true,
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.toneMapping = ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.3
        this.renderer.setSize(parent.clientWidth, parent.clientHeight)
        // Create core components.
        this.scene = new Scene()
        this.camera = this.createCamera()
        this.controls = this.createControls()
        this.composer = new EffectComposer(this.renderer)
        this.passes = this.createRenderPasses()
        // Attach passes to composer
        this.passes.forEach((pass) => this.composer.addPass(pass))
    }

    public attachCanvas() {
        // Add canvas used by WebGL to renderer.
        // Check if there is already a child. In case there is replace the first child
        // with the new canvas, else append the canvas.
        if (this.parent.hasChildNodes()) {
            this.parent.replaceChild(
                this.renderer.domElement,
                this.parent.firstChild!
            )
        } else {
            this.parent.appendChild(this.renderer.domElement)
        }
        this.gizmo = this.createGizmo()
    }

    private resizeCanvas() {
        const parentWidth = this.parent.clientWidth
        const parentHeight = this.parent.clientHeight

        const needsResize =
            parentWidth != this.renderer.domElement.width ||
            parentHeight != this.renderer.domElement.height

        if (needsResize) {
            this.renderer.setSize(parentWidth, parentHeight)
            this.composer.setSize(parentWidth, parentHeight)

            this.camera.aspect = parentWidth / parentHeight
            this.camera.updateProjectionMatrix()

            this.passes[1].setSize(parentWidth, parentHeight)

            // Save current control state and reset.
            // This prevents the rendered image from flickering.
            // Not sure why this is necessary.
            this.controls.saveState()
            this.controls.reset()
        }
    }

    public startAnimationLoop() {
        const controls = this.controls
        const composer = this.composer
        const gizmo = this.gizmo
        const handler = this.handler
        const cameraResetAction = this.cameraResetAction

        const clock = new Clock()

        const animate = () => {
            // Delta time in milliseconds.
            const delta = clock.getDelta() * 1e3

            this.resizeCanvas()

            cameraResetAction.advance(delta)

            handler.forEach((handler) => handler.perform(delta))

            controls.update()
            composer.render(delta)
            gizmo.render()
        }
        this.renderer.setAnimationLoop(animate)
    }

    /**
     * A a new action handler.
     * @param handler
     */
    registerActionHandler(handler: ActionHandler) {
        this.handler.push(handler)
    }

    /**
     * Creates and initializes the default camera for the 3D scene.
     * @returns The camera created for this engine.
     */
    private createCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(
            35,
            this.parent.clientWidth / this.parent.clientHeight,
            0.1,
            1000
        )
        // Set position.
        camera.position.x = CameraStartPosition.x
        camera.position.y = CameraStartPosition.y
        camera.position.z = CameraStartPosition.z

        camera.zoom = CameraZoomStart

        return camera
    }

    public resetCamera() {
        this.cameraResetAction.targetState =
            this.cameraResetAction.currentState + 1.0
    }

    public toggleRotation() {
        if (this.controls.autoRotateSpeed > 0) {
            this.controls.autoRotateSpeed = -this.controls.autoRotateSpeed
        } else if (this.controls.autoRotate) {
            this.controls.autoRotate = false
            this.controls.autoRotateSpeed = 0.0
        } else {
            this.controls.autoRotate = true
            this.controls.autoRotateSpeed = 2.0
        }
    }

    public getCameraRotation(): number {
        return this.controls.autoRotateSpeed
    }

    /**
     * Create and configure render passes required for postprocessing such as
     * the selection.
     */
    private createRenderPasses(): [
        renderPass: TAARenderPass,
        outlinePass: OutlinePass,
        outputPass: OutputPass,
    ] {
        // Create and configure passes.
        const taaRenderPass = new TAARenderPass(this.scene, this.camera)
        taaRenderPass.sampleLevel = 2
        taaRenderPass.setSize(this.parent.clientWidth, this.parent.clientHeight)

        const outputPass = new OutputPass()
        const outlinePass = new OutlinePass(
            new Vector2(this.parent.clientWidth, this.parent.clientHeight),
            this.scene,
            this.camera,
            []
        )
        outlinePass.edgeGlow = 0.0
        outlinePass.edgeThickness = 1.0
        outlinePass.edgeStrength = 2.0
        outlinePass.hiddenEdgeColor.setHex(0xffffff)
        outlinePass.visibleEdgeColor.setHex(0xffffff)
        outlinePass.clear = false

        return [taaRenderPass, outlinePass, outputPass]
    }

    /**
     * Create an OrbitControl.
     * Also sets limits for the oribit controls.
     * @returns The created OrbitControls
     */
    private createControls(): OrbitControls {
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        )

        controls.maxPolarAngle = Math.PI * 0.5
        controls.maxDistance = 3.0
        controls.minDistance = 0.3
        controls.maxTargetRadius = 2.0
        controls.enableDamping = true
        controls.rotateSpeed = 0.75

        controls.enablePan = false

        controls.autoRotate = false
        controls.autoRotateSpeed = 0.0

        return controls
    }

    /**
     * Creates a control gizmo and attaches it to the current controls.
     * @returns The created gizmo.
     */
    private createGizmo(): ViewportGizmo {
        const gizmo = new ViewportGizmo(this.camera, this.renderer, {
            placement: 'top-right',
            container: this.parent,
        })
        gizmo.attachControls(this.controls)

        return gizmo
    }
}
