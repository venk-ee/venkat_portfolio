import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import Band from "./band";
import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { portfolio } from "../../../data/portfolio";


export default function BridgeScene(){
    return(
        <div className="absolute inset-0 h-full w-full badge-container">
            <Canvas 
            camera={{position:[0,0,15.5],fov:25}}
            dpr={[1,1.5]}
            gl={{antialias:true ,alpha:true}}
            >
                <ambientLight intensity={Math.PI} />

                 <Suspense fallback={null}>

                    <Physics gravity={[0,-40,0]} timeStep={1/60}>
                        <Band name={portfolio.badgeName} title={portfolio.badgeTitle} photoUrl={portfolio.photoUrl} />
                    </Physics>
                 </Suspense>


            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
            
            </Canvas>
        </div>

    )
}