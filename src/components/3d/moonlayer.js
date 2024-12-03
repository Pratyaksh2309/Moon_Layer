import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './moonlayer.css';

const MoonModel = React.forwardRef(({ scale, overlayUrl, visible }, ref) => {
  const { scene } = useGLTF('Moon_1_3474.glb'); // Load your Moon model

  useEffect(() => {
    console.log('GLTF Loaded:', scene); // Log the scene object
  }, [scene]); // This will log when the model is loaded or updated

  const [overlayTexture, setOverlayTexture] = useState(null);
  const overlayMesh = useRef();

  // Memoize texture loading so it only loads when overlayUrl changes
  const memoizedTexture = useMemo(() => {
    if (overlayUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(overlayUrl, (loadedTexture) => {
        setOverlayTexture(loadedTexture);
      });
    } else {
      setOverlayTexture(null); // Clear the texture if overlayUrl is empty
    }
  }, [overlayUrl]); // This ensures it only runs when overlayUrl changes

  // Rotate overlayMesh when texture is loaded
  useEffect(() => {
    if (overlayMesh.current && overlayTexture) {
      overlayMesh.current.rotation.set(0, Math.PI, 0); // Rotate 180 degrees on Y-axis
    }
  }, [overlayTexture]); // Only run when overlayTexture is updated

  return (
    <>
      {/* Moon Base Model */}
      <primitive ref={ref} object={scene} scale={scale} />

      {/* Overlay Sphere for Heatmap */}
      {visible && overlayTexture && (
        <mesh
          ref={overlayMesh}
          scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]} // Slightly larger than base Moon model
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={overlayTexture}
            transparent={true}
            opacity={0.6} // Adjust opacity for blending
            depthWrite={false} // Prevent z-fighting between overlay and model
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}
    </>
  );
});

const RaycasterHandler = ({ setCoordinates }) => {
  const { camera, mouse } = useThree();
  const moonRef = useRef();
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(() => {
    if (moonRef.current) {
      raycaster.current.setFromCamera(mouse, camera);
      const intersects = raycaster.current.intersectObject(moonRef.current, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;

        const sphereCoords = new THREE.Spherical();
        sphereCoords.setFromVector3(point);

        const latitude = (90 - (sphereCoords.phi * 180) / Math.PI).toFixed(2);
        const longitude = ((sphereCoords.theta * 180) / Math.PI - 180).toFixed(2);

        setCoordinates({ latitude, longitude });
      } else {
        setCoordinates({ latitude: 0, longitude: 0 });
      }
    }
  });

  return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]} />;
};

const MoonLayer = React.memo(({ viewMode, selectedElement1, selectedElement2 }) => {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

  // Map for texture combinations
  const textureMap = {
    "Al_Al": "",  // Combination of Element 1 and Element 1
    "Al_Si": "Al_Si.png",  // Combination of Element 1 and Element 2
    "Si_Al": "Al_Si.png",  // Combination of Element 2 and Element 1
    "Si_Si": "",  // Combination of Element 2 and Element 2
    // Add more combinations as necessary
  };

  // Generate selected texture URL
  const selectedCombo = `${selectedElement1}_${selectedElement2}`;
  const textureUrl = textureMap[selectedCombo] || "";  // Default to empty string if no match

  const mousePosition = useRef({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    mousePosition.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <Canvas
        camera={{
          position: [500, 500, 500],
          fov: 50,
          near: 1,
          far: 10000,
        }}
        onPointerMove={handlePointerMove}
      >
        <ambientLight intensity={2.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RaycasterHandler setCoordinates={setCoordinates} />

        {/* Render Moon Model with texture */}
        <MoonModel
          scale={[0.5, 0.5, 0.5]}
          overlayUrl={textureUrl}  // Pass texture URL for overlay
          visible={viewMode === "3D"}
        />

        <OrbitControls
          enableZoom={true}
          zoomSpeed={2.0}
          rotateSpeed={1.2}
          enablePan={true}
          minDistance={280}
          maxDistance={2000}
        />
      </Canvas>

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
});

export default MoonLayer;
