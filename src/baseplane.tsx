import vertexShader from './shader/concentricGradientAlpha/vertexShader.glsl?raw'
import fragmentShader from './shader/concentricGradientAlpha/fragmentShader.glsl?raw'
import {
    Mesh,
    NormalBlending,
    Object3D,
    PlaneGeometry,
    ShaderMaterial,
} from 'three'

/**
 * Radius of the base plane.
 */
const BASE_PLANE_RADIUS = 16

/**
 * Create a base plane mesh with a white gradient decreasing in opaqueness
 * towards the border.
 *
 * @returns An Object3D that is the base plane.
 */
export function createBaseplane(): Object3D {
    const plane = new PlaneGeometry(BASE_PLANE_RADIUS, BASE_PLANE_RADIUS, 1, 1)
    const mesh = new Mesh(
        plane,
        new ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: NormalBlending,
            transparent: true,
        })
    )

    // Rotate base plane so that its orientation matches that of a logical "ground".
    mesh.rotation.x = -Math.PI * 0.5
    // Move down one unit as the Brunsviga mesh will extend downwards by one.
    mesh.position.y = -1

    return mesh
}