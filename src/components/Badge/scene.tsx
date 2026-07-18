import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import Band from "./band";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function BridgeScene(){
    return(
        <div className=" w-full h-full badge-container">
            <Canvas 
            camera={{position:[0,0,13],fov:25}}
            dpr={[1,1.5]}
            gl={{antialias:true ,alpha:true}}
            >
                <ambientLight intensity={0.6} />

                <spotLight position={[10,15,10]}
                 angle={0.2} 
                 penumbra={1} 
                 intensity={3} 
                 castShadow />

                 <directionalLight position={[-10,-10,-5]} intensity={1} />

                 <Suspense fallback={null}>

                    <Physics gravity={[0,-40,0]} timeStep={1/60}>
                        <Band name="venkat" title="swe">

                        </Band>

                    </Physics>
                 </Suspense>



            <Environment preset="city"/>
                
            </Canvas>
        </div>

    )
}