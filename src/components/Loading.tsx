import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

const CanvasLoader = () => {
    const ringRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.z -= delta * 4;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Icon lingkaran berputar (spinner) — ring dengan celah, diputar tiap frame */}
            <mesh ref={ringRef} scale={0.75}>
                <ringGeometry args={[0.2, 0.3, 32, 1, 0, Math.PI * 1.5]} />
                <meshBasicMaterial color="#F1F1F1" side={2} toneMapped={false} transparent opacity={0.1} />
            </mesh>

            <Text
                position={[0, -0.7, 0]}
                fontSize={0.1}
                color="#F1F1F1"
                anchorX="center"
                anchorY="middle"
            >
                Loading...
            </Text>
        </group>
    )
}

export default CanvasLoader