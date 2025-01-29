import { useEffect } from 'react'
import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { createBaseplane } from './baseplane'
import { Engine } from './engine'
import { Brunsviga13rk } from './model/brunsviga13rk'
import fragmentShader from './shader/gradient/fragmentShader.glsl?raw'
import vertexShader from './shader/gradient/vertexShader.glsl?raw'

/**
 * Setup the environment by: creating an environment lighmap for PBR rendering,
 * add a static gradient background and add the base plane to the scene
 *
 * @param scene The scene to setup.
 */
function setupEnvironment(engine: Engine) {
    // Load environment texture.
    new RGBELoader().load('./studio_small_09_2k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        engine.scene.environment = texture
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

    engine.scene.add(myGradient)
    engine.scene.add(createBaseplane())
}

/**
 * Perform final setup tasks after the model has been loaded successfully.
 *
 * @param engine
 */
function postLoadSetup(engine: Engine) {
    // Loading of models successfull, finish setting up renderer.
    engine.attachCanvas()
    engine.startAnimationLoop()

    // Remote loading indicator.
    const loadingIndicator = document.getElementById('div-loading-indicator')

    if (!loadingIndicator) throw new Error('missing loading indicator')

    // Start fade animation by appending animation CSS class.
    loadingIndicator.className += ' fade-out'
    // When the animation finishes remove the indicator overlay.
    loadingIndicator.addEventListener(
        'animationend',
        () => {
            loadingIndicator.remove()
        },
        false
    )
}

function onLoadingError(error: unknown) {
    console.log(error)
}

/**
 * Initialize thee.js and setup the scene complete with environment illumination
 * and animation handler.
 * @param parent The parent DOM element the canvas is a child of.
 */
function initThree(parent: HTMLElement) {
    const engine = new Engine(parent)

    // Setup the environment lightmap, background and ground plate.
    setupEnvironment(engine)

    Brunsviga13rk.createInstance(
        engine,
        () => postLoadSetup(engine),
        onLoadingError
    )
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
    return <div id="renderer"></div>
}

export default Renderer
