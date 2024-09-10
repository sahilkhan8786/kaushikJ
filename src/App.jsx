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
import VisitUsButon from './components/VisitUsButon.jsx';


export const App = () => {

  const [overlay, setOverlay] = useState({ isOpen: false, mediaUrl: '' });
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isExploreClicked, setIsExploreClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update current page based on scroll offset
  useEffect(() => {
    const page = Math.floor(scrollProgress * 12) + 1;
    setCurrentPage(page);
  }, [scrollProgress]);

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
          <pointLight position={[0, 0, 0.5]} intensity={0.1} />
          <fog attach="fog" args={['#ffffff', 8.5, 12]} />
          <ScrollControls pages={10}>
            <Rig
              rotation={[0, 0, 0]}
              animationComplete={animationComplete}
              setScrollProgress={setScrollProgress}
              isExploreClicked={isExploreClicked}
              openOverlay={openOverlay}
              mediaItems={mediaItems}
              setCurrentPage={setCurrentPage}
            />
            <Model
              position={[0, -0.6, 0]}
              scale={[0.7, 0.7, 0.7]}
              scrollProgress={scrollProgress}
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
        {currentPage >= 12 && <VisitUsButon />}

        {/* Display the month name based on the currentPage */}
        {/* Progress bar at the bottom */}
        {isExploreClicked && <div style={{
          position: 'fixed',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          width: '250px', // Full width container
          justifyContent: 'space-between', // Space between "JAN" and "DEC"
          padding: '0 20px' // Optional padding to add space on the sides
        }}>
          {/* Left label (JAN) */}
          <p style={{
            color: 'white',
            margin: 0, // Remove margin for better alignment
            fontWeight: 'bold',
            fontSize: '24px'
          }}>JAN</p>

          {/* Progress bar container */}
          <div style={{
            position: 'relative',
            flex: 1, // Make the progress bar container take up remaining space
            margin: '0 20px', // Add margin between text and progress bar
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            {/* Progress bar fill */}
            <div style={{
              width: `${scrollProgress * 100}%`, // Dynamic width based on scroll progress
              height: '100%',
              backgroundColor: '#a37805', // Progress bar color
              transition: 'width 0.1s ease-out' // Smooth width transition
            }} />
          </div>

          {/* Right label (DEC) */}
          <p style={{
            color: 'white',
            margin: 0, // Remove margin for better alignment
            fontWeight: 'bold',
            fontSize: '24px'
          }}>DEC</p>
        </div>}

      </Suspense>
    </>
  );
};

function Rig({ setScrollProgress, setCurrentPage, isExploreClicked, animationComplete, openOverlay, mediaItems, ...props }) {
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



  useFrame((state, delta) => {
    const currentPage = Math.floor(scroll.offset * 12) + 1; // Calculate the current page based on scroll offset
    setCurrentPage(currentPage);

    const offset = scroll?.offset || 0; // Default to 0 if scroll is null
    setScrollProgress(offset)
    if (ref.current) {
      ref.current.rotation.y = -offset * (Math.PI * 2);
      ref.current.position.y = -offset * 1.01;
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

function Carousel({ openOverlay, mediaItems, radius = 2, spiralDistance = 0.15 }) {
  const scroll = useScroll();
  const offset = scroll?.offset

  return (
    <group position={[0, -0.5, 0]}>
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
              i * spiralDistance,
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

function Model({ position, scale, setAnimationComplete, scrollProgress }) {
  const { scene } = useGLTF('/scene.glb'); // Replace with your actual model path
  const ref = useRef();
  const [isGsapComplete, setIsGsapComplete] = useState(false);
  useEffect(() => {
    // GSAP Animation for the initial model entry
    gsap.timeline()
      .fromTo(ref.current.rotation, { y: 0 }, { y: Math.PI * 2, duration: 5, ease: 'power2.inOut' })
      .fromTo(ref.current.scale, { x: 0.4, y: 0.4, z: 0.4 }, { x: 0.7, y: 0.7, z: 0.7, duration: 5, ease: 'power2.inOut' }, 0)
      .eventCallback('onComplete', () => {
        setIsGsapComplete(true);
        setAnimationComplete(true);
      });
  }, [setAnimationComplete]);

  // Update model rotation based on scroll progress
  useFrame(() => {
    if (ref.current && isGsapComplete) {
      // Rotate model based on scroll progress
      ref.current.rotation.y = scrollProgress * (Math.PI / 8);
      // Full rotation at scrollProgress of 1
    }
  });

  return (
    <primitive ref={ref} object={scene} position={position} scale={scale} />
  );
}
