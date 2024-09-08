import React, { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Image, ScrollControls, useGLTF, useScroll } from '@react-three/drei';
import { easing } from 'maath';
import ReactPlayer from 'react-player'; // To play YouTube videos
import './util';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Background from './components/Background.jsx';
import TabComponent from './components/TabComponent.jsx';
import ExploreButton from './components/ExploreButton.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import { mediaItems } from './constant/index.js';
import { gsap } from 'gsap'

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const App = () => {
  const [overlay, setOverlay] = useState({ isOpen: false, mediaUrl: '' });
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isExploreClicked, setIsExploreClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(0);

  // Update current page based on scroll offset
  useEffect(() => {
    const page = Math.floor(offset * 12) + 1; // Assuming there are 12 pages
    setCurrentPage(page);
  }, [offset]);

  const openOverlay = (mediaUrl) => {
    setOverlay({ isOpen: true, mediaUrl });
  };

  const closeOverlay = () => {
    setOverlay({ isOpen: false, mediaUrl: '' });
  };

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Background />
        <Canvas camera={{ position: [0, 0, 50], fov: 15 }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <pointLight position={[0, 0, 0.5]} intensity={1} />
          <ambientLight intensity={0.5} />
          <fog attach="fog" args={['#ffffff', 8.5, 12]} />
          <ScrollControls pages={12}>
            <Rig
              rotation={[0, 0, 0]}
              animationComplete={animationComplete}
              isExploreClicked={isExploreClicked}
              setOffset={setOffset}
              openOverlay={openOverlay}
              mediaItems={mediaItems}
            />
            <Model
              position={[0, -0.6, 0]}
              scale={[0.7, 0.7, 0.7]}
              setAnimationComplete={setAnimationComplete}
            />
          </ScrollControls>
        </Canvas>

        {overlay.isOpen && (
          <Overlay mediaUrl={overlay.mediaUrl} onClose={closeOverlay} />
        )}
        <Header />
        <TabComponent />
        {!isExploreClicked && <ExploreButton setIsExploreClicked={setIsExploreClicked} />}
        <AudioPlayer />

        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          fontSize: '24px',
          color: 'white'
        }}>
          {months[currentPage - 1]}
        </div>
      </Suspense>
    </>
  );
};

function Rig({ setOffset, isExploreClicked, animationComplete, openOverlay, mediaItems, ...props }) {
  const ref = useRef();
  const scroll = useScroll();

  useEffect(() => {
    if (isExploreClicked && ref.current) {
      gsap.fromTo(
        ref.current.position,
        { x: 10, y: -10, z: 0 },
        {
          x: 0,
          y: 0,
          z: 0,
          duration: 2,
          delay: 1,
          ease: 'power2.out'
        }
      );
    }
  }, [isExploreClicked]);

  useEffect(() => {
    setOffset(scroll.offset);
  }, [scroll, setOffset]);

  useFrame((state, delta) => {
    const offset = scroll?.offset || 0; // Default to 0 if scroll is null
    if (ref.current) {
      ref.current.rotation.y = -offset * (Math.PI * 2);
      ref.current.position.y = -offset * 2;
    }
    state.camera.position.set(0, 0, 10);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} {...props}>
      {isExploreClicked && (
        <group>
          <Carousel openOverlay={openOverlay} mediaItems={mediaItems} />
          {/* <HeadingCarousel mediaItems={mediaItems} /> */}
        </group>
      )}
    </group>
  );
}

function Carousel({ openOverlay, mediaItems, radius = 3, spiralDistance = 0.2 }) {
  const scroll = useScroll();
  const centerPosition = scroll?.offset || 0;

  return (
    <group position={[0, -centerPosition, 0]}>
      {mediaItems.map((item, i) => {
        const { mediaUrl, label, imageURL } = item;

        return (
          <Card
            imageURL={imageURL}
            key={i}
            i={i}
            mediaUrl={mediaUrl}
            openOverlay={openOverlay}
            position={[
              Math.sin((i / mediaItems.length) * Math.PI * 2) * radius,
              i * spiralDistance - centerPosition,
              Math.cos((i / mediaItems.length) * Math.PI * 2) * radius,
            ]}
            rotation={[0, Math.PI + (i / mediaItems.length) * Math.PI * 2, 0]}
            label={label}
          />
        );
      })}
    </group>
  );
}

function HeadingCarousel({ mediaItems }) {
  const scroll = useScroll();
  const centerPosition = scroll?.offset || 0;

  return (
    <group>
      {mediaItems.map((item, i) => (
        <Html
          key={i}
          style={{
            color: 'white',
            fontSize: '24px',
            textAlign: 'center',
            position: 'absolute',
            transform: `translateY(${i * 0.2 - centerPosition}px)`,
          }}
        >
          <div>{item.label}</div>
        </Html>
      ))}
    </group>
  );
}

function Card({ i, mediaUrl, imageURL, openOverlay, label, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);

  const pointerOver = (e) => {
    e.stopPropagation();
    hover(true);
  };

  const pointerOut = () => hover(false);

  const handleClick = () => {
    openOverlay(mediaUrl);
  };

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 0.8 : 0.6, 0.1, delta);
  });

  return (
    <group {...props}>
      <Image
        ref={ref}
        url={imageURL}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

function Overlay({ mediaUrl, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <button className="close-button" onClick={onClose}>✖</button>
      <ReactPlayer url={mediaUrl} playing controls />
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
      .fromTo(ref.current.scale, { x: 0.4, y: 0.4, z: 0.4 }, { x: 0.7, y: 0.7, z: 0.7, duration: 5, ease: 'power2.inOut' }, 0)
      .eventCallback('onComplete', () => {
        setAnimationComplete(true);
      });
  }, [setAnimationComplete]);

  return (
    <primitive ref={ref} object={scene} position={position} scale={scale} />
  );
}
