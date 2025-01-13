import { useEffect } from 'react'
import * as THREE from 'three'

function initThree(parent: HTMLElement) {
    const renderer = new THREE.WebGLRenderer()

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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    function animate() {
        renderer.render(scene, camera)
    }
}

function setupRenderer() {
    const rendererElement = document.getElementById('renderer')

    if (rendererElement) {
        // Initialize Three.js and setup scene.
        initThree(rendererElement)
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
