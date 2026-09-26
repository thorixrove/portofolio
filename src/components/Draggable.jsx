import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { interactionState } from '../utils/dragState.js';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

// Kalau titik (x,y) jatuh di dalam box terlarang, dorong ke tepi box
// terdekat supaya elemen tidak pernah "masuk" ke area itu (mis. model).
const pushOutsideBox = (x, y, box) => {
    if (!box) return { x, y }
    const { xMin, xMax, yMin, yMax } = box
    const inside = x > xMin && x < xMax && y > yMin && y < yMax
    if (!inside) return { x, y }

    const distLeft = x - xMin
    const distRight = xMax - x
    const distTop = yMax - y
    const distBottom = y - yMin
    const minDist = Math.min(distLeft, distRight, distTop, distBottom)

    if (minDist === distLeft) return { x: xMin, y }
    if (minDist === distRight) return { x: xMax, y }
    if (minDist === distTop) return { x, y: yMax }
    return { x, y: yMin }
}

const Draggable = ({
    children,
    initialPosition = [0, 0, 0],
    hitArea = [2.2, 2.2, 1.4],
    driftStrength = 0.7,
    driftSpeedX = 1.3,
    driftSpeedY = 1.1,
    // Batas eksplisit dalam world unit (opsional, override edgeInset di bawah)
    // Format: { x: [min, max], y: [min, max] }
    bounds,
    // Jarak aman dari tepi viewport, dalam FRACTION (0-1) dari lebar/tinggi
    // viewport. top diperbesar supaya elemen tidak menutupi navbar.
    edgeInset = { top: 0.14, bottom: 0.1, left: 0.03, right: 0.03 },
    // Kotak "terlarang" di tengah layar (area model), dalam fraction (0-1)
    // dihitung dari kiri & atas viewport. Set ke null kalau tidak perlu.
    avoidBox = { left: 0.24, right: 0.72, top: 0.44, bottom: 0.97 },
    ...props
}) => {
    const group = useRef()
    const {size, viewport} = useThree()
    const dragging = useRef(false)
    const start = useRef({ x: 0, y: 0, posX:0, posY: 0})
    const basePosition = useRef([...initialPosition])

    const factorX = viewport.width / size.width
    const factorY = viewport.height / size.height

    const getBounds = () => {
        if (bounds) return bounds
        return {
            x: [
                -viewport.width / 2 + edgeInset.left * viewport.width,
                viewport.width / 2 - edgeInset.right * viewport.width,
            ],
            y: [
                -viewport.height / 2 + edgeInset.bottom * viewport.height,
                viewport.height / 2 - edgeInset.top * viewport.height,
            ],
        }
    }

    const getAvoidBoxWorld = () => {
        if (!avoidBox) return null
        return {
            xMin: -viewport.width / 2 + avoidBox.left * viewport.width,
            xMax: -viewport.width / 2 + avoidBox.right * viewport.width,
            yMax: viewport.height / 2 - avoidBox.top * viewport.height,
            yMin: viewport.height / 2 - avoidBox.bottom * viewport.height,
        }
    }

    const constrain = (x, y) => {
        const { x: [xMin, xMax], y: [yMin, yMax] } = getBounds()
        let cx = clamp(x, xMin, xMax)
        let cy = clamp(y, yMin, yMax)
        const pushed = pushOutsideBox(cx, cy, getAvoidBoxWorld())
        return [pushed.x, pushed.y]
    }

    useEffect(() => {
        if (!group.current) return
        const [cx, cy] = constrain(initialPosition[0], initialPosition[1])
        group.current.position.set(cx, cy, initialPosition[2] ?? 0)
        basePosition.current = [cx, cy, initialPosition[2] ?? 0]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPosition])

    useFrame((state) => {
        if (!group.current || dragging.current) return

        const t = state.clock.elapsedTime
        const driftX = Math.sin(t * driftSpeedX + basePosition.current[0]) * driftStrength
        const driftY = Math.cos(t * driftSpeedY + basePosition.current[1]) * (driftStrength * 0.75)

        const [x, y] = constrain(basePosition.current[0] + driftX, basePosition.current[1] + driftY)
        group.current.position.x = x
        group.current.position.y = y
        group.current.position.z = basePosition.current[2] ?? 0
    })

    const handlePointerDown = (e) => {
        e.stopPropagation()
        e.target.setPointerCapture(e.pointerId)
        dragging.current = true
        interactionState.draggingElement = true
        start.current = {
            x: e.clientX,
            y: e.clientY,
            posX: group.current.position.x,
            posY: group.current.position.y,
        }
        basePosition.current = [group.current.position.x, group.current.position.y, group.current.position.z]
        document.body.style.cursor = 'grabbing'
    }

    const handlePointerMove = (e) => {
        if (!dragging.current || !group.current) return
        e.stopPropagation()
        const deltaX = (e.clientX - start.current.x) * factorX
        const deltaY = (e.clientY - start.current.y) * factorY

        const [nextX, nextY] = constrain(start.current.posX + deltaX, start.current.posY - deltaY)

        group.current.position.x = nextX
        group.current.position.y = nextY
        basePosition.current = [nextX, nextY, group.current.position.z]
    }

    const handlePointerUp = (e) => {
        if (e) e.stopPropagation()
        try { e?.target?.releasePointerCapture?.(e.pointerId) } catch (err) {}
        dragging.current = false
        interactionState.draggingElement = false
        document.body.style.cursor = 'grab'
    }

    return (
        <group
        ref={group}
        position={initialPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerOver={() => { if (!dragging.current) document.body.style.cursor = 'grab'}}
        onPointerOut={() => { if (!dragging.current) document.body.style.cursor = 'auto'}}
        {...props}
        >
            <mesh position={[0, 0, 0.15]}>
                <boxGeometry args={hitArea} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {children}
        </group>
    )
}

export default Draggable