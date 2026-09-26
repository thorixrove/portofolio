import { useGSAP } from '@gsap/react';
import { useGLTF, useTexture, useVideoTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, CanvasTexture, PlaneGeometry, Color, Quaternion, Vector3 } from 'three';

/**
 * Bikin plane melengkung (cembung di tengah, rata di pinggir) mirip
 * layar CRT — subdivided PlaneGeometry lalu tiap vertex digeser di
 * sumbu Z sesuai jaraknya dari tengah (bentuk elips/lensa).
 */
function createCurvedPlaneGeometry(width, height, curvature, segments = 24, concavity = {}) {
    const { top = 0, bottom = 0, left = 0, right = 0 } = concavity
    const geometry = new PlaneGeometry(width, height, segments, segments)
    const pos = geometry.attributes.position

    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const nx = x / (width / 2) // -1 (kiri) ... +1 (kanan)
        const ny = y / (height / 2) // -1 (bawah) ... +1 (atas)
        const d = nx * nx + ny * ny
        const bulge = Math.max(0, 1 - d)

        // Bagian tengah tetap cembung normal (bulge). Untuk tiap sisi (atas,
        // bawah, kiri, kanan), kurangi/lesakkan ke belakang sesuai
        // concavity-nya masing-masing — makin dekat ke tepi sisi itu makin
        // cekung. Keempatnya independen jadi bisa dikombinasikan.
        const bottomFactor = Math.max(0, -ny)
        const topFactor = Math.max(0, ny)
        const leftFactor = Math.max(0, -nx)
        const rightFactor = Math.max(0, nx)

        const dip = curvature * (
            bottom * bottomFactor * bottomFactor +
            top * topFactor * topFactor +
            left * leftFactor * leftFactor +
            right * rightFactor * rightFactor
        )

        pos.setZ(i, curvature * bulge - dip)
    }

    geometry.computeVertexNormals()
    return geometry
}

/**
 * Bikin canvas mask hitam-putih (rounded rect), dipakai sebagai
 * alphaMap supaya sudut plane kelihatan membulat walau geometry
 * aslinya persegi biasa.
 */
function createRoundedAlphaCanvas(width, height, radius) {
    const canvasSize = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext('2d')

    const w = canvasSize
    const h = canvasSize
    const r = Math.min((radius / Math.max(width, height)) * canvasSize, w / 2, h / 2)

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.lineTo(w - r, 0)
    ctx.quadraticCurveTo(w, 0, w, r)
    ctx.lineTo(w, h - r)
    ctx.quadraticCurveTo(w, h, w - r, h)
    ctx.lineTo(r, h)
    ctx.quadraticCurveTo(0, h, 0, h - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
    ctx.closePath()
    ctx.fill()

    return canvas
}

const useRoundedAlphaMap = (width, height, radius) => {
    return useMemo(() => {
        const canvas = createRoundedAlphaCanvas(width, height, radius)
        const texture = new CanvasTexture(canvas)
        texture.needsUpdate = true
        return texture
    }, [width, height, radius])
}

const VideoPlane = ({ position, quaternion, width, height, radius, curvature, concavity, src }) => {
    const texture = useVideoTexture(src, {
        muted: true,
        loop: true,
        start: true,
    })

    const geometry = useMemo(
        () => createCurvedPlaneGeometry(width, height, curvature, 24, concavity),
        [width, height, curvature, concavity]
    )
    const alphaMap = useRoundedAlphaMap(width, height, radius)

    return (
        <mesh position={position} quaternion={quaternion} geometry={geometry}>
            <meshBasicMaterial
                map={texture}
                alphaMap={alphaMap}
                transparent
                toneMapped={false}
                side={2}
            />
        </mesh>
    )
}

const PhotoPlane = ({ position, quaternion, width, height, radius, curvature, concavity, src }) => {
    const texture = useTexture(src)

    const geometry = useMemo(
        () => createCurvedPlaneGeometry(width, height, curvature, 24, concavity),
        [width, height, curvature, concavity]
    )
    const alphaMap = useRoundedAlphaMap(width, height, radius)

    return (
        <mesh position={position} quaternion={quaternion} geometry={geometry}>
            <meshBasicMaterial
                map={texture}
                alphaMap={alphaMap}
                transparent
                toneMapped={false}
                side={2}
            />
        </mesh>
    )
}

/**
 * Props tambahan:
 * - screenImage        : path foto statis
 * - screenVideo        : path video (diprioritaskan kalau keduanya diisi)
 * - screenMeshName     : cari mesh layar berdasarkan nama yang mengandung teks ini
 * - screenMeshIndex    : cari mesh layar berdasarkan index di console — HANYA
 *                        dipakai untuk menentukan POSISI, bukan ukuran
 * - debugHighlight     : true = semua mesh diberi warna berbeda untuk identifikasi
 * - screenOffsetX/Y    : geser posisi plane kalau belum pas ke tengah layar (default 0)
 * - screenOffsetZ      : majukan plane ke arah kamera (default 0.05)
 * - screenWidth/Height : ukuran plane, diatur manual (default 4 x 3)
 * - screenCornerRadius : radius sudut membulat (default 0.4)
 * - screenCurvature    : seberapa cembung bagian tengah plane menonjol ke
 *                        depan, dalam satuan model (default 0.3). Naikkan
 *                        untuk efek cembung lebih terasa, 0 untuk flat.
 * - screenBottomConcavity : seberapa cekung bagian BAWAH plane melesak ke
 *                        belakang (default 0 = simetris/cembung biasa).
 * - screenTopConcavity  : seberapa cekung bagian ATAS plane melesak ke
 *                        belakang (default 0).
 * - screenLeftConcavity : seberapa cekung bagian KIRI plane melesak ke
 *                        belakang (default 0).
 * - screenRightConcavity: seberapa cekung bagian KANAN plane melesak ke
 *                        belakang (default 0).
 *                        Keempatnya independen dan bisa dikombinasikan.
 *                        Naikkan pelan-pelan (mis. 0.3, 0.6) sampai dapat
 *                        bentuk yang pas — sisi yang tidak diisi (0) akan
 *                        tetap cembung normal.
 */
const Target = ({
    screenImage,
    screenVideo,
    screenMeshName,
    screenMeshIndex,
    debugHighlight,
    screenOffsetX = 0,
    screenOffsetY = 0,
    screenOffsetZ = 0.5,
    screenWidth = 7,
    screenHeight = 3,
    screenCornerRadius = 0.4,
    screenCurvature = 0.3,
    screenBottomConcavity = 9,
    screenTopConcavity = 0,
    screenLeftConcavity = 0,
    screenRightConcavity = 0,
    ...props
}) => {
    const targetRef = useRef()
    const { scene } = useGLTF('/models/model_03.glb')
    const [screenTransform, setScreenTransform] = useState(null)

    const { centeredScene, hitSize, screenMesh } = useMemo(() => {
        if (!scene) return { centeredScene: null, hitSize: [1, 1, 1], screenMesh: null }

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

        const meshList = []
        clonedScene.traverse((child) => {
            if (!child.isMesh) return
            const meshBox = new Box3().setFromObject(child)
            const meshSize = new Vector3()
            meshBox.getSize(meshSize)
            meshList.push({
                index: meshList.length,
                name: child.name,
                materialName: child.material?.name || '(tanpa nama)',
                size: {
                    x: +meshSize.x.toFixed(2),
                    y: +meshSize.y.toFixed(2),
                    z: +meshSize.z.toFixed(2),
                },
                mesh: child,
            })
        })

        console.log(
            '[Target] Daftar mesh (index, name, materialName, size):',
            meshList.map(({ index, name, materialName, size }) => ({ index, name, materialName, size }))
        )

        if (debugHighlight) {
            const debugColors = [
                0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
                0xff8800, 0x8800ff, 0xffffff, 0x008888, 0x888800, 0x880088,
            ]
            meshList.forEach(({ mesh, index }) => {
                mesh.material = mesh.material.clone()
                mesh.material.color = new Color(debugColors[index % debugColors.length])
                mesh.material.map = null
                mesh.material.emissiveMap = null
                mesh.material.emissive = new Color(debugColors[index % debugColors.length])
                mesh.material.emissiveIntensity = 0.5
                mesh.material.needsUpdate = true
            })
        }

        let foundScreenMesh = null

        if (typeof screenMeshIndex === 'number') {
            foundScreenMesh = meshList[screenMeshIndex]?.mesh ?? null
        }

        if (!foundScreenMesh && screenMeshName) {
            const targetName = screenMeshName.toLowerCase()
            foundScreenMesh = meshList.find((m) => m.name.toLowerCase().includes(targetName))?.mesh ?? null
        }

        if (!foundScreenMesh && !screenMeshName && typeof screenMeshIndex !== 'number') {
            foundScreenMesh = meshList.find((m) => m.name.toLowerCase().includes('screen'))?.mesh ?? null
        }

        if (foundScreenMesh) {
            console.log('[Target] Mesh layar dipakai (untuk posisi saja):', foundScreenMesh.name)
        } else if (!debugHighlight) {
            console.warn(
                '[Target] Mesh layar belum ditentukan. Coba isi prop screenMeshIndex ' +
                '(0 sampai ' + (meshList.length - 1) + ') satu per satu, atau pakai debugHighlight untuk cari cepat.'
            )
        }

        return {
            centeredScene: clonedScene,
            hitSize: [
                size.x * scaleFactor,
                size.y * scaleFactor,
                Math.min(size.z * scaleFactor, 3),
            ],
            screenMesh: foundScreenMesh,
        }
    }, [scene, screenMeshName, screenMeshIndex, debugHighlight])

    useEffect(() => {
        if (!screenMesh || !targetRef.current) return

        screenMesh.updateWorldMatrix(true, false)
        targetRef.current.updateWorldMatrix(true, false)

        const worldPos = new Vector3()
        screenMesh.getWorldPosition(worldPos)

        const worldQuat = new Quaternion()
        screenMesh.getWorldQuaternion(worldQuat)

        const groupQuat = new Quaternion()
        targetRef.current.getWorldQuaternion(groupQuat)

        const localPos = targetRef.current.worldToLocal(worldPos.clone())
        const localQuat = worldQuat.clone().premultiply(groupQuat.clone().invert())

        const forward = new Vector3(0, 0, 1).applyQuaternion(localQuat).multiplyScalar(screenOffsetZ)

        setScreenTransform({
            position: [
                localPos.x + forward.x + screenOffsetX,
                localPos.y + forward.y + screenOffsetY,
                localPos.z + forward.z,
            ],
            quaternion: localQuat.toArray(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenMesh, screenOffsetX, screenOffsetY, screenOffsetZ])

    useGSAP(() => {
        if (!targetRef.current) return

        gsap.to(targetRef.current.position, {
            y: targetRef.current.position.y + 0.5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
        })
    }, [])

    const screenConcavity = useMemo(
        () => ({
            bottom: screenBottomConcavity,
            top: screenTopConcavity,
            left: screenLeftConcavity,
            right: screenRightConcavity,
        }),
        [screenBottomConcavity, screenTopConcavity, screenLeftConcavity, screenRightConcavity]
    )

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

            {screenTransform && screenVideo && !debugHighlight && (
                <VideoPlane
                    position={screenTransform.position}
                    quaternion={screenTransform.quaternion}
                    width={screenWidth}
                    height={screenHeight}
                    radius={screenCornerRadius}
                    curvature={screenCurvature}
                    concavity={screenConcavity}
                    src={screenVideo}
                />
            )}

            {screenTransform && !screenVideo && screenImage && !debugHighlight && (
                <PhotoPlane
                    position={screenTransform.position}
                    quaternion={screenTransform.quaternion}
                    width={screenWidth}
                    height={screenHeight}
                    radius={screenCornerRadius}
                    curvature={screenCurvature}
                    concavity={screenConcavity}
                    src={screenImage}
                />
            )}

            <mesh>
                <boxGeometry args={hitSize} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default Target