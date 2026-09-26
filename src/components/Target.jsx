import { useGSAP } from '@gsap/react';
import { Html, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box3, Color, Quaternion, Vector3 } from 'three';

/**
 * Props tambahan:
 * - screenImage      : path foto statis (pakai <img>)
 * - screenVideo      : path video (pakai <video>, diprioritaskan kalau keduanya diisi)
 * - screenMeshName   : cari mesh layar berdasarkan nama yang mengandung teks ini
 * - screenMeshIndex  : cari mesh layar berdasarkan index di console (0, 1, 2, dst)
 * - debugHighlight   : true = semua mesh diberi warna berbeda untuk identifikasi
 * - screenOffsetX/Y  : geser posisi overlay kalau belum pas (default 0)
 * - screenScale      : kalikan ukuran overlay kalau kurang/kelebihan besar (default 1)
 */
const Target = ({
    screenImage,
    screenVideo,
    screenMeshName,
    screenMeshIndex,
    debugHighlight,
    screenOffsetX = 0,
    screenOffsetY = 0,
    screenScale = 1,
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
            const knownScreenKeywords = ['screen', 'monitor', 'display', 'lcd', 'bezel', 'frame']
            foundScreenMesh = meshList.find((m) => {
                const name = m.name.toLowerCase()
                return knownScreenKeywords.some((keyword) => name.includes(keyword))
            })?.mesh ?? null
        }

        if (foundScreenMesh) {
            console.log('[Target] Mesh layar dipakai:', foundScreenMesh.name)
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

    // Hitung posisi & ukuran overlay Html, relatif terhadap group Target
    // (bukan world space), supaya ikut bergerak & berotasi bareng model.
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

        const box = new Box3().setFromObject(screenMesh)
        const size = new Vector3()
        box.getSize(size)

        setScreenTransform({
            position: localPos.toArray(),
            quaternion: localQuat.toArray(),
            // Pakai x & y mesh sebagai lebar/tinggi layar. Kalau ukurannya
            // meleset (kegedean/kekecilan), tinggal atur lewat prop screenScale.
            width: size.x,
            height: size.y,
        })
    }, [screenMesh])

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

            {screenTransform && (screenVideo || screenImage) && !debugHighlight && (
                <group
                    position={[
                        screenTransform.position[0] + screenOffsetX,
                        screenTransform.position[1] + screenOffsetY,
                        screenTransform.position[2],
                    ]}
                    quaternion={screenTransform.quaternion}
                >
                    <Html
                        transform
                        occlude={false}
                        distanceFactor={1}
                        style={{ pointerEvents: 'none' }}
                    >
                        {screenVideo ? (
                            <video
                                src={screenVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                style={{
                                    width: `${screenTransform.width * 100 * screenScale}px`,
                                    height: `${screenTransform.height * 100 * screenScale}px`,
                                    objectFit: 'cover',
                                    display: 'block',
                                    background: 'black',
                                }}
                            />
                        ) : (
                            <img
                                src={screenImage}
                                alt=""
                                style={{
                                    width: `${screenTransform.width * 100 * screenScale}px`,
                                    height: `${screenTransform.height * 100 * screenScale}px`,
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        )}
                    </Html>
                </group>
            )}

            <mesh>
                <boxGeometry args={hitSize} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default Target