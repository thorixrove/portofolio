import { useGSAP } from '@gsap/react';
import { Center, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useCallback, useRef } from 'react';

const Rings = ({ position = [0, 0, 0], scale = 0.5 }) => {
    const refList = useRef([])
    const getReF = useCallback((mesh) => {
        if (mesh && !refList.current.includes(mesh)) {
            refList.current.push(mesh)
        }
    }, [])

    const texture = useTexture('textures/rings.png')

    useGSAP(() => {
        if (refList.current.length === 0) return

        gsap
            .timeline({
                repeat: -1,
                repeatDelay: 0.5,
            })
            .to(
                refList.current.map((r) => r.rotation),
                {
                    y: `+=${Math.PI * 2}`,
                    x: `-=${Math.PI * 2}`,
                    stagger: {
                        each: 0.15,
                    },
                },
            )
    }, [])

    return (
        <group position={position}>
            <Center>
                <group scale={scale}>
                    {Array.from({ length: 4}, (_, index) => (
                        <mesh key={index} ref={getReF}>
                            <torusGeometry args={[(index + 1) * 0.5, 0.1]}></torusGeometry>
                            <meshMatcapMaterial matcap={texture} toneMapped={false}/>
                        </mesh>
                    ))}
                </group>
            </Center>
        </group>
    )
}

export default Rings