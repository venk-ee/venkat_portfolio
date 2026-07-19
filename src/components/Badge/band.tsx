import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { RigidBody, useRopeJoint, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import Card from './card'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any
    meshLineMaterial: any
  }
}

interface BandProps {
  name: string
  title: string
  photoUrl?: string
  maxSpeed?: number
  minSpeed?: number
}

export default function Band({
  name,
  title,
  maxSpeed = 50,
  minSpeed = 10
}: BandProps) {
  // Refs for physics bodies
  const band = useRef<any>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)

  // Vector caches to prevent garbage collector overhead in the 60fps loop
  const vec = useRef(new THREE.Vector3())
  const ang = useRef(new THREE.Vector3())
  const rot = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2
  }

  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]))

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  // 1. Setup physics joints (matching ref names fixed, j1, j2, j3, card)
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  // Grab cursors
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
  }, [hovered, dragged])

  // 2. Physics & rendering loop
  useFrame((state, delta) => {
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) return

    // Drag math using unprojection to follow mouse cursor pixel-perfectly
    if (dragged) {
      vec.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.current.copy(vec.current).sub(state.camera.position).normalize()
      vec.current.add(dir.current.multiplyScalar(state.camera.position.length()))

      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())

      card.current.setNextKinematicTranslation({
        x: vec.current.x - dragged.x,
        y: vec.current.y - dragged.y,
        z: vec.current.z - dragged.z
      })
    }

    // Drawing curve and stabilizing card angle
    ;[j1, j2].forEach((ref) => {
      if (!ref.current.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
      }
      const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
      ref.current.lerped.lerp(
        ref.current.translation(),
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
      )
    })

    // Curve positions for lanyard line
    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(j2.current.lerped)
    curve.points[2].copy(j1.current.lerped)
    curve.points[3].copy(fixed.current.translation())

    if (band.current) {
      band.current.geometry.setPoints(curve.getPoints(32))
    }

    // Auto-facing stabilization (torque)
    ang.current.copy(card.current.angvel())
    rot.current.copy(card.current.rotation())
    card.current.setAngvel({
      x: ang.current.x,
      y: ang.current.y - rot.current.y * 0.25,
      z: ang.current.z
    })
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[0, 4, 0]}>
        {/* Fixed Anchor */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Chain nodes */}
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Card Body */}
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation()
              ;(e.target as any).releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              ;(e.target as any).setPointerCapture(e.pointerId)

              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.current.copy(card.current.translation()))
              )
            }}
          >
            <Card
              name={name}
              title={title}
              onPointerDown={() => {}}
              onPointerUp={() => {}}
            />
          </group>
        </RigidBody>
      </group>

      {/* Lanyard Line - Render solid matte black line (No Vercel printed strap pattern) */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#151515" // Solid matte black/charcoal
          depthTest={false}
          resolution={[width, height]}
          lineWidth={0.06} // Thinner elegant line
        />
      </mesh>
    </>
  )
}