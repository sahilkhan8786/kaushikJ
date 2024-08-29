import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, ScrollControls, useScroll } from '@react-three/drei';
import { easing } from 'maath';
import ReactPlayer from 'react-player'; // To play YouTube videos
import './util';

export const App = () => {
  const [overlay, setOverlay] = useState({ isOpen: false, mediaType: '', mediaUrl: '' });

  const openOverlay = (mediaType, mediaUrl) => {
    setOverlay({ isOpen: true, mediaType, mediaUrl });
  };

  const closeOverlay = () => {
    setOverlay({ isOpen: false, mediaType: '', mediaUrl: '' });
  };

  return (
    <>
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
        <fog attach="fog" args={['#a79', 8.5, 12]} />
        <ScrollControls pages={1}>
          <Rig rotation={[0, 0, 0.15]}>
            <Carousel openOverlay={openOverlay} />
          </Rig>
        </ScrollControls>
      </Canvas>

      {overlay.isOpen && (
        <Overlay mediaType={overlay.mediaType} mediaUrl={overlay.mediaUrl} onClose={closeOverlay} />
      )}
    </>
  );
};

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

function Carousel({ openOverlay, radius = 1.5, count = 5, spiralDistance = 0.5 }) {
  const scroll = useScroll();
  const centerPosition = scroll.offset * spiralDistance;

  return (
    <group position={[0, centerPosition, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const mediaType = i % 2 === 0 ? 'image' : 'video'; // Alternating for example
        const mediaUrl = mediaType === 'image'
          ? `/img${Math.floor(i % 10) + 1}_.jpg`
          : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Example YouTube URL

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
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
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
