import { Canvas, ThreeEvent, useLoader, useThree } from '@react-three/fiber'
import {
    ContactShadows,
    Environment,
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    useCursor,
} from '@react-three/drei'
import { Suspense, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Baseplane from './Baseplane.tsx'
import {
    Selection,
    Select,
    EffectComposer,
    Outline,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

function BrunsvigaSelectable({ name = '' }) {
    const { scene } = useLoader(GLTFLoader, './brunsviga.glb')
    const object = scene.getObjectByName(name)!

    const [hovered, setHover] = useState(false)
    useCursor(hovered)

    const { camera } = useThree()
    const three_scene = useThree().scene
    const raycaster = new THREE.Raycaster()

    const selectionHandler = (event: ThreeEvent<PointerEvent>) => {
        const canvas = document.getElementById('canvas')

        if (canvas) {
            const rect = canvas.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 2.0 - 1.0
            const y = ((event.clientY - rect.top) / rect.height) * -2.0 + 1.0

            raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

            const intersections = raycaster.intersectObjects(
                three_scene.children
            )

            if (intersections.length) {
                const firstHit = intersections[0].object
                setHover(firstHit.name == name || firstHit.parent?.name == name)
            } else {
                setHover(false)
            }
        }
    }

    return (
        <Select enabled={hovered}>
            <primitive
                onPointerMove={selectionHandler}
                onPointerOut={() => setHover(false)}
                object={object}
            ></primitive>
        </Select>
    )
}

function Brunsviga() {
    const staticAssets = ['body', 'rubber', 'gear']
    const { scene } = useLoader(GLTFLoader, './brunsviga.glb')

    return (
        <mesh>
            <Selection>
                <EffectComposer autoClear={false}>
                    <Outline
                        blur
                        visibleEdgeColor={0xffffff}
                        hiddenEdgeColor={0x000000}
                        edgeStrength={50}
                        width={2000}
                        blendFunction={BlendFunction.SCREEN}
                    />
                </EffectComposer>
                <BrunsvigaSelectable name="sled" />
                <BrunsvigaSelectable name="crank" />
                <BrunsvigaSelectable name="crank_handle" />
                <BrunsvigaSelectable name="sledge_handle" />
                <BrunsvigaSelectable name="deletion" />
                <BrunsvigaSelectable name="input_block_slider" />
                <BrunsvigaSelectable name="result_deletionn_lever" />
                <BrunsvigaSelectable name="singlehand_control" />
                <BrunsvigaSelectable name="count_sign_plate" />
                <BrunsvigaSelectable name="total_deletion_lever" />
                <BrunsvigaSelectable name="count_deletion_lever" />
                <BrunsvigaSelectable name="result_commata_1" />
                <BrunsvigaSelectable name="result_commata_2" />
                <BrunsvigaSelectable name="result_commata_3" />
                <BrunsvigaSelectable name="input_commata_1" />
                <BrunsvigaSelectable name="input_commata_2" />
                <BrunsvigaSelectable name="count_commata_1" />
                <BrunsvigaSelectable name="count_commata_2" />
            </Selection>
            {staticAssets.map((name, index) => (
                <primitive
                    key={index}
                    object={scene.getObjectByName(name)!}
                ></primitive>
            ))}
        </mesh>
    )
}

function Renderer() {
    return (
        <div className="flex flex-col h-screen gradient">
            <Canvas
                id="canvas"
                gl={{ alpha: true, premultipliedAlpha: false }}
                camera={{ position: [-8, 5, 8], zoom: 3.5 }}
            >
                <Suspense fallback={null}>
                    <Environment files="./studio_small_09_2k.hdr" />
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
                        makeDefault
                    />
                    <GizmoHelper
                        alignment="top-right"
                        margin={[80, 80]}
                        renderPriority={100}
                    >
                        <GizmoViewport
                            axisColors={['red', 'green', 'blue']}
                            labelColor="white"
                        />
                    </GizmoHelper>
                    <Brunsviga />
                </Suspense>
                <Stats />
            </Canvas>
        </div>
    )
}

export default Renderer
