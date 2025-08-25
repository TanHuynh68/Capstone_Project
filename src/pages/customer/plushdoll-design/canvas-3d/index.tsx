"use client"

import type React from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Suspense, useState, useRef, useEffect, forwardRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Local rotation slider styling for this page only
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Type,
    Download,
    RotateCcw,
    Link,
    Target,
    Trash2,
    Box,
    Plus,
    Play,
    Pause,
    Check,
    Package,
} from "lucide-react"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

import CLOUDINARY_CONFIG from '@/config/cloudinary';
import Canvas3DList from './Canvas3DList';
import { useLocation } from "react-router-dom"
import { toast } from "sonner"
import { Navbar } from "@/components/layouts/customer-layout/Navbar"


// Component để render texture với tỷ lệ khung hình đúng (contain)
const TexturePlane = forwardRef<THREE.Mesh, {
    position: [number, number, number];
    scale: number;
    rotation: [number, number, number];
    textureUrl: string;
}>(({ position, scale, rotation, textureUrl }, ref) => {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(textureUrl, (loadedTexture) => {
            loadedTexture.anisotropy = 8;
            loadedTexture.minFilter = THREE.LinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;
            setTexture(loadedTexture);
        });
    }, [textureUrl]);

    if (!texture) return null;

    // Tạo hình vuông cố định - ảnh sẽ được contain trong ô vuông
    const squareSize = scale;

    return (
        <mesh
            ref={ref}
            position={position}
            scale={[squareSize, squareSize, 1]}
            rotation={rotation}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
});

TexturePlane.displayName = 'TexturePlane';

const DEFAULT_ANCHOR_POINTS = {
    head: { x: 0, y: -0.025, z: 0.275, label: "Đầu" },
    chest_belly: { x: 0, y: -0.195, z: -0.465, label: "Ngực + Bụng" },
    back: { x: 0, y: 0.25, z: -0.4, label: "Lưng" },
    left_hand: { x: -0.38, y: -0.04, z: -0.485, label: "Tay trái" },
    right_hand: { x: 0.38, y: -0.04, z: -0.485, label: "Tay phải" },
    left_foot: { x: -0.15, y: -0.02, z: -1.0, label: "Chân trái" },
    right_foot: { x: 0.15, y: -0.02, z: -1.0, label: "Chân phải" },
}

// Thêm điểm neo cho model thứ hai (Labubu Classic - model lớn hơn)
// Điểm neo được tối ưu cho kích thước và tỷ lệ của Labubu Classic
const SMALL_MODEL_ANCHOR_POINTS = {
    head: { x: 0, y: 0, z: 0.8, label: "Đầu" },
    chest_belly: { x: 0, y: -0.43, z: -0.55, label: "Ngực + Bụng" },
    back: { x: 0, y: 0.3, z: -0.46, label: "Lưng" },
    left_hand: { x: -0.52, y: -0.13, z: -0.70, label: "Tay trái" },
    right_hand: { x: 0.52, y: -0.13, z: -0.70, label: "Tay phải" },
    left_foot: { x: 0.26, y: -0.12, z: -1.20, label: "Chân trái" },
    right_foot: { x: -0.26, y: -0.12, z: -1.20, label: "Chân phải" },
}

interface GLBModel {
    id: string
    name: string
    url: string
    isDefault?: boolean
}

interface AccessoryModel {
    id: string
    name: string
    url: string
    position: { x: number; y: number; z: number }
    scale: number
    rotation: { x: number; y: number; z: number }
    anchorPoint?: string
}

// Interface cho JSON data khi restore scene
interface Canvas3DJSONData {
    currentModelId?: string
    modelName?: string
    isDefaultModel?: boolean
    modelUrl?: string
    customTexture?: string
    texturePosition?: { x: number; y: number; z: number }
    textureScale?: number
    chestBellyDecalScale?: number
    showTextureOnBack?: boolean
    selectedTextureAnchor?: string
    customText?: string
    textColor?: string
    textBackgroundColor?: string
    textSize?: number
    textPosition?: { x: number; y: number; z: number }
    selectedTextAnchor?: string
    appliedTexts?: Array<{
        id: string
        text: string
        position: { x: number; y: number; z: number }
        color: string
        backgroundColor: string
        size: number
    }>
    appliedTextures?: Array<{
        id: string
        texture: string
        position: { x: number; y: number; z: number }
        scale: number
    }>
    accessories?: AccessoryModel[]
    modelPosition?: { x: number; y: number; z: number }
    anchorPoints?: typeof DEFAULT_ANCHOR_POINTS
    savedAt?: string
    version?: string
    sceneInfo?: {
        texturesCount: number
        accessoriesCount: number
        textsCount: number
        hasCurrentTexture: boolean
        hasCurrentText: boolean
    }
}

interface LabubuModelProps {
    modelPath: string
    modelId?: string
    customTexture?: string
    customText?: string
    textColor?: string
    textBackgroundColor?: string
    textSize?: number
    textPosition?: { x: number; y: number; z: number }
    texturePosition?: { x: number; y: number; z: number }
    textureScale?: number
    chestBellyDecalScale?: number
    showTextureOnBack?: boolean
    isRotating?: boolean
    isAttached?: boolean
    anchorPoints?: typeof DEFAULT_ANCHOR_POINTS
    showAnchorPoints?: boolean
    selectedTextAnchor?: string
    selectedTextureAnchor?: string
    textMeshRef?: React.RefObject<HTMLDivElement | null>
    textureMeshRef?: React.RefObject<THREE.Mesh | null>
    appliedTexts?: Array<{
        id: string
        text: string
        position: { x: number; y: number; z: number }
        color: string
        backgroundColor: string
        size: number
    }>
    appliedTextures?: Array<{
        id: string
        texture: string
        position: { x: number; y: number; z: number }
        scale: number
    }>
    accessories?: AccessoryModel[]
    showAxes?: boolean
    modelPosition?: { x: number; y: number; z: number }
    onDimensionsChange?: (dims: { width: number; height: number; depth: number }) => void
    loadedScene?: THREE.Group
}

function AnchorPoint({ position, label, isSelected = false }: { position: { x: number; y: number; z: number }; label: string; isSelected?: boolean }) {
    const [isHovered, setIsHovered] = useState(false)

    // Xác định màu sắc dựa trên trạng thái
    let color: string
    let emissive: string
    let emissiveIntensity: number

    if (isSelected) {
        // Điểm neo được chọn - màu xanh dương
        color = "#0066ff"
        emissive = "#0033cc"
        emissiveIntensity = 0.6
    } else if (isHovered) {
        // Điểm neo được hover - màu xanh lá
        color = "#00ff44"
        emissive = "#006633"
        emissiveIntensity = 0.4
    } else {
        // Điểm neo bình thường - màu xanh lá nhạt
        color = "#00ff88"
        emissive = "#004422"
        emissiveIntensity = 0.2
    }

    return (
        <group position={[position.x, position.y, position.z]}>
            <mesh onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={isHovered || isSelected ? 1 : 0.9}
                    roughness={0.3}
                    metalness={0.1}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                />
            </mesh>

            {isHovered && (
                <Html distanceFactor={8} position={[0, 0.2, 0]}>
                    <div className="bg-green-600/90 text-white text-sm px-2 py-1 rounded shadow-lg pointer-events-none border border-green-400/50 backdrop-blur-sm animate-in fade-in duration-200">
                        {label}
                    </div>
                </Html>
            )}
        </group>
    )
}

function AccessoryModel({ modelPath, position, scale, rotation }: {
    modelPath: string;
    position: { x: number; y: number; z: number };
    scale: number;
    rotation: { x: number; y: number; z: number }
}) {
    const { scene } = useGLTF(modelPath)

    // Xử lý scale để tránh lật ngược khi scale âm
    let finalScale: [number, number, number]

    if (scale === 0) {
        // Scale 0 = ẩn hoàn toàn
        finalScale = [0.001, 0.001, 0.001] // Gần như ẩn
    } else if (scale < 0) {
        // Scale âm = thu nhỏ (không lật ngược)
        finalScale = [Math.abs(scale), Math.abs(scale), Math.abs(scale)]
    } else {
        // Scale dương = phóng to bình thường
        finalScale = [scale, scale, scale]
    }

    return (
        <group
            position={[position.x, position.y, position.z]}
            scale={finalScale}
            rotation={[rotation.x, rotation.y, rotation.z]}
        >
            <primitive
                object={scene}
                rotation={[-Math.PI / 2 + Math.PI, 0, 0]} // Chuyển từ Blender Z-up sang Three.js Y-up + lộn ngược 180°
            />
        </group>
    )
}

function LabubuModel({
    modelPath,
    modelId = "default-labubu",
    customTexture,
    customText,
    textColor = "#000000",
    textBackgroundColor = "#ffffff",
    textSize = 1,
    textPosition = { x: 0, y: 1, z: 0.5 },
    texturePosition = { x: 0, y: 0, z: 0.3 },
    textureScale = 1,
    chestBellyDecalScale = 8.0,
    showTextureOnBack = false,
    isRotating = false,
    anchorPoints = DEFAULT_ANCHOR_POINTS,
    showAnchorPoints = false,
    selectedTextAnchor,
    selectedTextureAnchor,
    textMeshRef,
    textureMeshRef,
    appliedTexts = [],
    appliedTextures = [],
    accessories = [],
    showAxes = true,
    modelPosition = { x: 0, y: 0, z: 0 },
    onDimensionsChange,
    loadedScene,
}: LabubuModelProps) {
    const { scene } = useGLTF(modelPath)
    const groupRef = useRef<THREE.Group>(null)
    const modelRef = useRef<THREE.Group>(null)


    // Decal for chest_belly logo
    const [chestBellyDecalGeometry, setChestBellyDecalGeometry] = useState<THREE.BufferGeometry | null>(null)
    const [chestBellyDecalMaterial, setChestBellyDecalMaterial] = useState<THREE.Material | null>(null)

    // Xác định scale dựa trên model ID
    const getModelScale = () => {
        switch (modelId) {
            case "small-labubu":
                return 1
            case "default-labubu":
                return 1
            default:
                return 1
        }
    }

    useFrame((_, delta) => {
        if (groupRef.current && isRotating) {
            groupRef.current.rotation.z += delta * 0.8 // Quay quanh trục Z để quay theo mặt phẳng XY
        }
    })

    // Generate decal geometry for chest_belly when using respective anchor
    useEffect(() => {
        // Cleanup previous
        return () => {
            if (chestBellyDecalGeometry) chestBellyDecalGeometry.dispose()
            if (chestBellyDecalMaterial) chestBellyDecalMaterial.dispose()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Tính kích thước (W, H, D) của model chính theo bounding box sau khi áp dụng scale/rotation
    useEffect(() => {
        if (!modelRef.current) return
        try {
            modelRef.current.updateMatrixWorld(true)
            const bbox = new THREE.Box3().setFromObject(modelRef.current)
            const size = bbox.getSize(new THREE.Vector3())
            const dims = { width: size.x, height: size.y, depth: size.z }
            if (onDimensionsChange) onDimensionsChange(dims)
        } catch {
            // ignore
        }
    }, [scene, modelId, textureScale, textSize, onDimensionsChange])

    useEffect(() => {
        if (!groupRef.current) return
        if (!customTexture) {
            setChestBellyDecalGeometry(null)
            setChestBellyDecalMaterial(null)
            return
        }

        const createDecal = (mesh: THREE.Mesh, position: THREE.Vector3, scaleMultiplier: number) => {
            // Tạo orientation đơn giản - hướng thẳng ra phía trước
            const orientation = new THREE.Euler(0, 0, 0)

            // Kích thước decal dựa trên scale và model
            const baseSize = 0.3 * textureScale * getModelScale() * scaleMultiplier
            const size = new THREE.Vector3(baseSize, baseSize, baseSize * 0.1)

            // Load texture
            const textureLoader = new THREE.TextureLoader()
            const map = textureLoader.load(customTexture)
            map.anisotropy = 8
            map.minFilter = THREE.LinearFilter
            map.magFilter = THREE.LinearFilter

            // Tạo material với culling để kiểm soát hiển thị
            const decalMaterial = new THREE.MeshPhongMaterial({
                map,
                transparent: true,
                depthTest: true,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -4,
                side: showTextureOnBack ? THREE.DoubleSide : THREE.FrontSide, // Chọn hiển thị một mặt hay cả hai mặt
                alphaTest: 0.1, // Loại bỏ pixel trong suốt
            })

            try {
                const decalGeometry = new DecalGeometry(mesh, position, orientation, size) as unknown as THREE.BufferGeometry
                return { geometry: decalGeometry, material: decalMaterial }
            } catch (e) {
                console.error("Failed to create decal:", e)
                return { geometry: null, material: null }
            }
        }

        const createChestBellyDecal = (
            anchor: { x: number; y: number; z: number },
            scaleMultiplier: number
        ) => {
            // Position - đặt hơi ra phía trước một chút để tránh z-fighting
            const localPos = new THREE.Vector3(anchor.x, anchor.y, anchor.z + 0.1)
            const worldPos = localPos.clone()
            groupRef.current!.localToWorld(worldPos)

            // Tìm mesh gần nhất để tạo decal
            scene.updateMatrixWorld(true)
            let closestMesh: THREE.Mesh | null = null
            let minDistance = Infinity
            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh && obj.geometry) {
                    const bbox = new THREE.Box3().setFromObject(obj)
                    const center = bbox.getCenter(new THREE.Vector3())
                    const dist = center.distanceTo(worldPos)
                    if (dist < minDistance) {
                        minDistance = dist
                        closestMesh = obj
                    }
                }
            })
            if (!closestMesh) return { geometry: null as THREE.BufferGeometry | null, material: null as THREE.Material | null }

            // Sử dụng function createDecal đơn giản
            return createDecal(closestMesh, worldPos, scaleMultiplier)
        }

        // Combined chest_belly large decal (single large decal covering both chest and belly areas)
        if (selectedTextureAnchor === "chest_belly") {
            // Use the chest_belly anchor point for a single large decal covering both areas
            // Sử dụng chestBellyDecalScale để người dùng có thể điều chỉnh kích thước
            const { geometry, material } = createChestBellyDecal(anchorPoints.chest_belly, chestBellyDecalScale)
            setChestBellyDecalGeometry(geometry)
            setChestBellyDecalMaterial(material)
        } else {
            setChestBellyDecalGeometry(null)
            setChestBellyDecalMaterial(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene, customTexture, selectedTextureAnchor, textureScale, modelId, anchorPoints, chestBellyDecalScale, showTextureOnBack])

    // Render the component
    return (
        <group ref={groupRef} position={[modelPosition.x, modelPosition.y, modelPosition.z]}>
            {showAxes && (
                <group position={[0, 0, 0]}>
                    {/* X axis - Red */}
                    <group>
                        <mesh position={[1.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                            <cylinderGeometry args={[0.03, 0.03, 2.0]} />
                            <meshBasicMaterial color="#ff0000" />
                        </mesh>
                        <Html position={[2.2, 0, 0]} distanceFactor={8}>
                            <div className="text-red-500 font-bold text-sm bg-white/95 px-2 py-1 rounded-lg shadow-lg border border-red-200">
                                X
                            </div>
                        </Html>
                    </group>

                    {/* Y axis - Green (Lên/Xuống) */}
                    <group>
                        <mesh position={[0, -1.0, 0]}>
                            <cylinderGeometry args={[0.03, 0.03, 2.0]} />
                            <meshBasicMaterial color="#00ff00" />
                        </mesh>
                        <Html position={[0, -2.2, 0]} distanceFactor={8}>
                            <div className="text-green-500 font-bold text-sm bg-white/95 px-2 py-1 rounded-lg shadow-lg border border-green-200">
                                Y
                            </div>
                        </Html>
                    </group>

                    {/* Z axis - Blue (Gần/Xa) */}
                    <group>
                        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.03, 0.03, 2.0]} />
                            <meshBasicMaterial color="#0000ff" />
                        </mesh>
                        <Html position={[0, 0, 2.2]} distanceFactor={8}>
                            <div className="text-blue-500 font-bold text-sm bg-white/95 px-2 py-1 rounded-lg shadow-lg border border-blue-200">
                                Z
                            </div>
                        </Html>
                    </group>
                </group>
            )}

            {/* Render loadedScene if provided, otherwise render the normal scene */}
            {loadedScene ? (
                <primitive object={loadedScene} />
            ) : (
                <>
                    <primitive
                        object={scene}
                        scale={getModelScale()}
                        rotation={[-Math.PI / 2 + Math.PI, 0, 0]} // Chuyển từ Blender Z-up sang Three.js Y-up + lộn ngược 180°
                        ref={modelRef}
                    />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />

                    {/* Overlay moved to Canvas root */}

                    {customTexture && !(selectedTextureAnchor === "chest_belly" && chestBellyDecalGeometry) && (
                        <TexturePlane
                            ref={textureMeshRef}
                            position={[texturePosition.x, texturePosition.y, texturePosition.z]}
                            scale={textureScale}
                            rotation={[Math.PI / 2, 0, 0]}
                            textureUrl={customTexture}
                        />
                    )}

                    {selectedTextureAnchor === "chest_belly" && chestBellyDecalGeometry && chestBellyDecalMaterial && (
                        <mesh geometry={chestBellyDecalGeometry} material={chestBellyDecalMaterial as THREE.Material} />
                    )}

                    {appliedTextures.map((texture) => (
                        <TexturePlane
                            key={texture.id}
                            position={[texture.position.x, texture.position.y, texture.position.z]}
                            scale={texture.scale}
                            rotation={[Math.PI / 2, 0, 0]}
                            textureUrl={texture.texture}
                        />
                    ))}

                    {customText && customText.trim() !== "" && (
                        <Html
                            ref={textMeshRef}
                            position={[textPosition.x, textPosition.y, textPosition.z]}
                            transform
                            occlude
                            distanceFactor={textSize * 2}
                        >
                            <div
                                style={{
                                    color: textColor,
                                    fontSize: `${textSize * 16}px`,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    background: textBackgroundColor,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: `2px solid ${textColor}20`,
                                    backdropFilter: "blur(8px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                    zIndex: 1000,
                                }}
                            >
                                {customText}
                            </div>
                        </Html>
                    )}

                    {appliedTexts.map((text) => (
                        <Html
                            key={text.id}
                            position={[text.position.x, text.position.y, text.position.z]}
                            transform
                            occlude
                            distanceFactor={text.size * 2}
                        >
                            <div
                                style={{
                                    color: text.color,
                                    fontSize: `${text.size * 16}px`,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    background: text.backgroundColor,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: `2px solid ${text.color}20`,
                                    backdropFilter: "blur(8px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    maxWidth: "200px",
                                    wordWrap: "break-word",
                                    zIndex: 1000,
                                }}
                            >
                                {text.text}
                            </div>
                        </Html>
                    ))}

                    {showAnchorPoints && (
                        <>
                            {Object.entries(anchorPoints).map(([key, anchor]) => (
                                <AnchorPoint
                                    key={key}
                                    position={anchor}
                                    label={anchor.label}
                                    isSelected={selectedTextAnchor === key || selectedTextureAnchor === key}
                                />
                            ))}
                        </>
                    )}

                    {/* Render accessories */}
                    {accessories.map((accessory) => (
                        <AccessoryModel
                            key={accessory.id}
                            modelPath={accessory.url}
                            position={accessory.position}
                            scale={accessory.scale}
                            rotation={accessory.rotation}
                        />
                    ))}
                </>
            )}
        </group>
    )
}

/**
 * Props cho component PlushDollDesign3D
 * 
 * @param onBackTo2D - Callback để quay lại canvas 2D
 * @param onSave - Callback để lưu thiết kế 3D thành JSON string vào database
 * @param canvas3DData - JSON string chứa thiết kế 3D đã lưu trước đó (để restore)
 */
interface PlushDollDesign3DProps {
    onBackTo2D: () => void;
    onSave?: (canvas3DData: string) => void; // Nhận JSON string để lưu vào canvas3D field
    canvas3DData?: string;
    fromChat?: boolean;
    openCanvas3DList?: boolean;
    selectedCanvas3D?: {
        canvas3D: string;
        title: string;
        id: string;
    };
}

export default function PlushDollDesign3D({
    onBackTo2D,
    onSave,
    canvas3DData,
    fromChat,
    openCanvas3DList,
    selectedCanvas3D
}: PlushDollDesign3DProps) {
    const location = useLocation()

    // ✅ Đảm bảo tất cả hooks được gọi trước khi có bất kỳ conditional logic nào
    const [glbModels, setGlbModels] = useState<GLBModel[]>([
        {
            id: "default-labubu",
            name: "Labubu Keychain",
            url: "/model/plush_labubu_keychain_character.glb",
            isDefault: true,
        },
        {
            id: "small-labubu",
            name: "Labubu Classic",
            url: "/model/labubu_classic.glb",
            isDefault: false,
        },
    ])
    const [currentModelId, setCurrentModelId] = useState<string>("default-labubu")

    const [customTexture, setCustomTexture] = useState<string>("")
    const [customText, setCustomText] = useState<string>("")
    const [textColor, setTextColor] = useState<string>("#000000")
    const [textBackgroundColor, setTextBackgroundColor] = useState<string>("#ffffff")
    const [textSize, setTextSize] = useState<number>(1)
    const [uploadedImage, setUploadedImage] = useState<string>("")

    const [appliedTexts, setAppliedTexts] = useState<
        Array<{
            id: string
            text: string
            position: { x: number; y: number; z: number }
            color: string
            backgroundColor: string
            size: number
        }>
    >([])

    const [appliedTextures, setAppliedTextures] = useState<
        Array<{
            id: string
            texture: string
            position: { x: number; y: number; z: number }
            scale: number
        }>
    >([])

    const [accessories, setAccessories] = useState<AccessoryModel[]>([])
    const [selectedAccessory, setSelectedAccessory] = useState<string>("")

    const [textPosition, setTextPosition] = useState({ x: 0, y: 1, z: 0.5 })
    const [texturePosition, setTexturePosition] = useState({ x: 0, y: 0, z: 0.3 })
    const [textureScale, setTextureScale] = useState(1)
    const [chestBellyDecalScale, setChestBellyDecalScale] = useState(8.0)
    const [showTextureOnBack, setShowTextureOnBack] = useState(false)

    const [isRotating, setIsRotating] = useState(false)
    const [isAttached, setIsAttached] = useState(false)

    const [selectedTextAnchor, setSelectedTextAnchor] = useState<string>("")
    const [selectedTextureAnchor, setSelectedTextureAnchor] = useState<string>("")
    const [showCanvas3DList, setShowCanvas3DList] = useState(false)

    // State để lưu scene đã load từ Cloudinary
    const [loadedScene, setLoadedScene] = useState<THREE.Group | null>(null)
    const [isLoadingScene, setIsLoadingScene] = useState(false)

    // State cho loading khi lưu 3D
    const [isSaving3D, setIsSaving3D] = useState(false)

    const [editingAnchor, setEditingAnchor] = useState<string>("")
    const [showAnchorPoints, setShowAnchorPoints] = useState(false)
    const [showAxes, setShowAxes] = useState(false)

    const textMeshRef = useRef<HTMLDivElement | null>(null)
    const textureMeshRef = useRef<THREE.Mesh | null>(null)

    // Clearable inputs and slider snap-to-zero detent
    const [textPositionInput, setTextPositionInput] = useState({ x: "0.00", y: "1.00", z: "0.50" })
    const [texturePositionInput, setTexturePositionInput] = useState({ x: "0.00", y: "0.00", z: "0.30" })

    // State cho vị trí model chính
    const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 })
    const [modelPositionInput, setModelPositionInput] = useState({ x: "0.00", y: "0.00", z: "0.00" })

    // Dimensions computed inside LabubuModel and hoisted for Canvas overlay
    const [canvasModelDims, setCanvasModelDims] = useState<{ width: number; height: number; depth: number } | null>(null)

    // ✅ Đảm bảo tất cả hooks được gọi trước khi có bất kỳ conditional logic nào
    const [anchorPoints, setAnchorPoints] = useState(DEFAULT_ANCHOR_POINTS)

    // ✅ Cập nhật anchorPoints dựa trên model được chọn - sử dụng useCallback để tránh re-render không cần thiết
    const getCurrentAnchorPoints = useCallback(() => {
        if (currentModelId === "small-labubu") {
            return SMALL_MODEL_ANCHOR_POINTS
        }
        return DEFAULT_ANCHOR_POINTS
    }, [currentModelId])

    // ✅ Cập nhật anchorPoints khi thay đổi model
    const handleModelChange = useCallback((modelId: string) => {
        setCurrentModelId(modelId)
        if (modelId === "small-labubu") {
            setAnchorPoints(SMALL_MODEL_ANCHOR_POINTS)
        } else {
            setAnchorPoints(DEFAULT_ANCHOR_POINTS)
        }
        // Reset các vị trí về mặc định khi đổi model
        setTextPosition({ x: 0, y: 1, z: 0.5 })
        setTexturePosition({ x: 0, y: 0, z: 0.3 })
        setTextPositionInput({ x: "0.00", y: "1.00", z: "0.50" })
        setTexturePositionInput({ x: "0.00", y: "0.00", z: "0.30" })
        setModelPosition({ x: 0, y: 0, z: 0 })
        setModelPositionInput({ x: "0.00", y: "0.00", z: "0.00" })
        setSelectedTextAnchor("")
        setSelectedTextureAnchor("")
    }, [])

    // ✅ Tự động mở sidebar Canvas3DList và chọn canvas khi có props từ chat
    useEffect(() => {
        if (fromChat && openCanvas3DList && selectedCanvas3D) {
            console.log('Auto-opening Canvas3DList from chat with selected canvas:', selectedCanvas3D);

            // Tự động mở sidebar
            setShowCanvas3DList(true);

            // Tự động chọn canvas đã được chọn từ chat
            setTimeout(() => {
                if (selectedCanvas3D.canvas3D) {
                    // Gọi onSelect callback để load canvas
                    const handleSelect = async (canvas3D: string, title: string, id: string) => {
                        console.log("Auto-loading 3D canvas from chat:", { canvas3D, title, id });
                        try {
                            const canvas3DData = JSON.parse(canvas3D);
                            console.log("Parsed 3D data from chat:", canvas3DData);

                            // Kiểm tra format mới (jsonUrl) hoặc format cũ (sceneUrl/modelUrl)
                            if (canvas3DData.jsonUrl) {
                                // Format mới: JSON file trên Cloudinary

                                // Hiển thị loading state
                                setIsLoadingScene(true);

                                try {
                                    // 1. Fetch JSON data từ Cloudinary
                                    const response = await fetch(canvas3DData.jsonUrl);
                                    if (!response.ok) {
                                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                    }

                                    const jsonData = await response.json();

                                    // 2. Restore toàn bộ scene từ JSON data
                                    await restoreSceneFromJSON(jsonData);

                                } catch (jsonError) {
                                    console.error("❌ Lỗi khi tải JSON từ Cloudinary (từ chat):", jsonError);
                                    toast.error("⚠️ Không thể tải dữ liệu JSON từ Cloudinary. Vui lòng thử lại.");
                                } finally {
                                    setIsLoadingScene(false);
                                }

                            } else if (canvas3DData.sceneUrl || canvas3DData.modelUrl) {
                                // Format cũ: GLB file trên Cloudinary
                                toast.info("🔄 Đang tải scene GLB từ Cloudinary (format cũ)...");
                                // Xử lý format cũ nếu cần
                            }
                        } catch (error) {
                            console.error("❌ Lỗi khi auto-load canvas từ chat:", error);
                            toast.error("⚠️ Có lỗi xảy ra khi tải canvas từ chat.");
                        }
                    };

                    // Gọi handleSelect với canvas đã chọn từ chat
                    handleSelect(selectedCanvas3D.canvas3D, selectedCanvas3D.title, selectedCanvas3D.id);
                }
            }, 100); // Delay nhỏ để đảm bảo sidebar đã mở
        }
    }, [fromChat, openCanvas3DList, selectedCanvas3D]);

    // ✅ Cập nhật anchorPoints khi thay đổi model
    useEffect(() => {
        const newAnchorPoints = getCurrentAnchorPoints();
        setAnchorPoints(newAnchorPoints);
    }, [getCurrentAnchorPoints]);

    // ✅ Load dữ liệu 3D khi component mount - Parse JSON và restore toàn bộ thiết kế
    useEffect(() => {
        if (canvas3DData) {
            try {
                console.log("🔄 Đang load thiết kế 3D từ JSON...");
                console.log("📄 Input canvas3DData length:", canvas3DData.length, "characters");
                console.log("📄 Input canvas3DData preview:", canvas3DData.substring(0, 200) + "...");

                const data = JSON.parse(canvas3DData);
                console.log("✅ JSON parse thành công!");
                console.log("📦 Parsed data structure:", {
                    hasCurrentModelId: !!data.currentModelId,
                    hasCustomTexture: !!data.customTexture,
                    hasCustomText: !!data.customText,
                    appliedTextsCount: data.appliedTexts?.length || 0,
                    appliedTexturesCount: data.appliedTextures?.length || 0,
                    accessoriesCount: data.accessories?.length || 0,
                    hasModelInfo: !!data.modelInfo,
                    hasMetadata: !!data.metadata
                });

                // Restore các state từ dữ liệu đã lưu
                if (data.currentModelId) {
                    setCurrentModelId(data.currentModelId);
                    console.log("✅ Model ID restored:", data.currentModelId);
                }

                if (data.customTexture) {
                    setCustomTexture(data.customTexture);
                    console.log("✅ Custom texture restored");
                }

                if (data.customText) {
                    setCustomText(data.customText);
                    console.log("✅ Custom text restored:", data.customText);
                }

                if (data.textColor) setTextColor(data.textColor);
                if (data.textBackgroundColor) setTextBackgroundColor(data.textBackgroundColor);
                if (data.textSize) setTextSize(data.textSize);

                if (data.appliedTexts && Array.isArray(data.appliedTexts)) {
                    setAppliedTexts(data.appliedTexts);
                    console.log("✅ Applied texts restored:", data.appliedTexts.length, "items");
                }

                if (data.appliedTextures && Array.isArray(data.appliedTextures)) {
                    setAppliedTextures(data.appliedTextures);
                    console.log("✅ Applied textures restored:", data.appliedTextures.length, "items");
                }

                if (data.accessories && Array.isArray(data.accessories)) {
                    setAccessories(data.accessories);
                    console.log("✅ Accessories restored:", data.accessories.length, "items");
                }

                if (data.textPosition) {
                    setTextPosition(data.textPosition);
                    setTextPositionInput({
                        x: data.textPosition.x.toFixed(2),
                        y: data.textPosition.y.toFixed(2),
                        z: data.textPosition.z.toFixed(2)
                    });
                }

                if (data.texturePosition) {
                    setTexturePosition(data.texturePosition);
                    setTexturePositionInput({
                        x: data.texturePosition.x.toFixed(2),
                        y: data.texturePosition.y.toFixed(2),
                        z: data.texturePosition.z.toFixed(2)
                    });
                }

                if (data.textureScale) setTextureScale(data.textureScale);
                if (data.chestBellyDecalScale) setChestBellyDecalScale(data.chestBellyDecalScale);
                if (data.showTextureOnBack !== undefined) setShowTextureOnBack(data.showTextureOnBack);

                if (data.anchorPoints) {
                    setAnchorPoints(data.anchorPoints);
                    console.log("✅ Anchor points restored");
                }

                if (data.modelPosition) {
                    setModelPosition(data.modelPosition);
                    setModelPositionInput({
                        x: data.modelPosition.x.toFixed(2),
                        y: data.modelPosition.y.toFixed(2),
                        z: data.modelPosition.z.toFixed(2)
                    });
                    console.log("✅ Model position restored");
                }

                // Restore metadata nếu có
                if (data.metadata) {
                    console.log("📊 Metadata:", data.metadata);
                }

                console.log("🎉 Hoàn thành restore thiết kế 3D từ JSON!");

            } catch (error) {
                console.error("❌ Lỗi khi parse JSON và restore thiết kế 3D:", error);
                alert("Có lỗi xảy ra khi load thiết kế 3D!");
            }
        }
    }, [canvas3DData]);

    const snapToZero = (value: number, threshold = 0.05) => (Math.abs(value) < threshold ? 0 : value)

    // Hàm upload model lên Cloudinary khi nhấn "Lưu 3D"
    const uploadModelToCloudinary = async (file: File): Promise<string> => {
        try {
            console.log("☁️ Bắt đầu upload model lên Cloudinary:", file.name);
            console.log("📋 Sử dụng config:", {
                cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
                uploadPreset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
                folder: CLOUDINARY_CONFIG.FOLDERS.ASSETS
            });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
            formData.append('folder', CLOUDINARY_CONFIG.FOLDERS.ASSETS);
            formData.append('resource_type', 'raw');

            const uploadUrl = CLOUDINARY_CONFIG.getUploadUrl('raw');
            console.log("🌐 Upload URL:", uploadUrl);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Kiểm tra lỗi trong response
            if (result.error) {
                console.error("❌ Cloudinary error:", result.error);

                // Xử lý các loại lỗi cụ thể từ Cloudinary
                let errorMessage = result.error.message || 'Upload failed';

                if (result.error.message) {
                    if (result.error.message.includes('File size too large')) {
                        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                        const maxSizeMB = 10;
                        errorMessage = `File quá lớn (${fileSizeMB}MB). Cloudinary chỉ cho phép tối đa ${maxSizeMB}MB. Vui lòng nâng cấp plan hoặc tối ưu hóa thiết kế.`;
                    } else if (result.error.message.includes('Invalid file type')) {
                        errorMessage = 'Loại file không được hỗ trợ. Vui lòng chọn file JSON hợp lệ.';
                    } else if (result.error.message.includes('Upload preset not found')) {
                        errorMessage = 'Cấu hình upload không hợp lệ. Vui lòng liên hệ admin.';
                    } else if (result.error.message.includes('Quota exceeded')) {
                        errorMessage = 'Đã vượt quá giới hạn upload. Vui lòng nâng cấp plan Cloudinary.';
                    }
                }

                throw new Error(errorMessage);
            }

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            console.log("✅ Model upload thành công:", result.secure_url);
            return result.secure_url;

        } catch (error) {
            console.error("❌ Lỗi upload model lên Cloudinary:", error);
            throw error;
        }
    };

    const handleGLBUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.name.toLowerCase().endsWith(".glb")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                const newModel: GLBModel = {
                    id: `uploaded-${Date.now()}`,
                    name: file.name.replace(".glb", ""),
                    url: result,
                }
                setGlbModels((prev) => [...prev, newModel])
                setCurrentModelId(newModel.id)
            }
            reader.readAsDataURL(file)
        } else {
            alert("Vui lòng chọn file .glb hợp lệ!")
        }
    }

    const handleRemoveModel = (modelId: string) => {
        const model = glbModels.find((m) => m.id === modelId)
        if (model?.isDefault || modelId === "small-labubu") {
            alert("Không thể xóa model mẫu!")
            return
        }

        setGlbModels((prev) => prev.filter((m) => m.id !== modelId))
        if (currentModelId === modelId) {
            setCurrentModelId("default-labubu")
        }
    }

    const getCurrentModel = () => {
        return glbModels.find((m) => m.id === currentModelId) || glbModels[0]
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                setUploadedImage(result)
                setCustomTexture(result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleTextAnchorSelect = (anchorKey: string) => {
        const anchor = anchorPoints[anchorKey as keyof typeof anchorPoints]
        if (anchor) {
            console.log("[v0] Selecting text anchor:", anchorKey, "Current text:", customText)
            setTextPosition({ x: anchor.x, y: anchor.y, z: anchor.z })
            setSelectedTextAnchor(anchorKey)
            if (!customText) {
                console.log("[v0] Warning: customText is empty when selecting anchor")
            }
            setTextPositionInput({ x: anchor.x.toFixed(2), y: anchor.y.toFixed(2), z: anchor.z.toFixed(2) })
        }
    }

    const handleTextureAnchorSelect = (anchorKey: string) => {
        const anchor = anchorPoints[anchorKey as keyof typeof anchorPoints]
        if (anchor) {
            setTexturePosition({ x: anchor.x, y: anchor.y, z: anchor.z })
            setSelectedTextureAnchor(anchorKey)
            setTexturePositionInput({ x: anchor.x.toFixed(2), y: anchor.y.toFixed(2), z: anchor.z.toFixed(2) })
        }
    }

    const handleAnchorPositionChange = (anchorKey: string, axis: "x" | "y" | "z", value: number) => {
        setAnchorPoints((prev) => ({
            ...prev,
            [anchorKey]: {
                ...prev[anchorKey as keyof typeof prev],
                [axis]: value,
            },
        }))
    }

    const handleResetAnchorPoints = () => {
        const currentPoints = getCurrentAnchorPoints()
        setAnchorPoints(currentPoints)
        setEditingAnchor("")
    }

    const handleSaveAnchorPoints = () => {
        console.log("Anchor points saved:", anchorPoints)
        setEditingAnchor("")
    }

    const handleApplyText = () => {
        if (!customText.trim()) return

        const newText = {
            id: Date.now().toString(),
            text: customText,
            position: { ...textPosition },
            color: textColor,
            backgroundColor: textBackgroundColor,
            size: textSize,
        }

        setAppliedTexts((prev) => [...prev, newText])

        setCustomText("")
        setTextColor("#000000")
        setTextBackgroundColor("#ffffff")
        setTextSize(1)
        setTextPosition({ x: 0, y: 1, z: 0.5 })
        setSelectedTextAnchor("")
        setTextPositionInput({ x: "0.00", y: "1.00", z: "0.50" })

        console.log("[v0] Text applied and controls reset:", newText)
    }

    const handleApplyTexture = () => {
        if (!customTexture && !uploadedImage) return

        const textureUrl = uploadedImage || customTexture
        const newTexture = {
            id: Date.now().toString(),
            texture: textureUrl,
            position: { ...texturePosition },
            scale: textureScale,
        }

        setAppliedTextures((prev) => [...prev, newTexture])

        // Reset texture controls
        setCustomTexture("")
        setUploadedImage("")
        setTexturePosition({ x: 0, y: 0, z: 0.3 })
        setTextureScale(1)
        setSelectedTextureAnchor("")
        setTexturePositionInput({ x: "0.00", y: "0.00", z: "0.30" })
    }

    const handleRemoveAppliedText = (id: string) => {
        setAppliedTexts((prev) => prev.filter((text) => text.id !== id))
    }

    const handleRemoveAppliedTexture = (id: string) => {
        setAppliedTextures((prev) => prev.filter((texture) => texture.id !== id))
    }

    const handleReset = () => {
        setCustomTexture("")
        setCustomText("")
        setTextColor("#000000")
        setTextBackgroundColor("#ffffff")
        setTextSize(1)
        setUploadedImage("")
        setTextPosition({ x: 0, y: 1, z: 0.5 })
        setTexturePosition({ x: 0, y: 0, z: 0.3 })
        setTextureScale(1)
        setIsRotating(false) // Dừng quay khi reset
        setIsAttached(false)
        setSelectedTextAnchor("")
        setSelectedTextureAnchor("")
        setTextPositionInput({ x: "0.00", y: "1.00", z: "0.50" })
        setTexturePositionInput({ x: "0.00", y: "0.00", z: "0.30" })
        setModelPosition({ x: 0, y: 0, z: 0 })
        setModelPositionInput({ x: "0.00", y: "0.00", z: "0.00" })
        setShowAnchorPoints(false)
        setAppliedTexts([])
        setAppliedTextures([]) // Cũng reset textures đã áp dụng
        setAccessories([]) // Reset accessories
        setSelectedAccessory("")
        setChestBellyDecalScale(8.0) // Reset về giá trị mặc định
        setShowTextureOnBack(false) // Reset về không hiển thị ở phía sau
        console.log("Reset completed - rotation stopped")
    }

    // Hàm load và parse scene GLB từ Cloudinary
    const loadSceneFromGLB = async (sceneUrl: string) => {
        try {
            console.log("🔄 Đang load scene GLB từ:", sceneUrl);

            // Load GLB file từ Cloudinary
            const loader = new GLTFLoader();
            const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
                loader.load(sceneUrl, resolve, undefined, reject);
            });

            console.log("✅ GLB scene đã load thành công");

            // Parse scene để lấy thông tin
            const scene = gltf.scene;

            // Đếm số lượng elements trong scene
            let texturesCount = 0;
            let accessoriesCount = 0;
            let textsCount = 0;

            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    // Kiểm tra loại mesh
                    if (child.material && (child.material as THREE.MeshBasicMaterial).map) {
                        // Có texture
                        texturesCount++;
                    } else if (child.geometry instanceof THREE.PlaneGeometry) {
                        // Có thể là text plane
                        textsCount++;
                    } else {
                        // Có thể là accessory
                        accessoriesCount++;
                    }
                }
            });

            // Trả về cả scene object và thông tin
            return {
                scene: scene.clone(), // Clone scene để sử dụng
                modelName: getCurrentModel().name,
                sceneInfo: {
                    texturesCount,
                    accessoriesCount,
                    textsCount,
                    hasCurrentTexture: texturesCount > 0,
                    hasCurrentText: textsCount > 0
                }
            };

        } catch (error) {
            console.error("❌ Lỗi khi load scene GLB:", error);
            return null;
        }
    };

    // Hàm restore scene từ JSON data (format mới)
    const restoreSceneFromJSON = async (jsonData: Canvas3DJSONData) => {
        try {
            // Clear current scene state
            setAppliedTexts([]);
            setAppliedTextures([]);
            setAccessories([]);
            setCustomTexture('');
            setCustomText('');
            setTextColor('#000000');
            setTextBackgroundColor('#ffffff');
            setTextSize(1);

            // Restore main model
            setCurrentModelId(jsonData.currentModelId || 'default-labubu');
            if (jsonData.anchorPoints) {
                setAnchorPoints(jsonData.anchorPoints);
            }

            // Restore custom texture and text
            if (jsonData.customTexture) {
                setCustomTexture(jsonData.customTexture);
            }
            if (jsonData.customText) {
                setCustomText(jsonData.customText);
            }
            if (jsonData.textColor) {
                setTextColor(jsonData.textColor);
            }
            if (jsonData.textBackgroundColor) {
                setTextBackgroundColor(jsonData.textBackgroundColor);
            }
            if (jsonData.textSize) {
                setTextSize(jsonData.textSize);
            }

            // Restore applied elements
            if (jsonData.appliedTexts) {
                setAppliedTexts(jsonData.appliedTexts);
            }
            if (jsonData.appliedTextures) {
                setAppliedTextures(jsonData.appliedTextures);
            }
            if (jsonData.accessories) {
                setAccessories(jsonData.accessories);
            }

            // Restore positions and scales
            if (jsonData.textPosition) {
                setTextPosition(jsonData.textPosition);
            }
            if (jsonData.texturePosition) {
                setTexturePosition(jsonData.texturePosition);
            }
            if (jsonData.textureScale) {
                setTextureScale(jsonData.textureScale);
            }
            if (jsonData.chestBellyDecalScale) {
                setChestBellyDecalScale(jsonData.chestBellyDecalScale);
            }
            if (jsonData.showTextureOnBack !== undefined) {
                setShowTextureOnBack(jsonData.showTextureOnBack);
            }

            // Restore anchor points and model position
            if (jsonData.anchorPoints) {
                setAnchorPoints(jsonData.anchorPoints);
            }
            if (jsonData.modelPosition) {
                setModelPosition(jsonData.modelPosition);
            }

            // Restore selections
            if (jsonData.selectedTextAnchor) {
                setSelectedTextAnchor(jsonData.selectedTextAnchor);
            }
            if (jsonData.selectedTextureAnchor) {
                setSelectedTextureAnchor(jsonData.selectedTextureAnchor);
            }

            // Instead of creating an empty THREE.Group, we'll set loadedScene to null
            // and let the LabubuModel component handle rendering based on the restored state
            // This approach is better because:
            // 1. The component already has all the state variables restored
            // 2. It can render the scene dynamically based on current state
            // 3. No need to manually construct complex 3D objects
            setLoadedScene(null);

            console.log('✅ Scene state restored successfully. Component will render based on restored state.');

            console.log('Scene restored from JSON successfully');
        } catch (error) {
            console.error('Error restoring scene from JSON:', error);
        }
    };

    // Hàm lưu 3D - Convert scene thành JSON và upload lên Cloudinary
    // ✅ Hỗ trợ lưu tất cả thiết kế: model mặc định, model tùy chỉnh, có texture/accessory/text
    // 💡 Format mới: JSON (nhẹ hơn GLB, không bị giới hạn 10MB của Cloudinary)
    const handleSave3D = async () => {
        try {
            // Bật loading state
            setIsSaving3D(true);

            console.log("🚀 Bắt đầu lưu thiết kế 3D (convert to JSON)...");
            console.log("📋 Thông tin thiết kế hiện tại:");
            console.log("  • Model ID:", currentModelId);
            console.log("  • Model Name:", getCurrentModel().name);
            console.log("  • Is Default Model:", getCurrentModel().isDefault);
            console.log("  • Textures đã apply:", appliedTextures.length);
            console.log("  • Accessories:", accessories.length);
            console.log("  • Texts đã apply:", appliedTexts.length);
            console.log("  • Texture hiện tại:", !!(customTexture || uploadedImage));
            console.log("  • Text hiện tại:", customText || "Không có");

            // ✅ Tạo JSON data thay vì export GLB
            const canvas3DData = {
                // Thông tin model
                currentModelId,
                modelName: getCurrentModel().name,
                isDefaultModel: getCurrentModel().isDefault,
                modelUrl: getCurrentModel().url,

                // Thông tin texture
                customTexture: customTexture || uploadedImage,
                texturePosition,
                textureScale,
                chestBellyDecalScale,
                showTextureOnBack,
                selectedTextureAnchor,

                // Thông tin text
                customText: customText || "",
                textColor,
                textBackgroundColor,
                textSize,
                textPosition,
                selectedTextAnchor,

                // Các elements đã apply
                appliedTexts,
                appliedTextures,
                accessories,

                // Vị trí và cấu hình
                modelPosition,
                anchorPoints,

                // Metadata
                savedAt: new Date().toISOString(),
                version: "1.0",
                sceneInfo: {
                    texturesCount: appliedTextures.length + (customTexture || uploadedImage ? 1 : 0),
                    accessoriesCount: accessories.length,
                    textsCount: appliedTexts.length + (customText ? 1 : 0),
                    hasCurrentTexture: !!(customTexture || uploadedImage),
                    hasCurrentText: !!(customText && customText.trim() !== "")
                }
            };

            console.log("📦 JSON data đã tạo:", {
                size: JSON.stringify(canvas3DData).length,
                elements: canvas3DData.sceneInfo
            });

            // Convert JSON thành file để upload lên Cloudinary
            const jsonBlob = new Blob([JSON.stringify(canvas3DData, null, 2)], {
                type: 'application/json'
            });

            const jsonFile = new File([jsonBlob], `canvas3d_${getCurrentModel().name}_${Date.now()}.json`, {
                type: 'application/json'
            });

            console.log("📁 File JSON đã tạo:", jsonFile.name, "kích thước:", jsonFile.size, "bytes");

            // Upload JSON file lên Cloudinary
            console.log("☁️ Đang upload JSON lên Cloudinary...");
            const cloudinaryUrl = await uploadModelToCloudinary(jsonFile);
            console.log("✅ JSON đã upload lên Cloudinary:", cloudinaryUrl);

            // Lưu Cloudinary URL vào database thông qua canvas3D field
            if (onSave) {
                // ✅ Lưu JSON data thay vì GLB URL
                const canvas3DString = JSON.stringify({
                    jsonUrl: cloudinaryUrl, // URL của JSON file
                    modelName: getCurrentModel().name,
                    isDefaultModel: getCurrentModel().isDefault,
                    savedAt: new Date().toISOString(),
                    sceneInfo: canvas3DData.sceneInfo,
                    // Thêm preview data để hiển thị trong list
                    preview: {
                        modelId: currentModelId,
                        hasTexture: !!(customTexture || uploadedImage),
                        hasText: !!(customText && customText.trim() !== ""),
                        elementsCount: appliedTexts.length + appliedTextures.length + accessories.length
                    }
                });

                onSave(canvas3DString); // Truyền JSON string để lưu vào canvas3D field
                console.log("🚀 Đã gọi callback onSave với canvas3D data:", canvas3DString);
            }

            console.log("🎉 Lưu thiết kế 3D thành công!");
            console.log("✅ Đã lưu thiết kế với model:", getCurrentModel().isDefault ? "MẶC ĐỊNH" : "TÙY CHỈNH");
            console.log("✅ Scene bao gồm:", {
                model: getCurrentModel().name,
                textures: appliedTextures.length,
                accessories: accessories.length,
                texts: appliedTexts.length
            });

            // toast.success("✅ Thiết kế 3D đã được lưu thành công!", {
            //     description: "📁 Đã lưu dưới dạng JSON (nhẹ hơn GLB)\n☁️ File đã được upload lên Cloudinary\n💾 Dữ liệu đã được lưu vào database"
            // });

        } catch (error) {
            console.error("❌ Lỗi khi lưu thiết kế 3D:", error);
            console.error("❌ Error details:", {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : "No stack trace",
                currentState: {
                    currentModelId,
                    customTexture: !!customTexture,
                    customText: !!customText,
                    appliedTextsCount: appliedTexts.length,
                    appliedTexturesCount: appliedTextures.length,
                    accessoriesCount: accessories.length
                }
            });

            // Hiển thị lỗi chi tiết từ Cloudinary
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error("❌ Lỗi khi lưu thiết kế 3D!", {
                description: errorMessage
            });
        } finally {
            // Tắt loading state
            setIsSaving3D(false);
        }
    };

    const handleExport = async () => {
        const scene = new THREE.Scene()
        // Root group for export so we can apply a final orientation transform
        const exportRoot = new THREE.Group()
        // Keep default Y-up (Three.js) to match viewport

        const loader = new GLTFLoader()

        try {
            // Load the main model
            const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
                loader.load(getCurrentModel().url, resolve, undefined, reject)
            })

            const model = gltf.scene.clone()
            // Xác định scale dựa trên model ID
            const getExportModelScale = () => {
                switch (currentModelId) {
                    case "small-labubu":
                        return 1
                    case "default-labubu":
                    default:
                        return 1
                }
            }
            const modelScale = getExportModelScale()
            model.scale.set(modelScale, modelScale, modelScale)
            // Áp dụng cùng xoay như viewport (chuyển từ Blender Z-up sang Three.js Y-up + lộn 180°)
            model.rotation.set(-Math.PI / 2 + Math.PI, 0, 0)
            // Áp dụng vị trí model hiện tại
            model.position.set(modelPosition.x, modelPosition.y, modelPosition.z)
            exportRoot.add(model)

            // Helper function to load texture properly
            const loadTexture = (url: string): Promise<THREE.Texture> => {
                return new Promise((resolve, reject) => {
                    const textureLoader = new THREE.TextureLoader()
                    textureLoader.load(
                        url,
                        (texture) => {
                            texture.flipY = false // Fix texture orientation
                            resolve(texture)
                        },
                        undefined,
                        reject,
                    )
                })
            }

            // Load and add applied textures
            const texturePromises = appliedTextures.map(async (textureData) => {
                try {
                    const texture = await loadTexture(textureData.texture)
                    const geometry = new THREE.PlaneGeometry(1, 1)
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(textureData.position.x, textureData.position.y, textureData.position.z)
                    mesh.scale.set(textureData.scale, textureData.scale, 1)
                    // Xoay giống viewport
                    mesh.rotation.set(Math.PI / 2, 0, 0)
                    exportRoot.add(mesh)
                } catch (error) {
                    console.warn("[v0] Failed to load texture:", textureData.texture, error)
                }
            })

            // Add current texture if exists
            if (customTexture || uploadedImage) {
                try {
                    const texture = await loadTexture(customTexture || uploadedImage)
                    const geometry = new THREE.PlaneGeometry(1, 1)
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide,
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(texturePosition.x, texturePosition.y, texturePosition.z)
                    mesh.scale.set(textureScale, textureScale, 1)
                    // Xoay giống viewport
                    mesh.rotation.set(Math.PI / 2, 0, 0)
                    exportRoot.add(mesh)
                } catch (error) {
                    console.warn("[v0] Failed to load current texture:", error)
                }
            }

            // Wait for all textures to load
            await Promise.allSettled(texturePromises)

            // Load and add accessories
            const accessoryPromises = accessories.map(async (accessory) => {
                try {
                    const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
                        loader.load(accessory.url, resolve, undefined, reject)
                    })
                    const accessoryModel = gltf.scene.clone()
                    accessoryModel.position.set(accessory.position.x, accessory.position.y, accessory.position.z)
                    accessoryModel.scale.set(accessory.scale, accessory.scale, accessory.scale)
                    // Áp dụng xoay người dùng và quy đổi sang viewport
                    accessoryModel.rotation.set(
                        accessory.rotation.x + (-Math.PI / 2 + Math.PI),
                        accessory.rotation.y,
                        accessory.rotation.z
                    )
                    exportRoot.add(accessoryModel)
                } catch (error) {
                    console.warn("[v0] Failed to load accessory:", accessory.name, error)
                }
            })

            // Wait for all accessories to load
            await Promise.allSettled(accessoryPromises)

            // Render text (áp dụng text đã thêm và text hiện tại) bằng canvas texture
            const createTextPlane = (text: string, color: string, size: number) => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
                const fontPx = Math.max(16, Math.round(size * 64))
                ctx.font = `${fontPx}px Arial`
                const metrics = ctx.measureText(text)
                const padding = Math.round(fontPx * 0.5)
                canvas.width = Math.ceil(metrics.width) + padding * 2
                canvas.height = fontPx + padding * 2
                const ctx2 = canvas.getContext("2d") as CanvasRenderingContext2D
                ctx2.clearRect(0, 0, canvas.width, canvas.height)
                ctx2.font = `${fontPx}px Arial`
                ctx2.fillStyle = color
                ctx2.textBaseline = "middle"
                ctx2.textAlign = "left"
                ctx2.fillText(text, padding, canvas.height / 2)
                const texture = new THREE.CanvasTexture(canvas)
                texture.flipY = false
                texture.needsUpdate = true
                const aspect = canvas.width / canvas.height
                const geometry = new THREE.PlaneGeometry(1 * aspect, 1)
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
                const mesh = new THREE.Mesh(geometry, material)
                // Xoay giống viewport
                mesh.rotation.set(Math.PI / 2, 0, 0)
                return mesh
            }

            // Áp dụng danh sách text đã apply
            appliedTexts.forEach((t) => {
                const textMesh = createTextPlane(t.text, t.color, t.size)
                textMesh.position.set(t.position.x, t.position.y, t.position.z)
                exportRoot.add(textMesh)
            })

            // Áp dụng text hiện tại (nếu có)
            if (customText && customText.trim() !== "") {
                const currentTextMesh = createTextPlane(customText, textColor, textSize)
                currentTextMesh.position.set(textPosition.x, textPosition.y, textPosition.z)
                exportRoot.add(currentTextMesh)
            }

            // Apply final X flip of -90° for exported GLB
            exportRoot.rotation.x -= Math.PI / 2
            scene.add(exportRoot)

            // Export to GLB
            const exporter = new GLTFExporter()
            exporter.parse(
                scene,
                (result) => {
                    const blob = new Blob([result as ArrayBuffer], { type: "application/octet-stream" })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `${getCurrentModel().name}_customized.glb`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                    console.log("[v0] GLB export completed successfully")
                },
                (error) => {
                    console.error("Export error:", error)
                    alert("Có lỗi xảy ra khi xuất file GLB")
                },
                { binary: true },
            )
        } catch (error) {
            console.error("Export error:", error)
            alert("Có lỗi xảy ra khi xuất file GLB")
        }
    }

    const handleAttach = () => {
        setIsAttached(true)
        console.log("Text and texture attached to model")
    }

    const handleToggleRotation = () => {
        setIsRotating(prev => !prev)
        console.log("Rotation toggled:", !isRotating)
    }

    const handleQuickMoveText = (direction: "next" | "prev") => {
        const anchorKeys = Object.keys(anchorPoints)
        const currentIndex = anchorKeys.indexOf(selectedTextAnchor)
        let newIndex

        if (direction === "next") {
            newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % anchorKeys.length
        } else {
            newIndex =
                currentIndex === -1 ? anchorKeys.length - 1 : (currentIndex - 1 + anchorKeys.length) % anchorKeys.length
        }

        handleTextAnchorSelect(anchorKeys[newIndex])
    }

    const handleQuickMoveTexture = (direction: "next" | "prev") => {
        const anchorKeys = Object.keys(anchorPoints)
        const currentIndex = anchorKeys.indexOf(selectedTextureAnchor)
        let newIndex

        if (direction === "next") {
            newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % anchorKeys.length
        } else {
            newIndex =
                currentIndex === -1 ? anchorKeys.length - 1 : (currentIndex - 1 + anchorKeys.length) % anchorKeys.length
        }

        handleTextureAnchorSelect(anchorKeys[newIndex])
    }

    const handleClearTextPosition = () => {
        setCustomText("")
        setSelectedTextAnchor("")
        setTextPosition({ x: 0, y: 1, z: 0.5 })
    }

    const handleClearTexturePosition = () => {
        setCustomTexture("")
        setUploadedImage("")
        setSelectedTextureAnchor("")
        setTexturePosition({ x: 0, y: 0, z: 0.3 })
    }

    const handleAccessoryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.name.toLowerCase().endsWith(".glb")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result as string
                const newAccessory: AccessoryModel = {
                    id: `accessory-${Date.now()}`,
                    name: file.name.replace(".glb", ""),
                    url: result,
                    position: { x: 0, y: 0, z: 0 },
                    scale: 1,
                    rotation: { x: 0, y: 0, z: 0 }
                }
                setAccessories(prev => [...prev, newAccessory])
                setSelectedAccessory(newAccessory.id)
            }
            reader.readAsDataURL(file)
        } else {
            alert("Vui lòng chọn file .glb hợp lệ!")
        }
    }

    const handleAccessoryPositionChange = (accessoryId: string, axis: "x" | "y" | "z", value: number) => {
        setAccessories(prev => prev.map(acc =>
            acc.id === accessoryId
                ? { ...acc, position: { ...acc.position, [axis]: value } }
                : acc
        ))
    }

    const handleAccessoryScaleChange = (accessoryId: string, value: number) => {
        setAccessories(prev => prev.map(acc =>
            acc.id === accessoryId
                ? { ...acc, scale: value }
                : acc
        ))
    }

    const clampAngleRad0ToTwoPi = (angle: number) => {
        const twoPi = Math.PI * 2
        if (angle < 0) return 0
        if (angle > twoPi) return twoPi
        return angle
    }

    // Ensure sliders snap to exact 0° and 360°
    const degreesToRadiansSnap = (degrees: number, epsilon = 0.5) => {
        if (degrees <= epsilon) return 0
        if (degrees >= 360 - epsilon) return Math.PI * 2
        return (degrees * Math.PI) / 180
    }

    const radiansToDegreesRounded = (radians: number) => {
        const deg = (radians * 180) / Math.PI
        if (deg < 0) return 0
        if (deg > 360) return 360
        return Math.round(deg)
    }

    const handleAccessoryRotationChange = (accessoryId: string, axis: "x" | "y" | "z", value: number) => {
        setAccessories(prev => prev.map(acc =>
            acc.id === accessoryId
                ? {
                    ...acc,
                    rotation: {
                        ...acc.rotation,
                        [axis]: (axis === "x" || axis === "y" || axis === "z") ? clampAngleRad0ToTwoPi(value) : value
                    }
                }
                : acc
        ))
    }

    const handleAccessoryAnchorSelect = (accessoryId: string, anchorKey: string) => {
        const anchor = anchorPoints[anchorKey as keyof typeof anchorPoints]
        if (anchor) {
            setAccessories(prev => prev.map(acc =>
                acc.id === accessoryId
                    ? {
                        ...acc,
                        position: { x: anchor.x, y: anchor.y, z: anchor.z },
                        anchorPoint: anchorKey
                    }
                    : acc
            ))
        }
    }

    const handleRemoveAccessory = (accessoryId: string) => {
        setAccessories(prev => prev.filter(acc => acc.id !== accessoryId))
        if (selectedAccessory === accessoryId) {
            setSelectedAccessory("")
        }
    }



    // Check if we're coming from chat with 3D design data
    useEffect(() => {
        if (location.state?.fromChat && location.state?.canvas3DData) {
            const { canvas3DData: chatCanvas3D } = location.state



            // Auto-load the design
            if (chatCanvas3D && !canvas3DData) {
                // Parse and restore the design
                try {
                    const data = JSON.parse(chatCanvas3D)


                    // Restore the design (similar to existing useEffect)
                    if (data.currentModelId) {
                        setCurrentModelId(data.currentModelId)
                    }
                    if (data.customTexture) {
                        setCustomTexture(data.customTexture)
                    }
                    if (data.customText) {
                        setCustomText(data.customText)
                    }
                    if (data.appliedTexts) {
                        setAppliedTexts(data.appliedTexts)
                    }
                    if (data.appliedTextures) {
                        setAppliedTextures(data.appliedTextures)
                    }
                    if (data.accessories) {
                        setAccessories(data.accessories)
                    }
                    if (data.anchorPoints) {
                        setAnchorPoints(data.anchorPoints)
                    }
                    if (data.modelPosition) {
                        setModelPosition(data.modelPosition)
                    }



                } catch (error) {
                    console.error("❌ Lỗi khi load thiết kế 3D từ chat:", error)
                }
            }

            // Clear the state to avoid re-loading
            window.history.replaceState({}, document.title)
        }
    }, [location.state, canvas3DData])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

            <Navbar />
            <div className="container mx-auto p-4">

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">3D - {getCurrentModel().name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Nút quay lại 2D */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onBackTo2D}
                            className="text-white border-white/20 hover:bg-white/10"
                        >
                            ← Quay lại 2D
                        </Button>
                        <Button
                            variant={showCanvas3DList ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowCanvas3DList(!showCanvas3DList)}
                            className="text-white border-white/20"
                        >
                            <Box className="w-4 h-4 mr-2" />
                            Dự án 3D
                        </Button>
                        <Button
                            variant={showAnchorPoints ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowAnchorPoints(!showAnchorPoints)}
                            className="text-white border-white/20"
                        >
                            {showAnchorPoints ? "Ẩn điểm neo" : "Hiện điểm neo"}
                        </Button>
                        <Button
                            variant={showAxes ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowAxes(!showAxes)}
                            className="text-white border-white/20"
                        >
                            {showAxes ? "Ẩn trục XYZ" : "Hiện trục XYZ"}
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant={isRotating ? "default" : "outline"}
                                size="sm"
                                onClick={handleToggleRotation}
                                className={`text-white border-white/20 ${isRotating ? "bg-green-600 hover:bg-green-700" : ""}`}
                            >
                                {isRotating ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                                {isRotating ? "Dừng quay" : "Bắt đầu quay"}
                            </Button>
                        </div>
                        <Button
                            variant={isAttached ? "default" : "outline"}
                            size="sm"
                            onClick={handleAttach}
                            disabled={isAttached}
                        >
                            <Link className="w-4 h-4 mr-1" />
                            {isAttached ? "Đã ghép" : "Ghép"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </Button>

                        <Button
                            onClick={handleSave3D}
                            disabled={isSaving3D}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSaving3D ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Lưu 3D
                                </>
                            )}
                        </Button>
                        <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất GLB
                        </Button>

                        {/* Nút xóa scene đã load */}
                        {loadedScene && (
                            <Button
                                onClick={() => {
                                    setLoadedScene(null);
                                    console.log("🗑️ Đã xóa scene đã load");
                                }}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa Scene
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-[70vh] p-0">
                            <CardContent className="h-full p-0">
                                <div className="relative bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden h-full">
                                    {canvasModelDims && (
                                        <div className="absolute top-2 left-2 z-10 min-w-[220px] pointer-events-none bg-black/60 text-white text-xs px-3 py-2 rounded shadow border border-white/20 space-y-1">
                                            <div className="font-semibold text-[11px] opacity-90">Vị trí:</div>
                                            <div className="grid grid-cols-7 gap-x-2">
                                                <div className="col-span-2 opacity-75">X</div>
                                                <div className="col-span-5">{modelPosition.x.toFixed(2)} m ({(modelPosition.x * 100).toFixed(1)} cm)</div>
                                                <div className="col-span-2 opacity-75">Y</div>
                                                <div className="col-span-5">{modelPosition.y.toFixed(2)} m ({(modelPosition.y * 100).toFixed(1)} cm)</div>
                                                <div className="col-span-2 opacity-75">Z</div>
                                                <div className="col-span-5">{modelPosition.z.toFixed(2)} m ({(modelPosition.z * 100).toFixed(1)} cm)</div>
                                            </div>
                                            <div className="font-semibold text-[11px] opacity-90 mt-1">Kích thước:</div>
                                            <div className="grid grid-cols-7 gap-x-2">
                                                <div className="col-span-2 opacity-75">X</div>
                                                <div className="col-span-5">{(canvasModelDims?.width ?? 0).toFixed(3)} m ({(((canvasModelDims?.width ?? 0) * 100)).toFixed(1)} cm)</div>
                                                <div className="col-span-2 opacity-75">Y</div>
                                                <div className="col-span-5">{(canvasModelDims?.depth ?? 0).toFixed(3)} m ({(((canvasModelDims?.depth ?? 0) * 100)).toFixed(1)} cm)</div>
                                                <div className="col-span-2 opacity-75">Z</div>
                                                <div className="col-span-5">{(canvasModelDims?.height ?? 0).toFixed(3)} m ({(((canvasModelDims?.height ?? 0) * 100)).toFixed(1)} cm)</div>
                                            </div>
                                        </div>
                                    )}
                                    <Canvas className="w-full h-full relative" camera={{
                                        position: [0, -5, 0], // Camera ở trên cao, nhìn xuống
                                        fov: 50,
                                        up: [0, 0, 1] // Định hướng "up" của camera
                                    }}>
                                        <ambientLight intensity={0.5} />
                                        <directionalLight position={[10, 10, 5]} intensity={1} />
                                        {/* Removed duplicate axesHelper - using custom axes instead */}


                                        <Suspense fallback={<LoadingSpinner />}>
                                            <LabubuModel
                                                modelPath={getCurrentModel().url}
                                                modelId={currentModelId}
                                                customTexture={customTexture || uploadedImage}
                                                customText={customText}
                                                textColor={textColor}
                                                textBackgroundColor={textBackgroundColor}
                                                textSize={textSize}
                                                textPosition={textPosition}
                                                texturePosition={texturePosition}
                                                textureScale={textureScale}
                                                chestBellyDecalScale={chestBellyDecalScale}
                                                showTextureOnBack={showTextureOnBack}
                                                isRotating={isRotating}
                                                isAttached={isAttached}
                                                anchorPoints={anchorPoints}
                                                showAnchorPoints={showAnchorPoints}
                                                selectedTextAnchor={selectedTextAnchor}
                                                selectedTextureAnchor={selectedTextureAnchor}
                                                textMeshRef={textMeshRef}
                                                textureMeshRef={textureMeshRef}
                                                appliedTexts={appliedTexts}
                                                appliedTextures={appliedTextures}
                                                accessories={accessories}
                                                showAxes={showAxes}
                                                modelPosition={modelPosition}
                                                onDimensionsChange={setCanvasModelDims}
                                                loadedScene={loadedScene || undefined}
                                            />
                                            <Environment preset="studio" />
                                        </Suspense>
                                        <OrbitControls
                                            enablePan={true}
                                            enableZoom={true}
                                            enableRotate={!isRotating}
                                            // Cho phép xoay camera 360° không giới hạn
                                            minPolarAngle={0} // Góc dọc tối thiểu (0°)
                                            maxPolarAngle={Math.PI} // Góc dọc tối đa (180°)
                                            // Cho phép xoay ngang 360° quanh trục Z
                                            minAzimuthAngle={-Infinity}
                                            maxAzimuthAngle={Infinity}
                                            // Điểm trung tâm camera nhìn vào
                                            target={[0, 0, 0]}
                                        />
                                    </Canvas>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Công cụ chỉnh sửa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="models" className="w-full">
                                    <TabsList className="grid w-full grid-cols-6">
                                        <TabsTrigger value="models" className="flex items-center gap-1">
                                            {/* <Box className="w-4 h-4" /> */}
                                            Models
                                        </TabsTrigger>
                                        <TabsTrigger value="position" className="flex items-center gap-1">
                                            {/* <Target className="w-4 h-4" /> */}
                                            Vị trí
                                        </TabsTrigger>
                                        <TabsTrigger value="texture" className="flex items-center gap-1">
                                            {/* <ImageIcon className="w-4 h-4" /> */}
                                            Ảnh
                                        </TabsTrigger>
                                        <TabsTrigger value="text" className="flex items-center gap-1">
                                            {/* <Type className="w-4 h-4" /> */}
                                            Văn bản
                                        </TabsTrigger>
                                        <TabsTrigger value="accessories" className="flex items-center gap-1">
                                            {/* <Plus className="w-4 h-4" /> */}
                                            Phụ kiện
                                        </TabsTrigger>
                                        <TabsTrigger value="anchors" className="flex items-center gap-1">
                                            {/* <Settings className="w-4 h-4" /> */}
                                            Điểm neo
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="models" className="space-y-4">
                                        <div>
                                            <Label htmlFor="glb-upload">Upload file GLB</Label>
                                            <div className="mt-2">
                                                <Input
                                                    id="glb-upload"
                                                    type="file"
                                                    accept=".glb"
                                                    onChange={handleGLBUpload}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Chỉ hỗ trợ file .glb.
                                            </p>
                                        </div>

                                        <div>
                                            <Label>Model hiện tại</Label>
                                            <div className="mt-2 space-y-2">
                                                {glbModels.map((model) => (
                                                    <div
                                                        key={model.id}
                                                        className={`flex items-center justify-between p-3 rounded-lg border ${currentModelId === model.id ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant={currentModelId === model.id ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handleModelChange(model.id)}
                                                                className="text-xs"
                                                            >
                                                                {currentModelId === model.id ? <Check className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                                            </Button>
                                                            <div>
                                                                <div className="font-medium text-sm flex items-center gap-2">
                                                                    {model.name}
                                                                </div>
                                                                {/* {model.isDefault && <div className="text-xs text-gray-500">Model mặc định</div>}
                                                                {model.id === "small-labubu" && <div className="text-xs text-blue-500">✨ Labubu Classic - tỷ lệ thực</div>}
                                                                {model.id === "default-labubu" && <div className="text-xs text-green-500">🔧 7 điểm neo</div>} */}
                                                            </div>
                                                        </div>
                                                        {!model.isDefault && model.id !== "small-labubu" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveModel(model.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="position" className="space-y-4">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-start gap-2">
                                                <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <div className="font-medium text-blue-800">Điều chỉnh vị trí model chính:</div>
                                                    <ul className="text-blue-700 text-xs mt-1 space-y-1">
                                                        <li>• <strong>X (đỏ):</strong> Trục ngang - trái (-) / phải (+)</li>
                                                        <li>• <strong>Y (xanh lá):</strong>Trục sâu - gần (-) / xa (+)</li>
                                                        <li>• <strong>Z (xanh dương):</strong>Trục dọc - xuống (-) / lên (+)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Vị trí model (X, Y, Z)</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label htmlFor="model-x" className="text-xs text-red-600 font-medium">
                                                        X (Trái/Phải)
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="model-x"
                                                        min={-3}
                                                        max={3}
                                                        step={0.01}
                                                        value={[modelPosition.x]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setModelPosition((prev) => ({ ...prev, x: snapped }))
                                                            setModelPositionInput((prev) => ({ ...prev, x: snapped.toFixed(2) }))
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-red-500" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-red-500 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={modelPositionInput.x}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setModelPositionInput((prev) => ({ ...prev, x: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setModelPosition((prev) => ({ ...prev, x: snapped }))
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (modelPositionInput.x.trim() === "") {
                                                                setModelPosition((prev) => ({ ...prev, x: 0 }))
                                                                setModelPositionInput((prev) => ({ ...prev, x: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs border-red-200 focus:border-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="model-y" className="text-xs text-green-600 font-medium">
                                                        Y (Gần/Xa)
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="model-y"
                                                        min={-3}
                                                        max={3}
                                                        step={0.01}
                                                        value={[modelPosition.y]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setModelPosition((prev) => ({ ...prev, y: snapped }))
                                                            setModelPositionInput((prev) => ({ ...prev, y: snapped.toFixed(2) }))
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-green-500" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-green-500 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={modelPositionInput.y}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setModelPositionInput((prev) => ({ ...prev, y: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setModelPosition((prev) => ({ ...prev, y: snapped }))
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (modelPositionInput.y.trim() === "") {
                                                                setModelPosition((prev) => ({ ...prev, y: 0 }))
                                                                setModelPositionInput((prev) => ({ ...prev, y: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs border-green-200 focus:border-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="model-z" className="text-xs text-blue-600 font-medium">
                                                        Z (Xuống/Lên)
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="model-z"
                                                        min={-3}
                                                        max={3}
                                                        step={0.01}
                                                        value={[modelPosition.z]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setModelPosition((prev) => ({ ...prev, z: snapped }))
                                                            setModelPositionInput((prev) => ({ ...prev, z: snapped.toFixed(2) }))
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-500 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={modelPositionInput.z}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setModelPositionInput((prev) => ({ ...prev, z: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setModelPosition((prev) => ({ ...prev, z: snapped }))
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (modelPositionInput.z.trim() === "") {
                                                                setModelPosition((prev) => ({ ...prev, z: 0 }))
                                                                setModelPositionInput((prev) => ({ ...prev, z: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs border-blue-200 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setModelPosition({ x: 0, y: 0, z: 0 })
                                                    setModelPositionInput({ x: "0.00", y: "0.00", z: "0.00" })
                                                }}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Reset vị trí
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setModelPosition({ x: 0, y: 0, z: 0 })
                                                    setModelPositionInput({ x: "0.00", y: "0.00", z: "0.00" })
                                                }}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <Target className="w-4 h-4 mr-2" />
                                                Vị trí gốc
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="texture" className="space-y-4">
                                        <div>
                                            <Label htmlFor="image-upload">Upload ảnh texture</Label>
                                            <div className="mt-2">
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                            {uploadedImage && (
                                                <div className="mt-2">
                                                    <img
                                                        src={uploadedImage || "/placeholder.svg"}
                                                        alt="Uploaded texture"
                                                        className="w-full h-32 object-cover rounded-md border"
                                                    />
                                                </div>
                                            )}
                                        </div>


                                        <div>
                                            <Label className="flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                Điểm neo texture
                                            </Label>

                                            {selectedTextureAnchor && (
                                                <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleQuickMoveTexture("prev")}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        ←
                                                    </Button>
                                                    <div className="flex-1 text-center text-sm font-medium text-blue-700">
                                                        {anchorPoints[selectedTextureAnchor as keyof typeof anchorPoints].label}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleQuickMoveTexture("next")}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        →
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleClearTexturePosition}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 bg-transparent"
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {Object.entries(anchorPoints).map(([key, anchor]) => (
                                                    <Button
                                                        key={key}
                                                        variant={selectedTextureAnchor === key ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleTextureAnchorSelect(key)}
                                                        className="text-xs h-8"
                                                    >
                                                        {anchor.label}
                                                    </Button>
                                                ))}
                                            </div>


                                        </div>

                                        <div className="space-y-3">
                                            <Label>Tinh chỉnh vị trí (X, Y, Z)</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label htmlFor="texture-x" className="text-xs">
                                                        X
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="texture-x"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[texturePosition.x]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTexturePosition((prev) => ({ ...prev, x: snapped }))
                                                            setTexturePositionInput((prev) => ({ ...prev, x: snapped.toFixed(2) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={texturePositionInput.x}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTexturePositionInput((prev) => ({ ...prev, x: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTexturePosition((prev) => ({ ...prev, x: snapped }))
                                                            }
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (texturePositionInput.x.trim() === "") {
                                                                setTexturePosition((prev) => ({ ...prev, x: 0 }))
                                                                setTexturePositionInput((prev) => ({ ...prev, x: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="texture-y" className="text-xs">
                                                        Y
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="texture-y"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[texturePosition.y]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTexturePosition((prev) => ({ ...prev, y: snapped }))
                                                            setTexturePositionInput((prev) => ({ ...prev, y: snapped.toFixed(2) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={texturePositionInput.y}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTexturePositionInput((prev) => ({ ...prev, y: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTexturePosition((prev) => ({ ...prev, y: snapped }))
                                                            }
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (texturePositionInput.y.trim() === "") {
                                                                setTexturePosition((prev) => ({ ...prev, y: 0 }))
                                                                setTexturePositionInput((prev) => ({ ...prev, y: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="texture-z" className="text-xs">
                                                        Z
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="texture-z"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[texturePosition.z]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTexturePosition((prev) => ({ ...prev, z: snapped }))
                                                            setTexturePositionInput((prev) => ({ ...prev, z: snapped.toFixed(2) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={texturePositionInput.z}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTexturePositionInput((prev) => ({ ...prev, z: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTexturePosition((prev) => ({ ...prev, z: snapped }))
                                                            }
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (texturePositionInput.z.trim() === "") {
                                                                setTexturePosition((prev) => ({ ...prev, z: 0 }))
                                                                setTexturePositionInput((prev) => ({ ...prev, z: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="texture-scale">Kích thước texture</Label>
                                            <SliderPrimitive.Root
                                                id="texture-scale"
                                                min={0.1}
                                                max={3}
                                                step={0.1}
                                                value={[textureScale]}
                                                onValueChange={(v) => setTextureScale(v[0])}
                                                className="relative flex w-full touch-none select-none items-center mt-2"
                                            >
                                                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                    <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                </SliderPrimitive.Track>
                                                <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                            </SliderPrimitive.Root>
                                            <div className="text-sm text-gray-500 mt-1">Kích thước: {textureScale}x</div>
                                        </div>

                                        {selectedTextureAnchor === "chest_belly" && (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label htmlFor="chest-belly-decal-scale" className="flex items-center gap-2">
                                                        <Target className="w-4 h-4" />
                                                        Kích thước decal ngực + bụng
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="chest-belly-decal-scale"
                                                        min={2}
                                                        max={15}
                                                        step={0.5}
                                                        value={[chestBellyDecalScale]}
                                                        onValueChange={(v) => setChestBellyDecalScale(v[0])}
                                                        className="relative flex w-full touch-none select-none items-center mt-2"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-green-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-green-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Kích thước: {chestBellyDecalScale}x - Texture sẽ phủ toàn bộ ngực và bụng
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="show-texture-back"
                                                        checked={showTextureOnBack}
                                                        onChange={(e) => setShowTextureOnBack(e.target.checked)}
                                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                    />
                                                    <Label htmlFor="show-texture-back" className="text-sm">
                                                        Hiển thị texture ở phía sau lưng
                                                    </Label>
                                                </div>
                                                <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                                                    💡 <strong>Mặc định:</strong> Texture chỉ hiển thị ở mặt trước (ngực + bụng).
                                                    Bật tùy chọn này nếu muốn texture xuất hiện ở cả phía sau lưng.
                                                </div>
                                            </div>
                                        )}

                                        <Button onClick={handleApplyTexture} className="w-full" disabled={!customTexture && !uploadedImage}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Áp dụng Texture
                                        </Button>

                                        {appliedTextures.length > 0 && (
                                            <div className="mt-4">
                                                <Label className="text-sm font-medium">Texture đã áp dụng ({appliedTextures.length})</Label>
                                                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                                    {appliedTextures.map((texture) => (
                                                        <div key={texture.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                                                            <img
                                                                src={texture.texture || "/placeholder.svg"}
                                                                alt="Applied texture"
                                                                className="w-8 h-8 object-cover rounded"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-medium">Texture #{texture.id.slice(-4)}</div>
                                                                <div className="text-gray-500">
                                                                    Pos: ({texture.position.x.toFixed(1)}, {texture.position.y.toFixed(1)},{" "}
                                                                    {texture.position.z.toFixed(1)})
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveAppliedTexture(texture.id)}
                                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="accessories" className="space-y-4">
                                        <div>
                                            <Label htmlFor="accessory-upload">Upload file GLB phụ kiện</Label>
                                            <div className="mt-2">
                                                <Input
                                                    id="accessory-upload"
                                                    type="file"
                                                    accept=".glb"
                                                    onChange={handleAccessoryUpload}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Chỉ hỗ trợ file .glb. Phụ kiện sẽ được thêm vào model chính.
                                            </p>
                                        </div>

                                        {accessories.length > 0 && (
                                            <div>
                                                <Label className="text-sm font-medium">Phụ kiện đã thêm ({accessories.length})</Label>
                                                <div className="mt-2 space-y-3 max-h-64 overflow-y-auto">
                                                    {accessories.map((accessory) => (
                                                        <div key={accessory.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="font-medium text-sm text-blue-800">
                                                                    {accessory.name}
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        variant={selectedAccessory === accessory.id ? "default" : "outline"}
                                                                        size="sm"
                                                                        onClick={() => setSelectedAccessory(selectedAccessory === accessory.id ? "" : accessory.id)}
                                                                        className="h-6 w-6 p-0 text-xs"
                                                                    >
                                                                        {selectedAccessory === accessory.id ? "✓" : "⚙️"}
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveAccessory(accessory.id)}
                                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                                    >
                                                                        ✕
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {selectedAccessory === accessory.id && (
                                                                <div className="space-y-3">
                                                                    {/* Anchor Point Selection */}
                                                                    <div>
                                                                        <Label className="text-xs font-medium">Điểm neo:</Label>
                                                                        <div className="grid grid-cols-2 gap-1 mt-1">
                                                                            {Object.entries(anchorPoints).map(([key, anchor]) => (
                                                                                <Button
                                                                                    key={key}
                                                                                    variant={accessory.anchorPoint === key ? "default" : "outline"}
                                                                                    size="sm"
                                                                                    onClick={() => handleAccessoryAnchorSelect(accessory.id, key)}
                                                                                    className="text-xs h-6"
                                                                                >
                                                                                    {anchor.label}
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {/* Position Controls */}
                                                                    <div>
                                                                        <Label className="text-xs font-medium">Vị trí (X, Y, Z):</Label>
                                                                        <div className="grid grid-cols-3 gap-2 mt-1">
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-x`} className="text-xs">X</Label>
                                                                                <SliderPrimitive.Root
                                                                                    id={`acc-${accessory.id}-x`}
                                                                                    min={-3}
                                                                                    max={3}
                                                                                    step={0.01}
                                                                                    value={[accessory.position.x]}
                                                                                    onValueChange={(v) => {
                                                                                        const raw = v[0]
                                                                                        handleAccessoryPositionChange(accessory.id, "x", Math.abs(raw) < 0.05 ? 0 : raw)
                                                                                    }}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <Input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="-3"
                                                                                    max="3"
                                                                                    value={Number(accessory.position.x.toFixed(2))}
                                                                                    onChange={(e) => {
                                                                                        const val = Number.parseFloat(e.target.value)
                                                                                        handleAccessoryPositionChange(accessory.id, "x", Number.isNaN(val) ? accessory.position.x : val)
                                                                                    }}
                                                                                    className="mt-1 h-7 text-xs"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-y`} className="text-xs">Y</Label>
                                                                                <SliderPrimitive.Root
                                                                                    id={`acc-${accessory.id}-y`}
                                                                                    min={-3}
                                                                                    max={3}
                                                                                    step={0.01}
                                                                                    value={[accessory.position.y]}
                                                                                    onValueChange={(v) => {
                                                                                        const raw = v[0]
                                                                                        handleAccessoryPositionChange(accessory.id, "y", Math.abs(raw) < 0.05 ? 0 : raw)
                                                                                    }}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <Input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="-3"
                                                                                    max="3"
                                                                                    value={Number(accessory.position.y.toFixed(2))}
                                                                                    onChange={(e) => {
                                                                                        const val = Number.parseFloat(e.target.value)
                                                                                        handleAccessoryPositionChange(accessory.id, "y", Number.isNaN(val) ? accessory.position.y : val)
                                                                                    }}
                                                                                    className="mt-1 h-7 text-xs"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-z`} className="text-xs">Z</Label>
                                                                                <SliderPrimitive.Root
                                                                                    id={`acc-${accessory.id}-z`}
                                                                                    min={-3}
                                                                                    max={3}
                                                                                    step={0.01}
                                                                                    value={[accessory.position.z]}
                                                                                    onValueChange={(v) => {
                                                                                        const raw = v[0]
                                                                                        handleAccessoryPositionChange(accessory.id, "z", Math.abs(raw) < 0.05 ? 0 : raw)
                                                                                    }}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <Input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="-3"
                                                                                    max="3"
                                                                                    value={Number(accessory.position.z.toFixed(2))}
                                                                                    onChange={(e) => {
                                                                                        const val = Number.parseFloat(e.target.value)
                                                                                        handleAccessoryPositionChange(accessory.id, "z", Number.isNaN(val) ? accessory.position.z : val)
                                                                                    }}
                                                                                    className="mt-1 h-7 text-xs"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Scale Control */}
                                                                    <div>
                                                                        <Label htmlFor={`acc-${accessory.id}-scale`} className="text-xs font-medium">Kích thước:</Label>
                                                                        <SliderPrimitive.Root
                                                                            id={`acc-${accessory.id}-scale`}
                                                                            min={-5}
                                                                            max={5}
                                                                            step={0.1}
                                                                            value={[accessory.scale]}
                                                                            onValueChange={(v) => handleAccessoryScaleChange(accessory.id, v[0])}
                                                                            className="relative flex w-full touch-none select-none items-center mt-1"
                                                                        >
                                                                            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                            </SliderPrimitive.Track>
                                                                            <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                        </SliderPrimitive.Root>
                                                                        <div className="text-xs text-center">{accessory.scale.toFixed(1)}x</div>
                                                                    </div>

                                                                    {/* Rotation Controls */}
                                                                    <div>
                                                                        <Label className="text-xs font-medium">Xoay (X, Y, Z):</Label>
                                                                        <div className="grid grid-cols-3 gap-2 mt-1">
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-rot-x`} className="text-xs">X</Label>
                                                                                <SliderPrimitive.Root
                                                                                    value={[radiansToDegreesRounded(accessory.rotation.x)]}
                                                                                    onValueChange={(v) => handleAccessoryRotationChange(accessory.id, "x", degreesToRadiansSnap(v[0]))}
                                                                                    min={0}
                                                                                    max={360}
                                                                                    step={1}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <div className="text-xs text-center">{radiansToDegreesRounded(accessory.rotation.x).toFixed(0)}°</div>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-rot-y`} className="text-xs">Y</Label>
                                                                                <SliderPrimitive.Root
                                                                                    value={[radiansToDegreesRounded(accessory.rotation.y)]}
                                                                                    onValueChange={(v) => handleAccessoryRotationChange(accessory.id, "y", degreesToRadiansSnap(v[0]))}
                                                                                    min={0}
                                                                                    max={360}
                                                                                    step={1}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <div className="text-xs text-center">{radiansToDegreesRounded(accessory.rotation.y).toFixed(0)}°</div>
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor={`acc-${accessory.id}-rot-z`} className="text-xs">Z</Label>
                                                                                <SliderPrimitive.Root
                                                                                    value={[radiansToDegreesRounded(accessory.rotation.z)]}
                                                                                    onValueChange={(v) => handleAccessoryRotationChange(accessory.id, "z", degreesToRadiansSnap(v[0]))}
                                                                                    min={0}
                                                                                    max={360}
                                                                                    step={1}
                                                                                    className="relative flex w-full touch-none select-none items-center mt-1"
                                                                                >
                                                                                    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                                        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                                    </SliderPrimitive.Track>
                                                                                    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                                                </SliderPrimitive.Root>
                                                                                <div className="text-xs text-center">{radiansToDegreesRounded(accessory.rotation.z).toFixed(0)}°</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {accessories.length === 0 && (
                                            <div className="text-center p-4 text-gray-500 text-sm">
                                                Upload file GLB để thêm phụ kiện vào model!
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="text" className="space-y-4">
                                        <div>
                                            <Label htmlFor="custom-text">Nội dung text</Label>
                                            <Textarea
                                                id="custom-text"
                                                placeholder="Nhập text muốn hiển thị..."
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="text-color">Màu text</Label>
                                            <div className="flex gap-2 mt-2">
                                                <Input
                                                    id="text-color"
                                                    type="color"
                                                    value={textColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="w-16 h-10 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    type="text"
                                                    value={textColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="flex-1"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="text-bg-color">Màu nền text</Label>
                                            <div className="flex gap-2 mt-2">
                                                <Input
                                                    id="text-bg-color"
                                                    type="color"
                                                    value={textBackgroundColor}
                                                    onChange={(e) => setTextBackgroundColor(e.target.value)}
                                                    className="w-16 h-10 p-1 cursor-pointer"
                                                />
                                                <Input
                                                    type="text"
                                                    value={textBackgroundColor}
                                                    onChange={(e) => setTextBackgroundColor(e.target.value)}
                                                    className="flex-1"
                                                    placeholder="#ffffff"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="text-size">Kích thước text</Label>
                                            <SliderPrimitive.Root
                                                id="text-size"
                                                min={0.5}
                                                max={2}
                                                step={0.1}
                                                value={[textSize]}
                                                onValueChange={(v) => setTextSize(v[0])}
                                                className="relative flex w-full touch-none select-none items-center mt-2"
                                            >
                                                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                    <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                </SliderPrimitive.Track>
                                                <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                            </SliderPrimitive.Root>
                                            <div className="text-sm text-gray-500 mt-1">Kích thước: {textSize}x</div>
                                        </div>

                                        <div>
                                            <Label className="flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                Điểm neo text
                                            </Label>

                                            {selectedTextAnchor && (
                                                <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleQuickMoveText("prev")}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        ←
                                                    </Button>
                                                    <div className="flex-1 text-center text-sm font-medium text-green-700">
                                                        {anchorPoints[selectedTextAnchor as keyof typeof anchorPoints].label}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleQuickMoveText("next")}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        →
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleClearTextPosition}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 bg-transparent"
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {Object.entries(anchorPoints).map(([key, anchor]) => (
                                                    <Button
                                                        key={key}
                                                        variant={selectedTextAnchor === key ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleTextAnchorSelect(key)}
                                                        className="text-xs h-8"
                                                    >
                                                        {anchor.label}
                                                    </Button>
                                                ))}
                                            </div>

                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextAnchorSelect("head")}
                                                    className="flex-1 text-xs"
                                                >
                                                    🗣️ Đầu
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextAnchorSelect("chest")}
                                                    className="flex-1 text-xs"
                                                >
                                                    💗 Ngực
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextAnchorSelect("belly")}
                                                    className="flex-1 text-xs"
                                                >
                                                    🤰 Bụng
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Tinh chỉnh vị trí (X, Y, Z)</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label htmlFor="text-x" className="text-xs">
                                                        X
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="text-x"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[textPosition.x]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTextPosition((prev) => ({ ...prev, x: snapped }))
                                                            setTextPositionInput((prev) => ({ ...prev, x: snapped.toFixed(2) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={textPositionInput.x}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTextPositionInput((prev) => ({ ...prev, x: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTextPosition((prev) => ({ ...prev, x: snapped }))
                                                            }
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (textPositionInput.x.trim() === "") {
                                                                setTextPosition((prev) => ({ ...prev, x: 0 }))
                                                                setTextPositionInput((prev) => ({ ...prev, x: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="text-y" className="text-xs">
                                                        Y
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="text-y"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[textPosition.z]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTextPosition((prev) => ({ ...prev, z: snapped }))
                                                            setTextPositionInput((prev) => ({ ...prev, z: snapped.toFixed(2) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={textPositionInput.z}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTextPositionInput((prev) => ({ ...prev, z: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTextPosition((prev) => ({ ...prev, z: snapped }))
                                                            }
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (textPositionInput.z.trim() === "") {
                                                                setTextPosition((prev) => ({ ...prev, z: 0 }))
                                                                setTextPositionInput((prev) => ({ ...prev, z: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="text-z" className="text-xs">
                                                        Z
                                                    </Label>
                                                    <SliderPrimitive.Root
                                                        id="text-z"
                                                        min={-2}
                                                        max={2}
                                                        step={0.01}
                                                        value={[textPosition.y]}
                                                        onValueChange={(v) => {
                                                            const raw = v[0]
                                                            const snapped = snapToZero(raw)
                                                            setTextPosition((prev) => ({ ...prev, y: snapped }))
                                                            setTextPositionInput((prev) => ({ ...prev, y: snapped.toFixed(2) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="relative flex w-full touch-none select-none items-center mt-1"
                                                    >
                                                        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                            <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                        </SliderPrimitive.Track>
                                                        <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                    </SliderPrimitive.Root>
                                                    <Input
                                                        type="text"
                                                        value={textPositionInput.y}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setTextPositionInput((prev) => ({ ...prev, y: val }))
                                                            const parsed = Number.parseFloat(val)
                                                            if (!Number.isNaN(parsed)) {
                                                                const snapped = snapToZero(parsed)
                                                                setTextPosition((prev) => ({ ...prev, y: snapped }))
                                                            }
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        onBlur={() => {
                                                            if (textPositionInput.y.trim() === "") {
                                                                setTextPosition((prev) => ({ ...prev, y: 0 }))
                                                                setTextPositionInput((prev) => ({ ...prev, y: "0.00" }))
                                                            }
                                                        }}
                                                        className="mt-1 h-8 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button onClick={handleApplyText} className="w-full">
                                            <Type className="w-4 h-4 mr-2" />
                                            Áp dụng Text
                                        </Button>

                                        {appliedTexts.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <Label className="text-sm font-semibold">📝 Text đã áp dụng:</Label>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {appliedTexts.map((text) => (
                                                        <div
                                                            key={text.id}
                                                            className="flex items-center justify-between p-2 bg-green-50 rounded text-xs"
                                                        >
                                                            <div className="flex-1 truncate">
                                                                <div className="font-medium" style={{ color: text.color }}>
                                                                    "{text.text}"
                                                                </div>
                                                                <div className="text-gray-500">
                                                                    ({text.position.x.toFixed(1)}, {text.position.y.toFixed(1)},{" "}
                                                                    {text.position.z.toFixed(1)})
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRemoveAppliedText(text.id)}
                                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                            >
                                                                ✕
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="anchors" className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">⚙️ Quản lý điểm neo</Label>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={handleResetAnchorPoints}>
                                                    <RotateCcw className="w-4 h-4 mr-1" />
                                                    Reset
                                                </Button>
                                                <Button size="sm" onClick={handleSaveAnchorPoints}>
                                                    💾 Lưu
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Chọn điểm neo để chỉnh sửa:</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(anchorPoints).map(([key, anchor]) => (
                                                    <Button
                                                        key={key}
                                                        variant={editingAnchor === key ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setEditingAnchor(editingAnchor === key ? "" : key)}
                                                        className="text-xs h-8"
                                                    >
                                                        {anchor.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {editingAnchor && (
                                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-4 h-4" />
                                                    <Label className="font-semibold">
                                                        Chỉnh sửa: {anchorPoints[editingAnchor as keyof typeof anchorPoints].label}
                                                    </Label>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label>Tọa độ (X, Y, Z)</Label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <Label htmlFor={`anchor-${editingAnchor}-x`} className="text-xs">
                                                                X
                                                            </Label>
                                                            <SliderPrimitive.Root
                                                                id={`anchor-${editingAnchor}-x`}
                                                                min={-2}
                                                                max={2}
                                                                step={0.01}
                                                                value={[anchorPoints[editingAnchor as keyof typeof anchorPoints].x]}
                                                                onValueChange={(v) =>
                                                                    handleAnchorPositionChange(editingAnchor, "x", v[0])
                                                                }
                                                                className="relative flex w-full touch-none select-none items-center mt-1"
                                                            >
                                                                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                    <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                </SliderPrimitive.Track>
                                                                <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                            </SliderPrimitive.Root>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="-2"
                                                                max="2"
                                                                value={Number(anchorPoints[editingAnchor as keyof typeof anchorPoints].x.toFixed(2))}
                                                                onChange={(e) => {
                                                                    const val = Number.parseFloat(e.target.value)
                                                                    handleAnchorPositionChange(editingAnchor, "x", Number.isNaN(val) ? anchorPoints[editingAnchor as keyof typeof anchorPoints].x : val)
                                                                }}
                                                                className="mt-1 h-8 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`anchor-${editingAnchor}-y`} className="text-xs">
                                                                Y
                                                            </Label>
                                                            <SliderPrimitive.Root
                                                                id={`anchor-${editingAnchor}-y`}
                                                                min={-2}
                                                                max={2}
                                                                step={0.01}
                                                                value={[anchorPoints[editingAnchor as keyof typeof anchorPoints].y]}
                                                                onValueChange={(v) =>
                                                                    handleAnchorPositionChange(editingAnchor, "y", v[0])
                                                                }
                                                                className="relative flex w-full touch-none select-none items-center mt-1"
                                                            >
                                                                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                    <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                </SliderPrimitive.Track>
                                                                <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                            </SliderPrimitive.Root>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="-2"
                                                                max="2"
                                                                value={Number(anchorPoints[editingAnchor as keyof typeof anchorPoints].y.toFixed(2))}
                                                                onChange={(e) => {
                                                                    const val = Number.parseFloat(e.target.value)
                                                                    handleAnchorPositionChange(editingAnchor, "y", Number.isNaN(val) ? anchorPoints[editingAnchor as keyof typeof anchorPoints].y : val)
                                                                }}
                                                                className="mt-1 h-8 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`anchor-${editingAnchor}-z`} className="text-xs">
                                                                Z
                                                            </Label>
                                                            <SliderPrimitive.Root
                                                                id={`anchor-${editingAnchor}-z`}
                                                                min={-2}
                                                                max={2}
                                                                step={0.01}
                                                                value={[anchorPoints[editingAnchor as keyof typeof anchorPoints].z]}
                                                                onValueChange={(v) =>
                                                                    handleAnchorPositionChange(editingAnchor, "z", v[0])
                                                                }
                                                                className="relative flex w-full touch-none select-none items-center mt-1"
                                                            >
                                                                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300">
                                                                    <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
                                                                </SliderPrimitive.Track>
                                                                <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-2 border-blue-600 bg-white shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
                                                            </SliderPrimitive.Root>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min={-2}
                                                                max={2}
                                                                value={Number(anchorPoints[editingAnchor as keyof typeof anchorPoints].z.toFixed(2))}
                                                                onChange={(e) => {
                                                                    const val = Number.parseFloat(e.target.value)
                                                                    handleAnchorPositionChange(editingAnchor, "z", Number.isNaN(val) ? anchorPoints[editingAnchor as keyof typeof anchorPoints].z : val)
                                                                }}
                                                                className="mt-1 h-8 text-xs"
                                                            />
                                                            <div className="text-xs text-center">
                                                                {anchorPoints[editingAnchor as keyof typeof anchorPoints].z.toFixed(1)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-600 bg-white p-2 rounded">
                                                    <strong>Vị trí hiện tại:</strong> (
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].x.toFixed(2)},
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].y.toFixed(2)},
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].z.toFixed(2)})
                                                </div>
                                            </div>
                                        )}

                                        {!editingAnchor && (
                                            <div className="text-center p-4 text-gray-500 text-sm">
                                                👆 Chọn một điểm neo ở trên để bắt đầu chỉnh sửa vị trí
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>

            {/* Loading Indicator cho Scene Restoration */}
            {isLoadingScene && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Đang tải scene...</p>
                        <p className="text-gray-600 text-sm">Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            )}

            {/* Loading Indicator cho Save 3D */}
            {isSaving3D && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Đang lưu thiết kế 3D...</p>
                        <p className="text-gray-600 text-sm">Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            )}

            {/* Canvas 3D List Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-lg transition-transform duration-300 ease-in-out z-50 ${showCanvas3DList ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ width: "350px" }}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Danh sách Canvas 3D</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCanvas3DList(false)}
                        >
                            ✕
                        </Button>
                    </div>
                </div>
                <div className="h-full overflow-y-auto">
                    <Canvas3DList
                        onSelect={async (canvas3D: string, title: string, id: string) => {
                            // Load canvas 3D đã chọn vào component hiện tại
                            console.log("Loading 3D canvas:", { canvas3D, title, id });
                            try {
                                const canvas3DData = JSON.parse(canvas3D);
                                console.log("Parsed 3D data:", canvas3DData);

                                // ✅ Kiểm tra format mới (jsonUrl) hoặc format cũ (sceneUrl/modelUrl)
                                if (canvas3DData.jsonUrl) {
                                    // Format mới: JSON file trên Cloudinary
                                    console.log("🔄 Đang tải JSON từ Cloudinary:", canvas3DData.jsonUrl);

                                    // Hiển thị loading state
                                    setIsLoadingScene(true);

                                    try {
                                        // 1. Fetch JSON data từ Cloudinary
                                        const response = await fetch(canvas3DData.jsonUrl);
                                        if (!response.ok) {
                                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                        }

                                        const jsonData = await response.json();
                                        console.log("✅ JSON data đã tải từ Cloudinary:", jsonData);

                                        // 2. Restore toàn bộ scene từ JSON data
                                        await restoreSceneFromJSON(jsonData);



                                    } catch (jsonError) {
                                        console.error("❌ Lỗi khi tải JSON từ Cloudinary:", jsonError);
                                        alert("⚠️ Không thể tải dữ liệu JSON từ Cloudinary. Vui lòng thử lại.");
                                    } finally {
                                        setIsLoadingScene(false);
                                    }

                                } else if (canvas3DData.sceneUrl || canvas3DData.modelUrl) {
                                    // Format cũ: GLB file trên Cloudinary (để backward compatibility)
                                    const targetUrl = canvas3DData.sceneUrl || canvas3DData.modelUrl;
                                    const isNewFormat = !!canvas3DData.sceneUrl;

                                    console.log("🔄 Đang tải scene GLB từ Cloudinary (format cũ):", targetUrl);
                                    console.log("📋 Format:", isNewFormat ? "Mới (sceneUrl)" : "Cũ (modelUrl)");

                                    // Hiển thị loading state
                                    setIsLoadingScene(true);

                                    try {
                                        // Load scene GLB từ Cloudinary
                                        const loader = new GLTFLoader();
                                        await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
                                            loader.load(targetUrl, resolve, undefined, reject);
                                        });

                                        console.log("✅ Scene GLB đã tải thành công từ Cloudinary");

                                        // ✅ Restore scene từ GLB (format cũ)
                                        console.log("🔄 Bắt đầu restore scene từ GLB...");

                                        // 1. Clear current scene state
                                        setAppliedTextures([]);
                                        setAppliedTextures([]);
                                        setAccessories([]);
                                        setCustomTexture("");
                                        setUploadedImage("");
                                        setCustomText("");

                                        // 2. Load và parse scene GLB để lấy thông tin
                                        const sceneData = await loadSceneFromGLB(targetUrl);

                                        if (sceneData) {
                                            // 3. Restore model (nếu cần thay đổi)
                                            if (sceneData.modelName !== getCurrentModel().name) {
                                                // Tìm model tương ứng hoặc sử dụng default
                                                const targetModel = glbModels.find(m => m.name === sceneData.modelName);
                                                if (targetModel) {
                                                    setCurrentModelId(targetModel.id);
                                                    console.log("✅ Đã chuyển sang model:", targetModel.name);
                                                }
                                            }

                                            // 4. Lưu scene đã load để hiển thị trong canvas
                                            setLoadedScene(sceneData.scene);



                                        }

                                    } catch (restoreError) {
                                        console.error("❌ Lỗi khi restore scene từ GLB:", restoreError);
                                        alert("⚠️ Scene đã được tải nhưng có lỗi khi restore. Vui lòng thử lại.");
                                    } finally {
                                        // Tắt loading state
                                        setIsLoadingScene(false);
                                    }

                                } else {
                                    console.warn("Không tìm thấy jsonUrl, sceneUrl hoặc modelUrl trong canvas3D data");
                                    alert("Dữ liệu canvas3D không hợp lệ hoặc không có URL");
                                }

                            } catch (error) {
                                console.error("Error parsing canvas3D:", error);
                                alert("Lỗi khi tải dữ liệu canvas3D");
                            }
                            setShowCanvas3DList(false);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function LoadingSpinner() {
    return (
        <Html center>
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm">Đang tải model...</span>
            </div>
        </Html>
    )
}
