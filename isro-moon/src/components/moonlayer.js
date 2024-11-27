// import React, { useState, useRef } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
// import Sidebar from './sidebar';
// import './moonlayer.css';
// import * as THREE from 'three';

// // The MoonModel with auto-rotate support
// const MoonModel = React.forwardRef(({ scale, autoRotate }, ref) => {
//   const { scene } = useGLTF('Moon_1_3474.glb');

//   useFrame(() => {
//     if (autoRotate && ref.current) {
//       ref.current.rotation.y += 0.01; // Adjust rotation speed here
//     }
//   });

//   return <primitive ref={ref} object={scene} scale={scale} />;
// });

// // RaycasterHandler to calculate latitude and longitude
// const RaycasterHandler = ({ setCoordinates, autoRotate }) => {
//   const { camera, mouse } = useThree();
//   const moonRef = useRef();
//   const raycaster = useRef(new THREE.Raycaster());

//   useFrame(() => {
//     if (moonRef.current) {
//       // Perform raycasting
//       raycaster.current.setFromCamera(mouse, camera);
//       const intersects = raycaster.current.intersectObject(moonRef.current, true);

//       if (intersects.length > 0) {
//         const point = intersects[0].point;

//         // Convert the intersection point to spherical coordinates
//         const sphereCoords = new THREE.Spherical();
//         sphereCoords.setFromVector3(point);

//         // Convert spherical coordinates to latitude and longitude
//         const latitude = (90 - (sphereCoords.phi * 180) / Math.PI).toFixed(2);
//         const longitude = ((sphereCoords.theta * 180) / Math.PI - 180).toFixed(2);

//         setCoordinates({ latitude, longitude });
//       } else {
//         // Reset latitude and longitude to zero if no intersection
//         setCoordinates({ latitude: 0, longitude: 0 });
//       }
//     }
//   });

//   return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]} autoRotate={autoRotate} />;
// };

// // Main MoonLayer Component
// const MoonLayer = () => {
//   const [showStars, setShowStars] = useState(true); // Handle stars visibility
//   const [autoRotate, setAutoRotate] = useState(false); // State for auto rotation
//   const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
//   const mousePosition = useRef({ x: 0, y: 0 });

//   const handlePointerMove = (event) => {
//     const rect = event.target.getBoundingClientRect();
//     mousePosition.current = {
//       x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
//       y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
//     };
//   };
  

//   return (
//     <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
//       <Sidebar
//         setShowStars={setShowStars}
//         autoRotate={autoRotate}
//         setAutoRotate={setAutoRotate} // Control auto-rotation
//       />
//       <Canvas
//         camera={{
//           position: [500, 500, 500], // Initial camera position
//           fov: 50,
//           near: 1,
//           far: 10000,
//         }}
//         onPointerMove={handlePointerMove}
//       >
//         {showStars && (
//           <Stars
//             radius={300}
//             depth={250}
//             count={8000}
//             factor={10}
//             saturation={0}
//             fade={true}
//           />
//         )}
//         <ambientLight intensity={2.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />

//         {/* RaycasterHandler handles mouse interaction and coordinates */}
//         <RaycasterHandler setCoordinates={setCoordinates} autoRotate={autoRotate} />

//         <OrbitControls
//           enableZoom={true}
//           zoomSpeed={2.0}
//           rotateSpeed={1.2}
//           enablePan={true}
//         />
//       </Canvas>

//       {/* Display latitude, longitude, and horizontal resolution */}
//       <div
//         style={{
//           position: 'absolute',
//           bottom: '10px',
//           right: '10px',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           color: 'white',
//           padding: '10px',
//           borderRadius: '8px',
//         }}
//       >
//         <p>Latitude: {coordinates.latitude}°</p>
//         <p>Longitude: {coordinates.longitude}°</p>
//       </div>
//     </div>
//   );
// };

// export default MoonLayer;

// MoonLayer.js
import React, { useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import Sidebar from './sidebar';
import MoonTexture from './tifftextureloader'; // Import the MoonTexture component
import './moonlayer.css';
import * as THREE from 'three';

const MoonModel = React.forwardRef(({ scale, autoRotate }, ref) => {
  const { scene } = useGLTF('Moon_1_3474.glb');

  useFrame(() => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += 0.01; // Adjust rotation speed here
    }
  });

  return <primitive ref={ref} object={scene} scale={scale} />;
});

const RaycasterHandler = ({ setCoordinates, autoRotate }) => {
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

  return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]} autoRotate={autoRotate} />;
};

const MoonLayer = () => {
  const [showStars, setShowStars] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [showTexture, setShowTexture] = useState(false); // State to control texture visibility
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
      <Sidebar
        setShowStars={setShowStars}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        setShowTexture={setShowTexture} // Pass setter for texture visibility
      />
      <Canvas
        camera={{
          position: [500, 500, 500],
          fov: 50,
          near: 1,
          far: 10000,
        }}
        onPointerMove={handlePointerMove}
      >
        {showStars && (
          <Stars
            radius={300}
            depth={250}
            count={8000}
            factor={10}
            saturation={0}
            fade={true}
          />
        )}
        <ambientLight intensity={2.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <RaycasterHandler setCoordinates={setCoordinates} autoRotate={autoRotate} />
        <MoonTexture visible={showTexture} /> {/* Render MoonTexture component */}

        <OrbitControls
          enableZoom={true}
          zoomSpeed={2.0}
          rotateSpeed={1.2}
          enablePan={true}
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
};

export default MoonLayer;
