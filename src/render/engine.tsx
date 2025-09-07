import {
    ACESFilmicToneMapping,
    Clock,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer,
} from 'three'
import { ViewportGizmo } from 'three-viewport-gizmo'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ActionHandler } from '../actionHandler'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js'

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

    constructor(parent: HTMLElement) {
        this.parent = parent
        this.handler = []
        this.renderer = new WebGLRenderer({
            antialias: true,
        })
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

        const clock = new Clock()

        const animate = () => {
            // Delta time in milliseconds.
            const delta = clock.getDelta() * 1e3

            this.resizeCanvas()

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
        camera.position.x = -6
        camera.position.y = 3
        camera.position.z = 3

        return camera
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
        outlinePass.edgeStrength = 25.0
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
        controls.maxDistance = 0.5
        controls.minDistance = 0.3
        controls.maxTargetRadius = 2.0
        controls.enableDamping = true
        controls.rotateSpeed = 0.75

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
