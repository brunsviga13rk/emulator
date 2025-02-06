import {
    Clock,
    OrthographicCamera,
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
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ActionHandler } from '../actionHandler'

/**
 * Manages the core componentes and state required for rendering the basic scene.
 */
export class Engine {
    parent: HTMLElement
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera | OrthographicCamera
    composer: EffectComposer
    passes: [
        renderPass: RenderPass,
        outlinePass: OutlinePass,
        outputPass: OutputPass,
    ]
    controls: OrbitControls
    gizmo!: ViewportGizmo
    handler: ActionHandler[]

    constructor(parent: HTMLElement) {
        this.parent = parent
        this.handler = []
        this.renderer = new WebGLRenderer()
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

    public startAnimationLoop() {
        const controls = this.controls
        const composer = this.composer
        const gizmo = this.gizmo
        const handler = this.handler

        const clock = new Clock()

        function animate() {
            // Delta time in milliseconds.
            const delta = clock.getDelta() * 1e3
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
    private createCamera(): PerspectiveCamera | OrthographicCamera {
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
        renderPass: RenderPass,
        outlinePass: OutlinePass,
        outputPass: OutputPass,
    ] {
        // Create and configure passes.

        const renderPass = new RenderPass(this.scene, this.camera)
        const outputPass = new OutputPass()
        const outlinePass = new OutlinePass(
            new Vector2(
                this.parent.clientWidth / 4,
                this.parent.clientHeight / 4
            ),
            this.scene,
            this.camera,
            []
        )
        outlinePass.edgeStrength = 50.0
        outlinePass.hiddenEdgeColor.setHex(0xffffff)
        outlinePass.visibleEdgeColor.setHex(0xffffff)

        return [renderPass, outlinePass, outputPass]
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
        controls.maxDistance = 12.0
        controls.minDistance = 4.0
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
