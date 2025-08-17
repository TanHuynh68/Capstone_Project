"use client"

import type React from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei"
import { Suspense, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Type,
    ImageIcon,
    Download,
    RotateCcw,
    Play,
    Pause,
    Link,
    Target,
    Settings,
    Upload,
    Trash2,
    Box,
    Eye,
    EyeOff,
    Plus,
} from "lucide-react"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const DEFAULT_ANCHOR_POINTS = {
    head: { x: 0, y: 1.2, z: 0.3, label: "🗣️ Đầu" },
    chest: { x: 0, y: 0.6, z: 0.4, label: "💗 Ngực" },
    belly: { x: 0, y: 0.2, z: 0.5, label: "🤰 Bụng" },
    back: { x: 0, y: 0.4, z: -0.4, label: "🔙 Lưng" },
    left_hand: { x: -0.6, y: 0.4, z: 0.2, label: "🤚 Tay trái" },
    right_hand: { x: 0.6, y: 0.4, z: 0.2, label: "🖐️ Tay phải" },
    left_foot: { x: -0.3, y: -0.8, z: 0.2, label: "🦶 Chân trái" },
    right_foot: { x: 0.3, y: -0.8, z: 0.2, label: "🦵 Chân phải" },
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
}

function AnchorPoint({ position, label }: { position: { x: number; y: number; z: number }; label: string }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <group position={[position.x, position.y, position.z]}>
            <mesh onPointerEnter={() => setIsHovered(true)} onPointerLeave={() => setIsHovered(false)}>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial
                    color={isHovered ? "#00ff44" : "#00ff88"}
                    transparent
                    opacity={isHovered ? 1 : 0.9}
                    roughness={0.3}
                    metalness={0.1}
                    emissive={isHovered ? "#006633" : "#004422"}
                    emissiveIntensity={isHovered ? 0.4 : 0.2}
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
            <primitive object={scene} />
        </group>
    )
}

function LabubuModel({
    modelPath,
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
    textMeshRef,
    textureMeshRef,
    appliedTexts = [],
    appliedTextures = [],
    accessories = [],
    showAxes = true,
}: LabubuModelProps) {
    const { scene } = useGLTF(modelPath)
    const groupRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (groupRef.current && isRotating) {
            groupRef.current.rotation.y += delta * 0.8 // Tăng tốc độ quay và sửa reference
        }
    })

    return (
        <group ref={groupRef}>
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

                    {/* Y axis - Green */}
                    <group>
                        <mesh position={[0, 1.0, 0]}>
                            <cylinderGeometry args={[0.03, 0.03, 2.0]} />
                            <meshBasicMaterial color="#00ff00" />
                        </mesh>
                        <Html position={[0, 2.2, 0]} distanceFactor={8}>
                            <div className="text-green-500 font-bold text-sm bg-white/95 px-2 py-1 rounded-lg shadow-lg border border-green-200">
                                Y
                            </div>
                        </Html>
                    </group>

                    {/* Z axis - Blue */}
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
            <primitive object={scene} scale={2} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            {customTexture && (
                <mesh
                    ref={textureMeshRef}
                    position={[texturePosition.x, texturePosition.y, texturePosition.z]}
                    scale={[textureScale, textureScale, 1]}
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
                         <AnchorPoint key={key} position={anchor} label={anchor.label} />
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

    const [anchorPoints, setAnchorPoints] = useState(DEFAULT_ANCHOR_POINTS)
    const [editingAnchor, setEditingAnchor] = useState<string>("")
    const [showAnchorPoints, setShowAnchorPoints] = useState(false)
    const [showAxes, setShowAxes] = useState(true)

    const textMeshRef = useRef<HTMLDivElement | null>(null)
    const textureMeshRef = useRef<THREE.Mesh | null>(null)

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
        }
    }

    const handleTextureAnchorSelect = (anchorKey: string) => {
        const anchor = anchorPoints[anchorKey as keyof typeof anchorPoints]
        if (anchor) {
            setTexturePosition({ x: anchor.x, y: anchor.y, z: anchor.z })
            setSelectedTextureAnchor(anchorKey)
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
        setAnchorPoints(DEFAULT_ANCHOR_POINTS)
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
            model.scale.set(2, 2, 2)
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
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(textureData.position.x, textureData.position.y, textureData.position.z)
                    mesh.scale.set(textureData.scale, textureData.scale, 1)
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
                    })
                    const mesh = new THREE.Mesh(geometry, material)
                    mesh.position.set(texturePosition.x, texturePosition.y, texturePosition.z)
                    mesh.scale.set(textureScale, textureScale, 1)
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
                    accessoryModel.rotation.set(accessory.rotation.x, accessory.rotation.y, accessory.rotation.z)
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

    const handleAccessoryRotationChange = (accessoryId: string, axis: "x" | "y" | "z", value: number) => {
        setAccessories(prev => prev.map(acc => 
            acc.id === accessoryId 
                ? { ...acc, rotation: { ...acc.rotation, [axis]: value } }
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
                        <h1 className="text-3xl font-bold text-white">3D Model Editor</h1>
                        <div className="text-sm text-gray-300">Model: {getCurrentModel().name}</div>
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
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="h-[600px]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>🎨 3D Preview - {getCurrentModel().name}</span>
                                    <div className="ml-auto flex gap-2">
                                        <Button
                                            variant={showAnchorPoints ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setShowAnchorPoints(!showAnchorPoints)}
                                        >
                                            {showAnchorPoints ? (
                                                <>
                                                    <EyeOff className="w-4 h-4 mr-1" />
                                                    Ẩn điểm neo
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Hiện điểm neo
                                                </>
                                            )}
                                        </Button>
                                                                                 <Button 
                                             variant={isRotating ? "default" : "outline"} 
                                             size="sm" 
                                             onClick={handleToggleRotation}
                                             className={isRotating ? "bg-green-600 hover:bg-green-700" : ""}
                                         >
                                             {isRotating ? (
                                                 <>
                                                     <Pause className="w-4 h-4 mr-1" />
                                                     Dừng quay
                                                 </>
                                             ) : (
                                                 <>
                                                     <Play className="w-4 h-4 mr-1" />
                                                     Bắt đầu quay
                                                 </>
                                             )}
                                         </Button>
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
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[500px] p-0">
                                <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden h-full">
                                    <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 50 }}>
                                            <ambientLight intensity={0.5} />
                                            <directionalLight position={[10, 10, 5]} intensity={1} />
                                                                                         {/* Removed duplicate axesHelper - using custom axes instead */}
                                            <Suspense fallback={<LoadingSpinner />}>
                                                                                                 <LabubuModel
                                                     modelPath={getCurrentModel().url}
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
                                                     textMeshRef={textMeshRef}
                                                     textureMeshRef={textureMeshRef}
                                                     appliedTexts={appliedTexts}
                                                     appliedTextures={appliedTextures}
                                                     accessories={accessories}
                                                     showAxes={showAxes}
                                                 />
                                                <Environment preset="studio" />
                                            </Suspense>
                                            <OrbitControls enablePan={true} enableZoom={true} enableRotate={!isRotating} />
                                        </Canvas>
                                    </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>🎯 Trạng thái</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span>Model:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${isRotating ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                                    >
                                        {isRotating ? "🔄 Đang quay" : "⏸️ Đứng yên"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Text/Texture:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${isAttached ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                    >
                                        {isAttached ? "🔗 Đã ghép" : "📝 Chỉnh sửa"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Điểm neo:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${showAnchorPoints ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                                    >
                                        {showAnchorPoints ? "👁️ Hiển thị" : "🙈 Ẩn"}
                                    </span>
                                </div>
                                {!isAttached && (customText || customTexture) && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                                        💡 Điều chỉnh tọa độ xong, nhấn "Ghép" để gắn vào model
                                    </div>
                                )}
                                {showAnchorPoints && (
                                    <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                                        🎯 Các điểm neo màu xanh hiển thị vị trí có thể đặt text/texture
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>🛠️ Công cụ chỉnh sửa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="models" className="w-full">
                                                                         <TabsList className="grid w-full grid-cols-5">
                                         <TabsTrigger value="models" className="flex items-center gap-1">
                                             <Box className="w-4 h-4" />
                                             Models
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
                                                                onClick={() => setCurrentModelId(model.id)}
                                                                className="text-xs"
                                                            >
                                                                {currentModelId === model.id ? "✅" : "📦"}
                                                            </Button>
                                                            <div>
                                                                <div className="font-medium text-sm">{model.name}</div>
                                                                {model.isDefault && <div className="text-xs text-gray-500">Model mặc định</div>}
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
                                            <Label htmlFor="texture-url">Hoặc nhập URL ảnh</Label>
                                            <Input
                                                id="texture-url"
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={customTexture}
                                                onChange={(e) => setCustomTexture(e.target.value)}
                                                className="mt-2"
                                            />
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

                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextureAnchorSelect("head")}
                                                    className="flex-1 text-xs"
                                                >
                                                    🗣️ Đầu
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextureAnchorSelect("chest")}
                                                    className="flex-1 text-xs"
                                                >
                                                    💗 Ngực
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleTextureAnchorSelect("belly")}
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
                                                    <Label htmlFor="texture-x" className="text-xs">
                                                        X
                                                    </Label>
                                                    <Input
                                                        id="texture-x"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={texturePosition.x}
                                                        onChange={(e) => {
                                                            setTexturePosition((prev) => ({ ...prev, x: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{texturePosition.x.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="texture-y" className="text-xs">
                                                        Y
                                                    </Label>
                                                    <Input
                                                        id="texture-y"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={texturePosition.y}
                                                        onChange={(e) => {
                                                            setTexturePosition((prev) => ({ ...prev, y: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{texturePosition.y.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="texture-z" className="text-xs">
                                                        Z
                                                    </Label>
                                                    <Input
                                                        id="texture-z"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={texturePosition.z}
                                                        onChange={(e) => {
                                                            setTexturePosition((prev) => ({ ...prev, z: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextureAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{texturePosition.z.toFixed(1)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="texture-scale">Kích thước texture</Label>
                                            <Input
                                                id="texture-scale"
                                                type="range"
                                                min="0.1"
                                                max="3"
                                                step="0.1"
                                                value={textureScale}
                                                onChange={(e) => setTextureScale(Number.parseFloat(e.target.value))}
                                                className="mt-2"
                                            />
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
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-x`}
                                                                                     type="range"
                                                                                     min="-3"
                                                                                     max="3"
                                                                                     step="0.1"
                                                                                     value={accessory.position.x}
                                                                                     onChange={(e) => handleAccessoryPositionChange(accessory.id, "x", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{accessory.position.x.toFixed(1)}</div>
                                                                             </div>
                                                                             <div>
                                                                                 <Label htmlFor={`acc-${accessory.id}-y`} className="text-xs">Y</Label>
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-y`}
                                                                                     type="range"
                                                                                     min="-3"
                                                                                     max="3"
                                                                                     step="0.1"
                                                                                     value={accessory.position.y}
                                                                                     onChange={(e) => handleAccessoryPositionChange(accessory.id, "y", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{accessory.position.y.toFixed(1)}</div>
                                                                             </div>
                                                                             <div>
                                                                                 <Label htmlFor={`acc-${accessory.id}-z`} className="text-xs">Z</Label>
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-z`}
                                                                                     type="range"
                                                                                     min="-3"
                                                                                     max="3"
                                                                                     step="0.1"
                                                                                     value={accessory.position.z}
                                                                                     onChange={(e) => handleAccessoryPositionChange(accessory.id, "z", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{accessory.position.z.toFixed(1)}</div>
                                                                             </div>
                                                                         </div>
                                                                     </div>

                                                                     {/* Scale Control */}
                                                                     <div>
                                                                         <Label htmlFor={`acc-${accessory.id}-scale`} className="text-xs font-medium">Kích thước:</Label>
                                                                         <Input
                                                                             id={`acc-${accessory.id}-scale`}
                                                                             type="range"
                                                                             min="-5"
                                                                             max="5"
                                                                             step="0.1"
                                                                             value={accessory.scale}
                                                                             onChange={(e) => handleAccessoryScaleChange(accessory.id, Number.parseFloat(e.target.value))}
                                                                             className="mt-1"
                                                                         />
                                                                         <div className="text-xs text-center">{accessory.scale.toFixed(1)}x</div>
                                                                     </div>

                                                                     {/* Rotation Controls */}
                                                                     <div>
                                                                         <Label className="text-xs font-medium">Xoay (X, Y, Z):</Label>
                                                                         <div className="grid grid-cols-3 gap-2 mt-1">
                                                                             <div>
                                                                                 <Label htmlFor={`acc-${accessory.id}-rot-x`} className="text-xs">X</Label>
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-rot-x`}
                                                                                     type="range"
                                                                                     min="-Math.PI"
                                                                                     max="Math.PI"
                                                                                     step="0.1"
                                                                                     value={accessory.rotation.x}
                                                                                     onChange={(e) => handleAccessoryRotationChange(accessory.id, "x", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{(accessory.rotation.x * 180 / Math.PI).toFixed(0)}°</div>
                                                                             </div>
                                                                             <div>
                                                                                 <Label htmlFor={`acc-${accessory.id}-rot-y`} className="text-xs">Y</Label>
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-rot-y`}
                                                                                     type="range"
                                                                                     min="-Math.PI"
                                                                                     max="Math.PI"
                                                                                     step="0.1"
                                                                                     value={accessory.rotation.y}
                                                                                     onChange={(e) => handleAccessoryRotationChange(accessory.id, "y", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{(accessory.rotation.y * 180 / Math.PI).toFixed(0)}°</div>
                                                                             </div>
                                                                             <div>
                                                                                 <Label htmlFor={`acc-${accessory.id}-rot-z`} className="text-xs">Z</Label>
                                                                                 <Input
                                                                                     id={`acc-${accessory.id}-rot-z`}
                                                                                     type="range"
                                                                                     min="-Math.PI"
                                                                                     max="Math.PI"
                                                                                     step="0.1"
                                                                                     value={accessory.rotation.z}
                                                                                     onChange={(e) => handleAccessoryRotationChange(accessory.id, "z", Number.parseFloat(e.target.value))}
                                                                                     className="h-6"
                                                                                 />
                                                                                 <div className="text-xs text-center">{(accessory.rotation.z * 180 / Math.PI).toFixed(0)}°</div>
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
                                            <Input
                                                id="text-size"
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={textSize}
                                                onChange={(e) => setTextSize(Number.parseFloat(e.target.value))}
                                                className="mt-2"
                                            />
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
                                                    <Input
                                                        id="text-x"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={textPosition.x}
                                                        onChange={(e) => {
                                                            setTextPosition((prev) => ({ ...prev, x: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{textPosition.x.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="text-y" className="text-xs">
                                                        Y
                                                    </Label>
                                                    <Input
                                                        id="text-y"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={textPosition.y}
                                                        onChange={(e) => {
                                                            setTextPosition((prev) => ({ ...prev, y: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{textPosition.y.toFixed(1)}</div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="text-z" className="text-xs">
                                                        Z
                                                    </Label>
                                                    <Input
                                                        id="text-z"
                                                        type="range"
                                                        min="-2"
                                                        max="2"
                                                        step="0.1"
                                                        value={textPosition.z}
                                                        onChange={(e) => {
                                                            setTextPosition((prev) => ({ ...prev, z: Number.parseFloat(e.target.value) }))
                                                            setSelectedTextAnchor("")
                                                        }}
                                                        className="mt-1"
                                                    />
                                                    <div className="text-xs text-center">{textPosition.z.toFixed(1)}</div>
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
                                                            <Input
                                                                id={`anchor-${editingAnchor}-x`}
                                                                type="range"
                                                                min="-2"
                                                                max="2"
                                                                step="0.1"
                                                                value={anchorPoints[editingAnchor as keyof typeof anchorPoints].x}
                                                                onChange={(e) =>
                                                                    handleAnchorPositionChange(editingAnchor, "x", Number.parseFloat(e.target.value))
                                                                }
                                                                className="mt-1"
                                                            />
                                                            <div className="text-xs text-center">
                                                                {anchorPoints[editingAnchor as keyof typeof anchorPoints].x.toFixed(1)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`anchor-${editingAnchor}-y`} className="text-xs">
                                                                Y
                                                            </Label>
                                                            <Input
                                                                id={`anchor-${editingAnchor}-y`}
                                                                type="range"
                                                                min="-2"
                                                                max="2"
                                                                step="0.1"
                                                                value={anchorPoints[editingAnchor as keyof typeof anchorPoints].y}
                                                                onChange={(e) =>
                                                                    handleAnchorPositionChange(editingAnchor, "y", Number.parseFloat(e.target.value))
                                                                }
                                                                className="mt-1"
                                                            />
                                                            <div className="text-xs text-center">
                                                                {anchorPoints[editingAnchor as keyof typeof anchorPoints].y.toFixed(1)}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`anchor-${editingAnchor}-z`} className="text-xs">
                                                                Z
                                                            </Label>
                                                            <Input
                                                                id={`anchor-${editingAnchor}-z`}
                                                                type="range"
                                                                min="-2"
                                                                max="2"
                                                                step="0.1"
                                                                value={anchorPoints[editingAnchor as keyof typeof anchorPoints].z}
                                                                onChange={(e) =>
                                                                    handleAnchorPositionChange(editingAnchor, "z", Number.parseFloat(e.target.value))
                                                                }
                                                                className="mt-1"
                                                            />
                                                            <div className="text-xs text-center">
                                                                {anchorPoints[editingAnchor as keyof typeof anchorPoints].z.toFixed(1)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-600 bg-white p-2 rounded">
                                                    <strong>Vị trí hiện tại:</strong> (
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].x.toFixed(1)},
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].y.toFixed(1)},
                                                    {anchorPoints[editingAnchor as keyof typeof anchorPoints].z.toFixed(1)})
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

                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Thông tin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <strong>Model:</strong> {getCurrentModel().name}
                                </div>
                                <div>
                                    <strong>Texture:</strong> {customTexture ? "✅ Đã áp dụng" : "❌ Chưa có"}
                                </div>
                                                                 <div>
                                     <strong>Text:</strong> {customText ? `"${customText}"` : "❌ Chưa có"}
                                 </div>
                                 <div>
                                     <strong>Phụ kiện:</strong> {accessories.length > 0 ? `✅ ${accessories.length} phụ kiện` : "❌ Chưa có"}
                                 </div>
                                 {selectedTextAnchor && (
                                    <div>
                                        <strong>Điểm neo text:</strong>{" "}
                                        {anchorPoints[selectedTextAnchor as keyof typeof anchorPoints].label}
                                    </div>
                                )}
                                {selectedTextureAnchor && (
                                    <div>
                                        <strong>Điểm neo texture:</strong>{" "}
                                        {anchorPoints[selectedTextureAnchor as keyof typeof anchorPoints].label}
                                    </div>
                                )}
                                {customText && (
                                    <div>
                                        <strong>Vị trí text:</strong> ({textPosition.x.toFixed(1)}, {textPosition.y.toFixed(1)},{" "}
                                        {textPosition.z.toFixed(1)})
                                    </div>
                                )}
                                {customTexture && (
                                    <div>
                                        <strong>Vị trí texture:</strong> ({texturePosition.x.toFixed(1)}, {texturePosition.y.toFixed(1)},{" "}
                                        {texturePosition.z.toFixed(1)})
                                    </div>
                                )}
                                {editingAnchor && (
                                    <div>
                                        <strong>Đang chỉnh sửa:</strong> {anchorPoints[editingAnchor as keyof typeof anchorPoints].label}
                                    </div>
                                )}
                                <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                        💡 Tip:{" "}
                                        {isRotating ? "Model đang tự động quay" : "Chọn điểm neo hoặc sử dụng chuột để xoay, zoom model 3D"}
                                    </p>
                                </div>
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
