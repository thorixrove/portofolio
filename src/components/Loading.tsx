import { Text } from '@react-three/drei';

const CanvasLoader = () => {
    return (
        <group position={[0, 0, 0]}>
            <Text
                position={[0, 0, 0]}
                fontSize={0.6}
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
