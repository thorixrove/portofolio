import { useGSAP } from '@gsap/react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { useMemo, useRef } from 'react';
import { Box3, Vector3 } from 'three';

const Target = (props) => {
    const targetRef = useRef()
    const { scene } = useGLTF('/models/model.glb')

    const centeredScene = useMemo(() => {
        if (!scene) return null

        const clonedScene = scene.clone()
        const box = new Box3().setFromObject(clonedScene)
        const center = new Vector3()
        const size = new Vector3()

        box.getCenter(center)
        box.getSize(size)

        const maxDimension = Math.max(size.x, size.y, size.z) || 1
        const desiredDimension = 3.2

        clonedScene.position.sub(center)
        clonedScene.scale.setScalar(desiredDimension / maxDimension)

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
            position={props.position ?? [4, -3, -3]}
            rotation={[0, Math.PI / 5, 0]}
            scale={1}
        >
            <primitive object={centeredScene} />
        </group>
    )
}

export default Target
