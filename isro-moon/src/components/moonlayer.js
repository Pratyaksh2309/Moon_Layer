import React, { useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import Sidebar from './sidebar';
import './moonlayer.css';

const MoonModel = ({ scale, autoRotate }) => {
  const { scene } = useGLTF('Moon_1_3474.glb');
  const moonRef = useRef();

  // Rotate the moon if auto-rotate is enabled
  useFrame(() => {
    if (autoRotate && moonRef.current) {
      moonRef.current.rotation.y += 0.01; // Adjust rotation speed
    }
  });

  return <primitive ref={moonRef} object={scene} scale={scale} />;
};

const CameraPosition = ({ setCoordinates }) => {
  const { camera } = useThree(); // Access the camera from useThree hook

  // Calculate latitude and longitude based on camera position
  const calculateLatLong = (cameraPosition) => {
    const radius = Math.sqrt(cameraPosition.x ** 2 + cameraPosition.y ** 2 + cameraPosition.z ** 2);
    const latitude = (Math.asin(cameraPosition.y / radius) * 180) / Math.PI;
    const longitude = (Math.atan2(cameraPosition.z, cameraPosition.x) * 180) / Math.PI;

    return {
      latitude: latitude.toFixed(2),
      longitude: longitude.toFixed(2),
    };
  };

  // Using useFrame to update camera position on every frame
  useFrame(() => {
    const { x, y, z } = camera.position;

    // Calculate latitude and longitude based on camera position
    const newCoordinates = calculateLatLong({ x, y, z });

    // Update coordinates on every frame
    setCoordinates(newCoordinates);
  });

  return null;
};

const MoonLayer = () => {
  const [showStars, setShowStars] = useState(true); // Handle stars visibility
  const [autoRotate, setAutoRotate] = useState(false); // State for auto rotation
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <Sidebar
        setShowStars={setShowStars}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate} // Control auto-rotation
      />
      <Canvas
        camera={{
          position: [500, 500, 500], // Initial camera position (x, y, z)
          fov: 50, // Field of view
          near: 1, // Set near clipping plane to 1 (default is often too close)
          far: 10000, // Set far clipping plane to a large value (increased to 10000)
        }}
      >
        {showStars && (
          <Stars
            radius={300} // Place stars outside the Moon
            depth={250} // Depth of stars field
            count={8000} // Number of stars
            factor={10} // Spread factor
            saturation={0} // Set color to white
            fade={true} // Smooth fade effect
          />
        )}
        <ambientLight intensity={2.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* The MoonModel will move with OrbitControls, but stars will stay fixed */}
        <MoonModel scale={[0.5, 0.5, 0.5]} autoRotate={autoRotate} />

        {/* OrbitControls will move the camera, not the stars */}
        <OrbitControls
          enableZoom={true}
          zoomSpeed={2.0}
          rotateSpeed={1.2}
          enablePan={true}
        />

        {/* CameraPosition will calculate and update the coordinates */}
        <CameraPosition setCoordinates={setCoordinates} />
      </Canvas>

      {/* Display latitude and longitude at the bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        <p>Latitude: {coordinates.latitude}°</p>
        <p>Longitude: {coordinates.longitude}°</p>
      </div>
    </div>
  );
};

export default MoonLayer;
