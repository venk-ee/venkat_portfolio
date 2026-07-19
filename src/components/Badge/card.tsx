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

  // Preload Vercel's GLB card model
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')

export default function Card({
  name,
  title,
  onPointerDown,
  onPointerUp
}: CardProps) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') as any

  useEffect(() => {
    let active = true

    createCardTexture({ name, title }).then((tex) => {
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
  }, [name, title])

  if (!texture) return null

  return (
    <group
      scale={2.25}
      position={[0, -1.2, -0.05]}
      rotation={[0, Math.PI, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Portrait card mesh geometry mapped with our texture */}
      <mesh geometry={nodes.card.geometry}>
        <meshPhysicalMaterial 
          map={texture} 
          map-anisotropy={16} 
          clearcoat={1} 
          clearcoatRoughness={0.15} 
          roughness={0.3} 
          metalness={0.5} 
        />
      </mesh>

      {/* Realistic metal clip at the top of the card */}
      <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
      
      {/* Metal clamp holding the rope */}
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
    </group>
  )
}