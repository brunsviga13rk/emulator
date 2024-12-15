import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
    Circle,
    Clone,
    ContactShadows,
    Environment,
    EnvironmentMap,
    OrbitControls,
    Stats,
} from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Brunsviga(props: any) {
    const gltf = useLoader(GLTFLoader, './brunsviga.glb')

    return (
        <>
            <primitive object={gltf.scene} />
        </>
    )
}

function Renderer() {
    return (
        <div className="flex-grow flex-1 h-full m-0 gradient">
            <Canvas camera={{ position: [-8, 5, 8] }}>
                <Suspense fallback={null}>
                    <Environment files="./studio_small_09_2k.hdr" />
                    <Brunsviga />
                    <ContactShadows
                        scale={60}
                        position={[0, -1.0, 0]}
                        opacity={1.0}
                        blur={2}
                        resolution={512}
                    />
                    <Circle
                        args={[10]}
                        position={[0, -1.001, 0]}
                        rotation-x={-Math.PI / 2}
                        receiveShadow
                    >
                        <meshBasicMaterial color={[0.8, 0.8, 0.8]} />
                    </Circle>
                    <OrbitControls
                        target={[0, 0, 0]}
                        maxPolarAngle={Math.PI / 2.0}
                    />
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    )
}

export default Renderer
