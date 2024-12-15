import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
    Clone,
    ContactShadows,
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
} from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Baseplane from './Baseplane.tsx'

function Gear(props: any) {
    const gltf = useLoader(GLTFLoader, './gear.glb')

    const gear1Ref = useRef<any>()
    const gear2Ref = useRef<any>()

    const speed = 2.5

    useFrame(({ clock }) => {
        gear1Ref.current.rotation.z =
            clock.getElapsedTime() * speed +
            Math.sin(clock.getElapsedTime()) * speed
        gear2Ref.current.rotation.z =
            -clock.getElapsedTime() * speed -
            Math.sin(clock.getElapsedTime()) * speed
    })

    return (
        <>
            <Clone ref={gear1Ref} {...props} object={gltf.scene} />
            <Clone
                ref={gear2Ref}
                position={[2.5, 0, 0]}
                {...props}
                object={gltf.scene}
            />
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
                    <ambientLight />
                    <directionalLight />
                    <Gear />
                    <ContactShadows
                        scale={60}
                        position={[0, -2, 0]}
                        opacity={2.0}
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
            </Canvas>
        </div>
    )
}

export default Renderer
