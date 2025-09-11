import { Scene } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Create a base plane mesh with a white gradient decreasing in opaqueness
 * towards the border.
 *
 * @returns An Object3D that is the base plane.
 */
export function createBaseplane(scene: Scene) {
    const loader = new GLTFLoader()
    loader.load(`${__APP_BASE_PATH__}/baseplane.glb`, (gltf) => {
        scene.add(gltf.scene)
    })
}
