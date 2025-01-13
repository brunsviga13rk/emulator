import { useEffect } from 'react'
import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import vertexShader from './shader/gradient/vertexShader.glsl?raw'
import fragmentShader from './shader/gradient/fragmentShader.glsl?raw'
import { createBaseplane } from './baseplane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ViewportGizmo } from 'three-viewport-gizmo'
import {
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from 'three'

/**
 * Creates and initializes the default camera for the 3D scene.
 *
 * @returns The perspective camera.
 */
function createCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
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
 * Create an OrbitControl and a ViewportGizmo.
 * Also sets limits for the oribit controls.
 *
 * @param camera The scenes camera.
 * @param renderer Renderer used.
 * @returns Both the OrbitControls and the Viewport gizmo.
 */
function createControlGizmo(
    camera: PerspectiveCamera | OrthographicCamera,
    renderer: WebGLRenderer
): [OrbitControls, ViewportGizmo] {
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI * 0.5
    controls.maxDistance = 12.0
    controls.minDistance = 4.0
    controls.maxTargetRadius = 2.0
    controls.enableDamping = true
    controls.rotateSpeed = 0.75

    const gizmo = new ViewportGizmo(camera, renderer, { offset: { top: 80 } })
    gizmo.attachControls(controls)

    return [controls, gizmo]
}

/**
 * Setup the environment by: creating an environment lighmap for PBR rendering,
 * add a static gradient background and add the base plane to the scene
 *
 * @param scene The scene to setup.
 */
function setupEnvironment(scene: Scene) {
    // Load environment texture.
    new RGBELoader().load('./studio_small_09_2k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
    })

    // Create quad spanning full canvas and fill with a simple gradient shader.
    // This is used as background for the scene.
    const myGradient = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4, 1, 1),
        new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })
    )
    // Make sure the quad is rendered first and overwirtten by everyting else.
    myGradient.material.depthWrite = false
    myGradient.renderOrder = -99999

    scene.add(myGradient)
    scene.add(createBaseplane())
}

/**
 * Initialize thee.js and setup the scene complete with environment illumination
 * and animation handler.
 * @param parent The parent DOM element the canvas is a child of.
 */
function initThree(parent: HTMLElement) {
    const renderer = new WebGLRenderer({ antialias: true })

    renderer.setSize(parent.clientWidth, parent.clientHeight)
    renderer.setAnimationLoop(animate)

    // Add canvas used by WebGL to renderer.
    // Check if there is already a child. In case there is replace the first child
    // with the new canvas, else append the canvas.
    if (parent.hasChildNodes()) {
        parent.replaceChild(renderer.domElement, parent.firstChild!)
    } else {
        parent.appendChild(renderer.domElement)
    }

    // Create core components.
    const scene = new Scene()
    const camera = createCamera()
    const [controls, gizmo] = createControlGizmo(camera, renderer)

    // Setup the environment lightmap, background and ground plate.
    setupEnvironment(scene)

    const loader = new GLTFLoader()
    loader.load(
        './brunsviga.glb',
        function (gltf) {
            scene.add(gltf.scene)
        },
        undefined,
        function (error) {
            console.error(error)
        }
    )

    function animate() {
        controls.update()
        renderer.render(scene, camera)
        gizmo.render()
    }
}

/**
 * Initialize the renderer component with the 3D scene.
 * @remarks
 * In case WebGL 2 is not supported only a warning banner is added to the renderer.
 */
function setupRenderer() {
    const rendererElement = document.getElementById('renderer')

    if (rendererElement) {
        // Check if WebGL 2 is available.
        if (WebGL.isWebGL2Available()) {
            // Initialize Three.js and setup scene.
            initThree(rendererElement)
        } else {
            rendererElement.appendChild(WebGL.getWebGL2ErrorMessage())
        }
    }
}

function Renderer() {
    useEffect(() => {
        // call api or anything
        setupRenderer()
    })
    return <div className="h-full" id="renderer"></div>
}

export default Renderer
