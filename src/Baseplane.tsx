import { Circle } from '@react-three/drei'

import vertexShader from './shader/concentricGradientAlpha/vertexShader.glsl?raw'
import fragmentShader from './shader/concentricGradientAlpha/fragmentShader.glsl?raw'

function Baseplane() {
    return (
        <Circle
            args={[30]}
            position={[0, -2.001, 0]}
            rotation-x={-Math.PI / 2}
            receiveShadow
        >
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </Circle>
    )
}

export default Baseplane
