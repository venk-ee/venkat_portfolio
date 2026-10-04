import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import Band from "./band";
import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function BridgeScene(){
    return(
        <div className=" w-full h-full badge-container">
            <Canvas 
            camera={{position:[0,0,13],fov:25}}
            dpr={[1,1.5]}
            gl={{antialias:true ,alpha:true}}
            >
                <ambientLight intensity={Math.PI} />

                 <Suspense fallback={null}>

                    <Physics gravity={[0,-40,0]} timeStep={1/60}>
                        <Band name="VENKATANATHA AV" title="AI & ML Engineer" photoUrl="/me.png" />
                    </Physics>
                 </Suspense>


            <Environment background blur={0.75}>
              <color attach="background" args={['#0a0a0a']} />
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
            
            </Canvas>
        </div>

    )
}