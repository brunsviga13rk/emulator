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
    Vector2,
    WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { OutlinePass } from 'three/examples/jsm/Addons.js'
import { Brunsviga13rk } from './model/brunsviga13rk'
import { Engine } from './engine'

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
 * Initialize thee.js and setup the scene complete with environment illumination
 * and animation handler.
 * @param parent The parent DOM element the canvas is a child of.
 */
function initThree(parent: HTMLElement) {
    const engine = new Engine(parent)

    // Setup the environment lightmap, background and ground plate.
    setupEnvironment(engine)

    const brunsviga = new Brunsviga13rk(engine)
    engine.registerActionHandler(brunsviga)
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
