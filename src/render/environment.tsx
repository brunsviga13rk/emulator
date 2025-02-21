import fragmentShader from '../shader/gradient/fragmentShader.glsl?raw'
import vertexShader from '../shader/gradient/vertexShader.glsl?raw'
import * as THREE from 'three'

export const environmentUniforms = {
    darkMode: { value: true },
}

export function createBackground(): THREE.Mesh {
    // Create quad spanning full canvas and fill with a simple gradient shader.
    // This is used as background for the scene.
    const backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4, 1, 1),
        new THREE.ShaderMaterial({
            uniforms: environmentUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        })
    )
    // Make sure the quad is rendered first and overwirtten by everyting else.
    backgroundMesh.material.depthWrite = false
    backgroundMesh.renderOrder = -99999

    return backgroundMesh
}
