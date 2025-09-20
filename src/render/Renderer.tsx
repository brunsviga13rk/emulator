import { memo, useEffect, useState } from 'react'
import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { createBaseplane } from '../baseplane'
import { Engine } from './engine'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import ActionRecommendations from './ActionRecommendations'
import classes from '../styles.module.css'
import { Box } from '@mantine/core'
import { setLoadingEvent } from '../LoadingIndicator'

/**
 * Configures the shadow map in a Three.WebGLRenderer.
 *
 * This function sets the shadow map to enable shadows and defines the shadow
 * map type to be PCFSoftShadowMap.
 */
function configureShadows(renderer: THREE.WebGLRenderer): void {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
}

/**
 * Sets up a directional light in the scene.
 *
 * This function creates a directional light object and configures its
 * properties.
 *
 */
function setupKeyLights(engine: Engine) {
    const light = new THREE.DirectionalLight()

    light.castShadow = true
    light.intensity = 3.0

    light.position.z = 0.6
    light.position.x = 0.8

    light.shadow.mapSize.width = 512
    light.shadow.mapSize.height = 512
    light.shadow.camera.left = -0.25
    light.shadow.camera.top = -0.25
    light.shadow.camera.right = 0.25
    light.shadow.camera.bottom = 0.25
    light.shadow.camera.near = 0.01
    light.shadow.camera.far = 10
    light.shadow.bias = -0.0005

    engine.scene.add(light)
}

/**
 * Setup the environment by: creating an environment lighmap for PBR rendering,
 * add a static gradient background and add the base plane to the scene
 *
 * @param scene The scene to setup.
 */
function setupEnvironment(engine: Engine) {
    // Load environment texture.
    new RGBELoader().load(
        `${window.location.origin}/${__APP_BASE_PATH__}/studio_small_09_2k.hdr`,
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            engine.scene.environment = texture
        },
        function (xhr) {
            setLoadingEvent({
                title: 'Loading environment',
                progress: xhr.loaded / xhr.total,
            })
        }
    )

    configureShadows(engine.renderer)

    setupKeyLights(engine)

    createBaseplane(engine.scene)
}

/**
 * Perform final setup tasks after the model has been loaded successfully.
 *
 * @param engine
 */
function postLoadSetup(engine: Engine) {
    let progress = 0.0

    const intervalId = setInterval(() => {
        progress += 0.25
        setLoadingEvent({
            title: 'Lubricating machine...',
            progress: progress,
        })
    }, 500)

    setTimeout(() => {
        clearInterval(intervalId) // Stops the interval after 2 seconds
    }, 2000)

    // Loading of models successfull, finish setting up renderer.
    engine.attachCanvas()
    engine.startAnimationLoop()

    // Remote loading indicator.
    const loadingIndicator = document.getElementById('div-loading-indicator')
    const textLogo = document.getElementById('text-logo-loading-indicator')

    if (!loadingIndicator) throw new Error('missing loading indicator')
    if (!textLogo) throw new Error('missing text logo')

    textLogo.className += ' jump'

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
    const engine = Engine.new(parent)

    // Setup the environment lightmap, background and ground plate.
    setupEnvironment(engine)

    Brunsviga13rk.initInstance(
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

const Renderer = memo(() => {
    const [name] = useState('renderer-init')

    useEffect(() => {
        // call api or anything
        setupRenderer()
    }, [name])

    return (
        <Box
            id="wrapper"
            style={{
                display: 'flex',
                width: '100%',
                flex: '1 1 0',
                minWidth: 0,
                height: '100%',
            }}
            className={classes.contentPane}
        >
            <ActionRecommendations />
            <div
                id="renderer"
                style={{
                    overflow: 'auto',
                    flex: '1 1 0',
                    minWidth: 0,
                    width: '100%',
                    height: '100%',
                }}
            ></div>
        </Box>
    )
})

export default Renderer
