// https://cydstumpel.nl/

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import './util'

export const App = () => (
  <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
    <fog attach="fog" args={['#a79', 8.5, 12]} />
    <ScrollControls pages={1} >
      <Rig rotation={[0, 0, 0.15]}>
        <Carousel />
      </Rig>
      {/* <Banner position={[0, -0.15, 0]} /> */}
    </ScrollControls>
    <Environment preset="dawn" background blur={0.5} />
  </Canvas>
)

function Rig(props) {
  const ref = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
    ref.current.position.y = -scroll.offset;



    easing.damp3(state.camera.position, [-state.pointer.x * 2, scroll.offset * 5, 10], 0.3, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={ref} {...props} />;
}
function Carousel({ radius = 1.5, count = 5, spiralDistance = 0.5 }) {
  const scroll = useScroll(); // Get scroll offset

  // Calculate the center position for each card
  const centerPosition = scroll.offset * spiralDistance;

  return (
    <group position={[0, centerPosition, 0]}>
      {Array.from({ length: count }, (_, i) => (
        <Card
          key={i}
          url={`/img${Math.floor(i % 10) + 1}_.jpg`}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius * 1.2,
            i * spiralDistance - centerPosition, // Adjust y position to keep centered
            Math.cos((i / count) * Math.PI * 2) * radius * 1.2
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
    </group>
  );
}

function Card({ url, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);

  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta);
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
  });

  return (
    <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}
