import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useRef } from 'react';
import { interactionState } from '../utils/dragState.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const HeroCamera = ({ isMobile, children }) => {
    const group = useRef(null)
    const pointer = useRef({ x: 0, y: 0 })
    const dragState = useRef({ active: false, x: 0, y: 0 })
    const throwVelocity = useRef({ x: 0, y: 0 })
    const targetRotation = useRef([0, 0, 0])

    useEffect(() => {
        const handlePointerMove = (e) => {
            // Parallax halus tetap jalan terus, walau lagi drag elemen lain.
            // Kalau user sedang menggeser object 3D, model utama tidak ikut ikut berotasi.
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
            pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1

            if (interactionState.draggingElement || !dragState.current.active) return

            const deltaX = (e.clientX - dragState.current.x) * 0.006
            const deltaY = (e.clientY - dragState.current.y) * 0.006

            dragState.current.x = e.clientX
            dragState.current.y = e.clientY

            throwVelocity.current.x = deltaX
            throwVelocity.current.y = -deltaY

            targetRotation.current[1] += deltaX
            targetRotation.current[0] += -deltaY
            targetRotation.current[0] = clamp(targetRotation.current[0], -0.8, 0.8)
            targetRotation.current[1] = clamp(targetRotation.current[1], -1.4, 1.4)
        }

        const handlePointerDown = (e) => {
            // Cuma ini yang di-guard: jangan mulai "grab & throw" model
            // kalau pointerdown-nya sebenarnya buat narik elemen lain.
            if (interactionState.draggingElement) return

            dragState.current.active = true
            dragState.current.x = e.clientX
            dragState.current.y = e.clientY
            throwVelocity.current.x = 0
            throwVelocity.current.y = 0
        }

        const handlePointerUp = () => {
            dragState.current.active = false
        }

        const handleTouchMove = (e) => {
            if (e.touches.length === 0) return
            const touch = e.touches[0]
            pointer.current.x = (touch.clientX / window.innerWidth) * 2 - 1
            pointer.current.y = -(touch.clientY / window.innerHeight) * 2 + 1

            if (interactionState.draggingElement || !dragState.current.active) return

            const deltaX = (touch.clientX - dragState.current.x) * 0.006
            const deltaY = (touch.clientY - dragState.current.y) * 0.006

            dragState.current.x = touch.clientX
            dragState.current.y = touch.clientY

            throwVelocity.current.x = deltaX
            throwVelocity.current.y = -deltaY

            targetRotation.current[1] += deltaX
            targetRotation.current[0] += -deltaY
            targetRotation.current[0] = clamp(targetRotation.current[0], -0.8, 0.8)
            targetRotation.current[1] = clamp(targetRotation.current[1], -1.4, 1.4)
        }

        const handleTouchStart = (e) => {
            if (interactionState.draggingElement) return
            if (e.touches.length === 0) return
            const touch = e.touches[0]
            dragState.current.active = true
            dragState.current.x = touch.clientX
            dragState.current.y = touch.clientY
            throwVelocity.current.x = 0
            throwVelocity.current.y = 0
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        window.addEventListener('pointerdown', handlePointerDown, { passive: true })
        window.addEventListener('pointerup', handlePointerUp, { passive: true })
        window.addEventListener('pointerleave', handlePointerUp, { passive: true })
        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        window.addEventListener('touchend', handlePointerUp, { passive: true })

        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointerup', handlePointerUp)
            window.removeEventListener('pointerleave', handlePointerUp)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handlePointerUp)
        }
    }, [])

    useFrame((state, delta) => {
        easing.damp3(state.camera.position, [0, 0, 30], 0.25, delta)

        const factor = isMobile ? 0.6 : 1

        if (!dragState.current.active) {
            targetRotation.current[1] += throwVelocity.current.x
            targetRotation.current[0] += throwVelocity.current.y
            throwVelocity.current.x *= 0.92
            throwVelocity.current.y *= 0.92

            // Proporsi parallax dikecilkan dikit (dulu /8 dan /5) supaya
            // gerakannya halus & pas, gak "berebut" kesan sama elemen
            // yang lagi di-drag.
            const hoverX = (pointer.current.x / 10) * factor
            const hoverY = (-pointer.current.y / 7) * factor

            targetRotation.current[0] = targetRotation.current[0] * 0.9 + hoverY * 0.1
            targetRotation.current[1] = targetRotation.current[1] * 0.9 + hoverX * 0.1
            targetRotation.current[2] = 0
        }

        targetRotation.current[0] = clamp(targetRotation.current[0], -0.8, 0.8)
        targetRotation.current[1] = clamp(targetRotation.current[1], -1.4, 1.4)

        if (group.current) {
            easing.dampE(group.current.rotation, targetRotation.current, 0.16, delta)
        }
    })

    return <group ref={group}>{children}</group>
}
export default HeroCamera