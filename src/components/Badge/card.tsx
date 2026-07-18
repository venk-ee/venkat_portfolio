import { useEffect, useState } from "react";
import { createCardTexture } from "./CardTexture";
import * as THREE from 'three'
import { RoundedBox } from "@react-three/drei";


interface CardProps {
    name: string;
    title: string;
    photoUrl?: string;

    onPointerDown:(e:any)=>void
    onPointerUp:(e:any)=>void
}



export default function Card({
    name,
    title,
    photoUrl,
    onPointerDown,
    onPointerUp
}: CardProps) {

    const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

    useEffect(()=>{
        let active=true

        createCardTexture({name, title, photoUrl}).then((tex)=>{
            if(active) setTexture(tex)
        })

        return ()=>{
            active=false
            if (texture) {
                texture.dispose()
            }
        }
    }, [name, title, photoUrl])
    
    if (!texture) return null
    
    return (
        <mesh castShadow receiveShadow onPointerDown={onPointerDown} onPointerUp={onPointerUp}>

            <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.06} smoothness={4}>
                <meshPhysicalMaterial map={texture} roughness={0.2} clearcoat={1.0} clearcoatRoughness={0.05} color='#111111' />
            </RoundedBox>
        </mesh>
    )
}