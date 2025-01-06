import { Canvas, useLoader } from '@react-three/fiber'
import {
    ContactShadows,
    Environment,
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from '@react-three/drei'
import { Suspense } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Baseplane from './Baseplane.tsx'

function Brunsviga() {
    const gltf = useLoader(GLTFLoader, './brunsviga.glb')

    return (
        <>
            <primitive object={gltf.scene} />
        </>
    )
}

function Renderer() {
    return (
        <div className="flex flex-col h-screen gradient">
            <Canvas
                gl={{ alpha: true, premultipliedAlpha: false }}
                camera={{ position: [-8, 5, 8] }}
            >
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
                    <Baseplane />
                    <OrbitControls
                        target={[0, 0, 0]}
                        maxPolarAngle={Math.PI / 2.0}
                    />
                    <GizmoHelper alignment="top-right" margin={[80, 80]}>
                        <GizmoViewport
                            axisColors={['red', 'green', 'blue']}
                            labelColor="white"
                        />
                    </GizmoHelper>
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    )
}

export default Renderer
