import { memo } from 'react'
import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { createBaseplane } from '../baseplane'
import { Engine } from './engine'
import { Brunsviga13rk } from '../model/brunsviga13rk'
import Toolbox from './Toolbox'
import Box from '@mui/material/Box'
import ActionRecommendations from './ActionRecommendations'
import { createBackground } from './environment'
import { useColorScheme } from '@mui/material'
import { environmentUniforms } from './environment'
import { isDarkMode, useRunOnce } from '../utils'

/**
 * Setup the environment by: creating an environment lighmap for PBR rendering,
 * add a static gradient background and add the base plane to the scene
 *
 * @param scene The scene to setup.
 */
function setupEnvironment(engine: Engine) {
    // Load environment texture.
    new RGBELoader().load(
        `${__APP_BASE_PATH__}/studio_small_09_2k.hdr`,
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            engine.scene.environment = texture
        }
    )

    engine.scene.add(createBackground())
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
    const engine = new Engine(parent)

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
    const { mode } = useColorScheme()

    useRunOnce(() => {
        // Initialize color for 3D environment.
        environmentUniforms.darkMode.value = isDarkMode(mode)

        // call api or anything
        setupRenderer()
    }, 'init-renderer')

    return (
        <Box
            sx={{
                position: 'relative',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: '100%',
            }}
        >
            <Toolbox />
            <ActionRecommendations />
            <Box
                id="renderer"
                sx={{
                    height: '100%',
                }}
            ></Box>
        </Box>
    )
})

export default Renderer
