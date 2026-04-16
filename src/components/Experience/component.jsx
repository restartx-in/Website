import { useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import gsap from "gsap";
import './style.scss';

function SceneContent() {
  const headRef = useRef();
  const airpodL = useRef();
  const airpodR = useRef();
  const airpodCenter = useRef();
  const scroll = useScroll();
  const tl = useRef();

  // Create the Animation Timeline
  useLayoutEffect(() => {
    tl.current = gsap.timeline({ defaults: { duration: 2, ease: "power2.inOut" } });

    tl.current
      // PHASE 1: Appear one by one
      .to(airpodL.current.position, { x: -1.5, opacity: 1 }, 0)
      .to(airpodR.current.position, { x: 1.5, opacity: 1 }, 0.5)
      
      // PHASE 2: Head Appears & AirPods move to ears
      .to(headRef.current.position, { y: 0, opacity: 1 }, 1.5)
      .to(airpodL.current.position, { x: -0.6, y: 0.2, z: 0.5, scale: 0.5 }, 2)
      .to(airpodR.current.position, { x: 0.6, y: 0.2, z: 0.5, scale: 0.5 }, 2)
      .to(airpodCenter.current.position, { y: -5 }, 2)
      
      // PHASE 3: Fade out everything as we transition to video
      .to([airpodL.current.scale, airpodR.current.scale], { x: 0, y: 0, z: 0, duration: 1 }, 3)
      .to(headRef.current.position, { y: -10, duration: 1 }, 3);
  }, []);

  useFrame(() => {
    // This links the GSAP timeline to the Scroll position
    // We adjust the range to ensure it fades out before the next section
    tl.current.seek(scroll.offset * tl.current.duration());
  });

  return (
    <>
      {/* 3D Human Head Placeholder (Replace with <primitive object={model.scene} />) */}
      <mesh ref={headRef} position={[0, -5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#333" roughness={0.3} />
      </mesh>

      {/* AirPod Left */}
      <mesh ref={airpodL} position={[-10, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 16]} />
        <meshStandardMaterial color="white" metalness={1} roughness={0} />
      </mesh>

      {/* AirPod Right */}
      <mesh ref={airpodR} position={[10, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 16]} />
        <meshStandardMaterial color="white" metalness={1} roughness={0} />
      </mesh>

      {/* AirPod Center (3rd one) */}
      <mesh ref={airpodCenter} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 16]} />
        <meshStandardMaterial color="white" metalness={1} roughness={0} />
      </mesh>

      <Environment preset="city" />
    </>
  );
}

export default function Experience({ children }) {
  return (
    <div className="experience-wrapper">
      <Canvas shadow={{ type: 'basic' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={2} />
        
        <ScrollControls pages={4} damping={0.2}>
          <SceneContent />
          <Scroll html>
            {children}
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}