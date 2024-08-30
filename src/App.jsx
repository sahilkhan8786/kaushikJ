import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useGLTF, useScroll } from '@react-three/drei';
import { easing } from 'maath';
import ReactPlayer from 'react-player'; // To play YouTube videos
import './util';
import LoadingScreen from './components/LoadingScreen';
import { gsap } from 'gsap'
import Header from './components/Header';
import Background from './components/Background.JSX';


export const App = () => {
  const [overlay, setOverlay] = useState({ isOpen: false, mediaType: '', mediaUrl: '' });
  const [animationComplete, setAnimationComplete] = useState(false);

  const openOverlay = (mediaType, mediaUrl) => {
    setOverlay({ isOpen: true, mediaType, mediaUrl });
  };

  const closeOverlay = () => {
    setOverlay({ isOpen: false, mediaType: '', mediaUrl: '' });
  };

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Background />
        <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
          <ambientLight position={[0, 0, 0]} />
          <fog attach="fog" args={['#a79', 8.5, 12]} />

          <ScrollControls pages={1}>

            <Rig rotation={[0, 0, 0]} animationComplete={animationComplete}>
              <Carousel openOverlay={openOverlay} />
            </Rig>

            <Model position={[0, -0.6, 0]} scale={[0.8, 0.8, 0.8]} setAnimationComplete={setAnimationComplete} /> {/* Adjust position and scale as needed */}

          </ScrollControls>
        </Canvas>

        {overlay.isOpen && (
          <Overlay mediaType={overlay.mediaType} mediaUrl={overlay.mediaUrl} onClose={closeOverlay} />
        )}
        <Header />
        {/* <Mouse /> */}
      </Suspense>
    </>

  );
};



function Rig({ animationComplete, ...props }) {
  const ref = useRef();
  const scroll = useScroll();

  useEffect(() => {

    // Example animation: Animate position only
    gsap.fromTo(
      ref.current.position,
      { x: 10, y: -10, z: 0 },
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        delay: 3,
        ease: 'power2.out'
      }
    );

  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2);
    ref.current.position.y = -scroll.offset * 2;
    state.camera.position.set(0, 0, 10);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={ref} {...props} />;
}

function Carousel({ openOverlay, radius = 3, count = 5, spiralDistance = 0.4 }) {
  const scroll = useScroll();
  const centerPosition = scroll.offset;

  return (
    <group position={[0, centerPosition, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const mediaType = i % 2 === 0 ? 'image' : 'video';
        const mediaUrl = mediaType === 'image'
          ? `/img${Math.floor(i % 10) + 1}_.jpg`
          : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        return (
          <Card
            key={i}
            mediaType={mediaType}
            mediaUrl={mediaUrl}
            openOverlay={openOverlay}
            position={[
              Math.sin((i / count) * Math.PI * 2) * radius * 1.2,
              i * spiralDistance - centerPosition,
              Math.cos((i / count) * Math.PI * 2) * radius * 1.2,
            ]}
            rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
          />
        );
      })}
    </group>
  );
}

function Card({ mediaType, mediaUrl, openOverlay, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);




  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);

  const handleClick = () => {
    openOverlay(mediaType, mediaUrl);
  };

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 0.8 : 0.6, 0.1, delta);
  });


  return (
    <Image
      ref={ref}
      url={mediaType === 'image' ? mediaUrl : '/img1_.jpg'} // Show placeholder for video
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      onClick={handleClick}
      {...props}
    />
  );
}

function Overlay({ mediaType, mediaUrl, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <button className="close-button" onClick={onClose}>✖</button>
      {mediaType === 'video' ? (
        <ReactPlayer url={mediaUrl} playing controls />
      ) : (
        <img src={mediaUrl} alt="Selected" />
      )}
    </div>
  );
}
function Model({ position, scale, setAnimationComplete }) {
  const { scene } = useGLTF('/scene.glb'); // Replace with your actual model path
  const ref = useRef();
  useEffect(() => {
    // GSAP Animation for the model
    gsap.timeline()
      .fromTo(ref.current.rotation, { y: 0 }, { y: Math.PI * 2, duration: 5, ease: 'power2.inOut' })
      .fromTo(ref.current.scale, { x: 0.4, y: 0.4, z: 0.4 }, { x: 0.9, y: 0.9, z: 0.9, duration: 5, ease: 'power2.inOut' }, 0)
      .eventCallback('onComplete', () => {
        setAnimationComplete(true);
      });
  }, [setAnimationComplete]);

  return (
    <primitive ref={ref} object={scene} position={position} scale={scale} />
  );
}
