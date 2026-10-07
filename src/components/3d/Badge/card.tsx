import { useEffect, useState } from "react"
import { createCardTexture } from "./CardTexture"
import * as THREE from 'three'
import { useGLTF } from "@react-three/drei"

interface CardProps {
  name: string
  title: string
  photoUrl?: string
  onPointerDown: (e: any) => void
  onPointerUp: (e: any) => void
}

// Preload card model
useGLTF.preload('/tag.glb')

export default function Card({
  name,
  title,
  photoUrl,
  onPointerDown,
  onPointerUp
}: CardProps) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  
  // Tag geometry from model
  const { nodes, materials } = useGLTF('/tag.glb') as any

  useEffect(() => {
    let active = true

    createCardTexture({ name, title, photoUrl }).then((tex) => {
      if (active) {
        tex.flipY = false
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(1, 1) 
        tex.offset.set(0, 0)
        setTexture(tex)
      }
    })

    return () => {
      active = false
      if (texture) texture.dispose()
    }
  }, [name, title, photoUrl])

  if (!texture) return null

  return (
    <group
      scale={2.25}
      position={[0, -1.2, -0.05]}
      rotation={[0, Math.PI, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Card mesh */}
      <mesh geometry={nodes.card.geometry} renderOrder={2}>
        <meshPhysicalMaterial 
          map={texture} 
          map-anisotropy={16} 
          clearcoat={1} 
          clearcoatRoughness={0.15} 
          roughness={0.3} 
          metalness={0.5} 
        />
      </mesh>

      {/* Clip ring */}
      <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} renderOrder={3} />
      
      {/* Clamp collar */}
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} renderOrder={3} />
    </group>
  )
}