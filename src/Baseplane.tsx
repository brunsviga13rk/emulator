import { Circle, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

import vertexShader from './shader/concentricGradientAlpha/vertexShader.glsl?raw'
import fragmentShader from './shader/concentricGradientAlpha/fragmentShader.glsl?raw'

const ConcentricGradientAlphaMaterial = shaderMaterial(
    {},
    vertexShader,
    fragmentShader
)

extend({ ConcentricGradientAlphaMaterial })

function Baseplane() {
    return (
        <Circle
            args={[30]}
            position={[0, -2.001, 0]}
            rotation-x={-Math.PI / 2}
            receiveShadow
        >
            <concentricGradientAlphaMaterial />
        </Circle>
    )
}

export default Baseplane
