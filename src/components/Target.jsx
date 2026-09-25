import { useGSAP } from '@gsap/react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { useMemo, useRef } from 'react';
import { Box3, Vector3 } from 'three';

const Target = (props) => {
    const targetRef = useRef()
    const { scene } = useGLTF('/models/model_03.glb')

    const centeredScene = useMemo(() => {
        if (!scene) return null

        const clonedScene = scene.clone()
        const box = new Box3().setFromObject(clonedScene)
        const center = new Vector3()
        const size = new Vector3()

        box.getCenter(center)
        box.getSize(size)

        const maxDimension = Math.max(size.x, size.y, size.z) || 1
        const desiredDimension = 20
        const scaleFactor = desiredDimension / maxDimension

        clonedScene.rotation.y = -Math.PI / 1
        clonedScene.scale.setScalar(scaleFactor)
        clonedScene.position.copy(center).multiplyScalar(-scaleFactor)

        return clonedScene
    }, [scene])

    useGSAP(() => {
        if (!targetRef.current) return

        gsap.to(targetRef.current.position, {
            y: targetRef.current.position.y + 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
        })
    }, [])

    if (!centeredScene) return null

    return (
        <group
            {...props}
            ref={targetRef}
            position={props.position ?? [0, -1.2, 2]}
            rotation={props.rotation ?? [0, 3, 0]}
            scale={props.scale ?? 1}
        >
            <primitive object={centeredScene} />
        </group>
    )
}

export default Target