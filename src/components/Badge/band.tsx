import { useRef, useState } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { RigidBody, useSphericalJoint } from "@react-three/rapier";
import * as THREE from "three";
import Card from "./card";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
      interface ThreeElements {
        meshLineGeometry: any
        meshLineMaterial: any
      }
    }

interface bandProps {
    name: string;
    title: string;
}


export default function Band({name,title}: bandProps) {

    const {viewport} = useThree();

    const anchorRef=useRef<any>(null)
    const j1Ref=useRef<any>(null)
    const j2Ref=useRef<any>(null)
    const j3Ref=useRef<any>(null)
    const cardRef=useRef<any>(null)

    const lineRef=useRef<any>(null)

    const [dragged,setDragged]=useState(false)

    // Format: useSphericalJoint(BodyA, BodyB, [LocalAnchorA, LocalAnchorB])
    useSphericalJoint(anchorRef,j1Ref,[[0,-0.4,0],[0,0.4,0]])
    useSphericalJoint(j1Ref,j2Ref,[[0,-0.4,0],[0,0.4,0]])
    useSphericalJoint(j2Ref,j3Ref,[[0,-0.4,0],[0,0.4,0]])
    useSphericalJoint(j3Ref,cardRef,[[0,-0.4,0],[0,1.4,0]])
  
    useFrame((state) => {
        if (
          !anchorRef.current ||
          !j1Ref.current ||
          !j2Ref.current ||
          !j3Ref.current ||
          !cardRef.current
        ) return


       if (dragged) {

        const targetx=(state.pointer.x * viewport.width )/ 2;
        const targety=(state.pointer.y * viewport.height) / 2;

        cardRef.current.setNextKinematicTranslation({x:targetx,y:targety,z:0})
        
       }

       const pAnchor=anchorRef.current.translation()
       const pj1=j1Ref.current.translation()
       const pj2=j2Ref.current.translation()
       const pj3=j3Ref.current.translation()
       const pcard=cardRef.current.translation()

       const curvePoints=[
        new THREE.Vector3(pAnchor.x, pAnchor.y -0.4, pAnchor.z),
        new THREE.Vector3(pj1.x, pj1.y, pj1.z),
        new THREE.Vector3(pj2.x, pj2.y, pj2.z),
        new THREE.Vector3(pj3.x, pj3.y, pj3.z),
        new THREE.Vector3(pcard.x, pcard.y+1.05, pcard.z)
       ]
   

       const curve=new THREE.CatmullRomCurve3(curvePoints)
       const points=curve.getPoints(32)

       if (lineRef.current) {
        const flatPoints=points.flatMap((p) => [p.x, p.y, p.z])
        lineRef.current.setPoints(flatPoints)
       }
    })


    return (
        <>
        <RigidBody ref={anchorRef} type="fixed" position={[0,4.2,0]}>
            <mesh visible={false} >
                <sphereGeometry args={[0.05]} />
            </mesh>
        </RigidBody>

        {/*segment1 */}
        <RigidBody ref={j1Ref} position={[0,3.4,0]} linearDamping={1.5} angularDamping={1.5}>
            <mesh visible={false}>
                <sphereGeometry args={[0.05]} />
            </mesh>
        </RigidBody>

        {/*segment 2 */}
        <RigidBody ref={j2Ref} position={[0,2.6,0]} linearDamping={1.5} angularDamping={1.5}>
            <mesh visible={false}>
                <sphereGeometry args={[0.05]} />
            </mesh>
        </RigidBody>

        {/*segment 3 */}
        <RigidBody ref={j3Ref} position={[0,1.8,0]} linearDamping={1.5} angularDamping={1.5}>
            <mesh visible={false}>
                <sphereGeometry args={[0.05]} />
            </mesh>
        </RigidBody>
        
        {/* CARD */}
        <RigidBody ref={cardRef} position={[0,1.0,0]} linearDamping={1.5} angularDamping={1.5}>
            <Card name={name} title={title} 
            onPointerDown={(e) => {
              e.stopPropagation()
              e.target.setPointerCapture(e.pointerId)

              cardRef.current.setBodyType(2)
              setDragged(true)
            }}
            onPointerUp={(e) => {
                e.stopPropagation()
              e.target.releasePointerCapture(e.pointerId)
              cardRef.current.setBodyType(0)
              setDragged(false)
            }}
            />

        </RigidBody>

        {/* visual line */}

        <mesh>
            <meshLineGeometry ref={lineRef} />
            <meshLineMaterial color="#CCFF00" lineWidth={0.08} attenuate={1}/>
        </mesh>
        


        </>
    )
}

