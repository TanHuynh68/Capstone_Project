"use client"

import type React from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Suspense, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Local rotation slider styling for this page only
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Type,
    ImageIcon,
    Download,
    RotateCcw,
    Link,
    Target,
    Settings,
    Upload,
    Trash2,
    Box,
    Plus,
} from "lucide-react"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const DEFAULT_ANCHOR_POINTS = {
    head: { x: 0, y: -0.05, z: 0.55, label: "🗣️ Đầu" },
    chest: { x: 0, y: -0.38, z: -0.75, label: "💗 Ngực" },
    belly: { x: 0, y: -0.40, z: -1.12, label: "🤰 Bụng" },
    back: { x: 0, y: 0.5, z: -0.8, label: "🔙 Lưng" },
    left_hand: { x: -0.76, y: -0.08, z: -0.97, label: "🤚 Tay trái" },
    right_hand: { x: 0.76, y: -0.08, z: -0.97, label: "🖐️ Tay phải" },
    left_foot: { x: -0.30, y: -0.04, z: -2.00, label: "🦶 Chân trái" },
    right_foot: { x: 0.3, y: -0.04, z: -2.00, label: "🦵 Chân phải" },
}

// Thêm điểm neo cho model thứ hai (model nhỏ hơn, dạng keychain)
const SMALL_MODEL_ANCHOR_POINTS = {
    head: { x: 0, y: -0.2, z: 0.8, label: "🗣️ Đầu" },
    chest: { x: 0, y: -0.38, z: -0.75, label: "💗 Ngực" },
    belly: { x: 0, y: -0.40, z: -1.12, label: "🤰 Bụng" },
    back: { x: 0, y: 0.5, z: -0.8, label: "🔙 Lưng" },
    left_hand: { x: -0.76, y: -0.08, z: -0.97, label: "🤚 Tay trái" },
    right_hand: { x: 0.76, y: -0.08, z: -0.97, label: "🖐️ Tay phải" },
    left_foot: { x: -0.30, y: -0.04, z: -2.00, label: "🦶 Chân trái" },
    right_foot: { x: 0.3, y: -0.04, z: -2.00, label: "🦵 Chân phải" },
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
}: LabubuModelProps) {
    const { scene } = useGLTF(modelPath)
    const groupRef = useRef<THREE.Group>(null)

    // Xác định scale dựa trên model ID
    const getModelScale = () => {
        switch (modelId) {
            case "small-labubu":
                return 1.5 // Model nhỏ hơn
            case "default-labubu":
            default:
                return 2 // Model chuẩn
        }
    }

    useFrame((_, delta) => {
        if (groupRef.current && isRotating) {
            groupRef.current.rotation.z += delta * 0.8 // Quay quanh trục Z để quay theo mặt phẳng XY
        }
    })

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
            <primitive
                object={scene}
                scale={getModelScale()}
                rotation={[-Math.PI / 2 + Math.PI, 0, 0]} // Chuyển từ Blender Z-up sang Three.js Y-up + lộn ngược 180°
            />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            {customTexture && (
                <mesh
                    ref={textureMeshRef}
                    position={[texturePosition.x, texturePosition.y, texturePosition.z]}
                    scale={[textureScale, textureScale, 1]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial>
                        <primitive object={new THREE.TextureLoader().load(customTexture)} attach="map" />
                    </meshBasicMaterial>
                </mesh>
            )}

            {appliedTextures.map((texture) => (
                <mesh
                    key={texture.id}
                    position={[texture.position.x, texture.position.y, texture.position.z]}
                    scale={[texture.scale, texture.scale, 1]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial>
                        <primitive object={new THREE.TextureLoader().load(texture.texture)} attach="map" />
                    </meshBasicMaterial>
                </mesh>
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
        </group>
    )
}

export default function PlushDollDesign3D() {
    const [glbModels, setGlbModels] = useState<GLBModel[]>([
        {
            id: "default-labubu",
            name: "Labubu Keychain (Mặc định)",
            url: "/model/plush_labubu_keychain_character.glb",
            isDefault: true,
        },
        {
            id: "small-labubu",
            name: "Labubu Mini (Nhỏ)",
            url: "/model/plush_labubu_keychain_character.glb", // Sử dụng cùng model nhưng scale khác
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

    const [isRotating, setIsRotating] = useState(false)
    const [isAttached, setIsAttached] = useState(false)

    const [selectedTextAnchor, setSelectedTextAnchor] = useState<string>("")
    const [selectedTextureAnchor, setSelectedTextureAnchor] = useState<string>("")

    // Cập nhật anchorPoints dựa trên model được chọn
    const getCurrentAnchorPoints = () => {
        if (currentModelId === "small-labubu") {
            return SMALL_MODEL_ANCHOR_POINTS
        }
        return DEFAULT_ANCHOR_POINTS
    }

    const [anchorPoints, setAnchorPoints] = useState(DEFAULT_ANCHOR_POINTS)

    // Cập nhật anchorPoints khi thay đổi model
    const handleModelChange = (modelId: string) => {
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
    }

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

    const snapToZero = (value: number, threshold = 0.05) => (Math.abs(value) < threshold ? 0 : value)

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
        if (model?.isDefault) {
            alert("Không thể xóa model mặc định!")
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
        console.log("Reset completed - rotation stopped")
    }

    const handleExport = async () => {
        const scene = new THREE.Scene()

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
                        return 1.5 // Model nhỏ hơn
                    case "default-labubu":
                    default:
                        return 2 // Model chuẩn
                }
            }
            const modelScale = getExportModelScale()
            model.scale.set(modelScale, modelScale, modelScale)
            // Áp dụng rotation để chuyển từ Blender Z-up sang Three.js Y-up + lộn ngược 180°
            model.rotation.x = -Math.PI / 2 + Math.PI
            scene.add(model)

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
                    mesh.rotation.x = Math.PI / 2
                    scene.add(mesh)
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
                    mesh.rotation.x = Math.PI / 2
                    scene.add(mesh)
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
                    // Áp dụng rotation từ Blender Z-up sang Three.js Y-up + lộn ngược 180° + rotation tùy chỉnh
                    accessoryModel.rotation.set(
                        accessory.rotation.x - Math.PI / 2 + Math.PI,
                        accessory.rotation.y,
                        accessory.rotation.z
                    )
                    scene.add(accessoryModel)
                } catch (error) {
                    console.warn("[v0] Failed to load accessory:", accessory.name, error)
                }
            })

            // Wait for all accessories to load
            await Promise.allSettled(accessoryPromises)

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-white">🎨 3D Preview - {getCurrentModel().name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
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
                                {isRotating ? "🔄 Dừng quay" : "▶️ Bắt đầu quay"}
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
                        <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất GLB
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-[500px] p-0">
                            <CardContent className="h-full p-0">
                                <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden h-full">
                                    <Canvas className="w-full h-full" camera={{
                                        position: [5, 0, 0], // Camera ở trên cao, nhìn xuống
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
                                <CardTitle>🛠️ Công cụ chỉnh sửa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="models" className="w-full">
                                    <TabsList className="grid w-full grid-cols-6">
                                        <TabsTrigger value="models" className="flex items-center gap-1">
                                            <Box className="w-4 h-4" />
                                            Models
                                        </TabsTrigger>
                                        <TabsTrigger value="position" className="flex items-center gap-1">
                                            <Target className="w-4 h-4" />
                                            Vị trí
                                        </TabsTrigger>
                                        <TabsTrigger value="texture" className="flex items-center gap-1">
                                            <ImageIcon className="w-4 h-4" />
                                            Texture
                                        </TabsTrigger>
                                        <TabsTrigger value="text" className="flex items-center gap-1">
                                            <Type className="w-4 h-4" />
                                            Text
                                        </TabsTrigger>
                                        <TabsTrigger value="accessories" className="flex items-center gap-1">
                                            <Plus className="w-4 h-4" />
                                            Phụ kiện
                                        </TabsTrigger>
                                        <TabsTrigger value="anchors" className="flex items-center gap-1">
                                            <Settings className="w-4 h-4" />
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
                                                Chỉ hỗ trợ file .glb. File sẽ được tải lên và lưu trong trình duyệt.
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
                                                                {currentModelId === model.id ? "✅" : "📦"}
                                                            </Button>
                                                            <div>
                                                                <div className="font-medium text-sm">{model.name}</div>
                                                                {model.isDefault && <div className="text-xs text-gray-500">Model mặc định</div>}
                                                                {model.id === "small-labubu" && <div className="text-xs text-blue-500">✨ 8 điểm neo</div>}
                                                                {model.id === "default-labubu" && <div className="text-xs text-green-500">🔧 8 điểm neo</div>}
                                                            </div>
                                                        </div>
                                                        {!model.isDefault && (
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

                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-start gap-2">
                                                <Box className="w-4 h-4 text-blue-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <div className="font-medium text-blue-800">Thông tin về các model:</div>
                                                    <ul className="text-blue-700 text-xs mt-1 space-y-1">
                                                        <li>• <strong>Labubu Keychain:</strong> Model chuẩn với 8 điểm neo cơ bản</li>
                                                        <li>• <strong>Labubu Mini:</strong> Model nhỏ với 8 điểm neo (tối ưu cho kích thước nhỏ)</li>
                                                        <li>• Mỗi model có các điểm neo được tối ưu cho kích thước tương ứng</li>
                                                        <li>• Có thể upload thêm model tùy chỉnh</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <div className="flex items-start gap-2">
                                                <Upload className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <div className="font-medium text-yellow-800">Lưu ý về file GLB:</div>
                                                    <ul className="text-yellow-700 text-xs mt-1 space-y-1">
                                                        <li>• File được lưu trong trình duyệt, sẽ mất khi xóa cache</li>
                                                        <li>• Kích thước file nên dưới 10MB để tải nhanh</li>
                                                        <li>• Model sẽ được scale tự động để phù hợp</li>
                                                    </ul>
                                                </div>
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
                                                        <li>• <strong>Y (xanh lá):</strong> Trục dọc - xuống (-) / lên (+)</li>
                                                        <li>• <strong>Z (xanh dương):</strong> Trục sâu - gần (-) / xa (+)</li>
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
                                                        Y (Xuống/Lên)
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
                                                        Z (Gần/Xa)
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
                                                📦 Chưa có phụ kiện nào. Upload file GLB để thêm phụ kiện vào model!
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
