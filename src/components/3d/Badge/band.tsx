import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { RigidBody, useRopeJoint, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useTexture } from '@react-three/drei'
import Card from './card'

extend({ MeshLineGeometry, MeshLineMaterial })

useTexture.preload('/band.png')

// The tag hangs higher on narrow screens so it stays off the hero text.
// Same physics everywhere — this only moves the anchor point.
const MOBILE_LIFT = 1.8
const MOBILE_MAX_WIDTH = 768 // matches the md: breakpoint

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
  photoUrl,
  maxSpeed = 50,
  minSpeed = 10
}: BandProps) {
  const bandTexture = useTexture('/band.png')
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping

  const band = useRef<any>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)
  const wallL = useRef<any>(null)
  const wallR = useRef<any>(null)
  const wallF = useRef<any>(null)

  // Reused every frame — nothing gets allocated in the render loop.
  const vec = useRef(new THREE.Vector3())
  const ang = useRef(new THREE.Vector3())
  const rot = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 3,
    linearDamping: 3
  }

  // Viewport in world units, for the drag limits and screen-edge walls.
  const viewport = useThree((state) => state.viewport)
  const halfW = viewport.width / 2
  const halfH = viewport.height / 2

  // Canvas size in CSS pixels.
  const { width, height } = useThree((state) => state.size)

  const isMobile = width < MOBILE_MAX_WIDTH
  const mobileLift = useRef(isMobile ? MOBILE_LIFT : 0)

  // Where the rig starts. The group never moves after mount — on resize we
  // teleport the bodies instead, so meshes and physics stay in sync.
  const [rig] = useState(() => {
    const hw = viewport.width / 2
    return {
      mountX: Math.min(4.4, hw - 1.7),
      mountY: 4.6 + mobileLift.current,
      halfW0: hw,
      halfH0: viewport.height / 2,
    }
  })
  const MOUNT_X = rig.mountX
  const MOUNT_Y = rig.mountY
  const mountXLive = useRef(rig.mountX)
  const mountYLive = useRef(rig.mountY)

  // Resize teleports the rig to its new spot (sideways, plus the mobile lift).
  // Same offset for every body, so the joints stay intact.
  useEffect(() => {
    const newMountX = Math.min(4.4, halfW - 1.7)
    const dx = newMountX - mountXLive.current
    const newLift = width < MOBILE_MAX_WIDTH ? MOBILE_LIFT : 0
    const dy = newLift - mobileLift.current
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return
    mountXLive.current = newMountX
    mountYLive.current += dy
    mobileLift.current = newLift
    ;[fixed, j1, j2, j3, card].forEach((ref) => {
      const b = ref.current
      if (!b) return
      const t = b.translation()
      b.setTranslation({ x: t.x + dx, y: t.y + dy, z: t.z }, true)
    })
    const placeWall = (ref: any, x: number, y: number) => {
      if (ref.current) ref.current.setTranslation({ x, y, z: 0 }, true)
    }
    placeWall(wallL, -halfW + 0.5, mountYLive.current - 2)
    placeWall(wallR, halfW - 0.5, mountYLive.current - 2)
    placeWall(wallF, newMountX, -halfH + 1.15)
  }, [halfH, halfW, viewport.width, width])

  // Strap curve: clip ring -> joints -> mount.
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]))

  // Where the strap meets the metal clip, above the card body.
  const clipPos = useRef(new THREE.Vector3())
  const clipQuat = useRef(new THREE.Quaternion())
  const CLIP_OFFSET = useRef(new THREE.Vector3(0, 1.45, 0))

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => {
        document.body.style.cursor = 'auto'
      }
    }
  }, [hovered, dragged])

  // Strap thins out just before it meets the card.
  const widthCallback = (p: number) => (p < 0.06 ? p / 0.06 : 1)

  useFrame((state, delta) => {
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current
    ) return

    if (dragged) {
      vec.current.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.current.copy(vec.current).sub(state.camera.position).normalize()
      vec.current.add(dir.current.multiplyScalar(state.camera.position.length()))

      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())

      const targetX = Math.min(halfW - 0.9, Math.max(-halfW + 0.9, vec.current.x - dragged.x))
      const targetY = Math.min(halfH - 1, Math.max(-halfH + 1.6, vec.current.y - dragged.y))
      card.current.setNextKinematicTranslation({
        x: targetX,
        y: targetY,
        z: vec.current.z - dragged.z
      })
    }

    // The links chase their real positions with a bit of lag, so the strap
    // flows instead of snapping.
    ;[j1, j2].forEach((ref) => {
      if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
      const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
      ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
    })

    const cardQuat = card.current.rotation()
    clipQuat.current.set(cardQuat.x, cardQuat.y, cardQuat.z, cardQuat.w)
    clipPos.current.copy(CLIP_OFFSET.current).applyQuaternion(clipQuat.current).add(card.current.translation())
    curve.points[0].copy(clipPos.current)
    curve.points[1].copy(j3.current.translation())
    curve.points[2].copy(j2.current.lerped)
    curve.points[3].copy(j1.current.lerped)
    curve.points[4].copy(fixed.current.translation())

    if (band.current) {
      band.current.geometry.setPoints(curve.getPoints(32), widthCallback)
    }

    // Spin damping, plus a soft nudge so the pendulum never fully settles.
    // Skipped while dragging — the pointer is in charge there.
    ang.current.copy(card.current.angvel())
    rot.current.copy(card.current.rotation())
    const t = state.clock.elapsedTime
    // Two out-of-sync waves so it never looks mechanical. Hand-tuned: raise
    // the amplitudes for a bigger sway; slowing the waves sways even further.
    const idleSway = dragged
      ? 0
      : Math.sin(t * 0.6) * 0.05 + Math.sin(t * 0.93 + 1.7) * 0.018
    card.current.setAngvel({
      x: ang.current.x,
      y: ang.current.y - rot.current.y * 0.25,
      z: ang.current.z + idleSway
    })
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[MOUNT_X, MOUNT_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Invisible walls that keep the tag inside the screen. */}
        <RigidBody ref={wallL} position={[(-rig.halfW0 + 0.5) - MOUNT_X, -2, 0]} type="fixed" colliders={false}>
          <CuboidCollider args={[0.2, 8, 2]} />
        </RigidBody>
        <RigidBody ref={wallR} position={[(rig.halfW0 - 0.5) - MOUNT_X, -2, 0]} type="fixed" colliders={false}>
          <CuboidCollider args={[0.2, 8, 2]} />
        </RigidBody>
        <RigidBody ref={wallF} position={[0, (-rig.halfH0 + 1.15) - MOUNT_Y, 0]} type="fixed" colliders={false}>
          <CuboidCollider args={[rig.halfW0 + 1, 0.2, 2]} />
        </RigidBody>

        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* canSleep stays off — otherwise Rapier dozes and kills the sway. */}
        <RigidBody
          position={[0, -4.45, 0]}
          ref={card}
          {...segmentProps}
          canSleep={false}
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
              photoUrl={photoUrl}
              onPointerDown={() => {}}
              onPointerUp={() => {}}
            />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={bandTexture}
          repeat={new THREE.Vector2(-3, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}