import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

const HeroCamera = ({ isMobile, children}) => {
    const group = useRef()

    useFrame((state, delta) => {
        // Kamera tetap di posisi awal (z=30), tidak di-zoom ke 20,
        // supaya ukuran semua elemen tetap sesuai yang sudah di-tuning
        easing.damp3(state.camera.position, [0, 0, 30], 0.25, delta)

        if (!isMobile) {
            easing.dampE(group.current.rotation, [-state.pointer.y / 3, state.pointer.x / 5, 0], 0.25, delta)
        }
    })

  return  <group ref={group}>{children}</group>
}
export default HeroCamera