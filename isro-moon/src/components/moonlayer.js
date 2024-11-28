import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import Sidebar from './sidebar';
import * as THREE from 'three';
import './moonlayer.css';

const MoonModel = React.forwardRef(({ scale, overlayUrl, siliconOverlayUrl, visible, siliconVisible }, ref) => {
  const { scene } = useGLTF('Moon_1_3474.glb'); // Load your Moon model
//  const { scene } = useGLTF('moon_model_2.glb'); // Load your Moon model
  const [overlayTexture, setOverlayTexture] = useState(null);
  const [siliconTexture, setSiliconTexture] = useState(null);
  const overlayMesh = useRef();
  const siliconMesh = useRef();

  // Load the overlay texture (Al layer)
  useEffect(() => {
    if (overlayUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(overlayUrl, (loadedTexture) => {
        setOverlayTexture(loadedTexture);
      });
    }
  }, [overlayUrl]);

  // Load the silicon overlay texture
  useEffect(() => {
    if (siliconOverlayUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(siliconOverlayUrl, (loadedTexture) => {
        setSiliconTexture(loadedTexture);
      });
    }
  }, [siliconOverlayUrl]);

  return (
    <>
      {/* Moon Base Model */}
      <primitive ref={ref} object={scene} scale={scale} />

      {/* Overlay Sphere for Aluminum Layer */}
      {visible && overlayTexture && (
        <mesh
          ref={overlayMesh}
          scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]} // Slightly larger than base Moon model
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={overlayTexture}
            transparent={true}
            opacity={0.85} // Adjust opacity for blending
            depthWrite={false} // Prevent z-fighting between overlay and model
            blending={THREE.MultiplyBlending}
          />
        </mesh>
      )}

      {/* Overlay Sphere for Silicon Layer */}
      {siliconVisible && siliconTexture && (
        <mesh
          ref={siliconMesh}
          scale={[scale[0] * 505.5, scale[1] * 505.5, scale[2] * 505.5]} // Slightly larger than Aluminum overlay
        >
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={siliconTexture}
            transparent={true}
            opacity={0.95} // Adjust opacity for blending
            depthWrite={false}
            blending={THREE.MultiplyBlending} // Different blending for distinction
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
        setCoordinates({ latitude: null, longitude: null });
      }
    }
  });

  return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]} />;
};

const MoonLayer = () => {
  const [showStars, setShowStars] = useState(true);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [showAlTexture, setShowAlTexture] = useState(false); // Manage Aluminum layer visibility
  const [showSiTexture, setShowSiTexture] = useState(false); // Manage Silicon layer visibility
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
        setShowAlTexture={setShowAlTexture} // Pass setter for Aluminum texture visibility
        setShowSiTexture={setShowSiTexture} // Pass setter for Silicon texture visibility
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
          <Stars radius={300} depth={250} count={8000} factor={10} saturation={0} fade={true} />
        )}
        <ambientLight intensity={2.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* RaycasterHandler handles moon interaction */}
        <RaycasterHandler setCoordinates={setCoordinates} />

        {/* Show MoonModel with both Aluminum and Silicon overlays */}
        <MoonModel
          scale={[0.5, 0.5, 0.5]}
          overlayUrl={showAlTexture ? 'pop.png' : ''} // Aluminum layer texture
          siliconOverlayUrl={showSiTexture ? 'pkj.png' : ''} // Silicon layer texture
          visible={showAlTexture}
          siliconVisible={showSiTexture}
        />

        <OrbitControls
          enableZoom={true}
          zoomSpeed={2.0}
          rotateSpeed={1.2}
          enablePan={true}
          minDistance={280} // Minimum distance for zoom
          maxDistance={2000} // Maximum distance for zoom
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


// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
// import Sidebar from './sidebar';
// import * as THREE from 'three';
// import './moonlayer.css';

// const MoonModel = React.forwardRef(({ scale, overlayUrl, visible }, ref) => {
//   const { scene } = useGLTF('Moon_1_3474.glb');  // Load your Moon model
//   const [overlayTexture, setOverlayTexture] = useState(null);
//   const overlayMesh = useRef();

//   // Load the overlay texture (heatmap, etc.)
//   useEffect(() => {
//     if (overlayUrl) {
//       const loader = new THREE.TextureLoader();
//       loader.load(overlayUrl, (loadedTexture) => {
//         setOverlayTexture(loadedTexture);
//       });
//     }
//   }, [overlayUrl]);


//   return (
//     <>
//       {/* Moon Base Model */}
//       <primitive ref={ref} object={scene} scale={scale} />

//       {/* Overlay Sphere for Heatmap */}
//       {visible && overlayTexture && (
//         <mesh
//           ref={overlayMesh}
//           scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]} // Slightly larger than base Moon model
//         >
//           <sphereGeometry args={[1, 64, 64]} />
//           <meshStandardMaterial
//             map={overlayTexture}
//             transparent={true}
//             opacity={0.95} // Adjust opacity for blending
//             depthWrite={false} // Prevent z-fighting between overlay and model
//             blending={THREE.MultiplyBlending}
//           />
//         </mesh>
//       )}
//     </>
//   );
// });

// const RaycasterHandler = ({ setCoordinates }) => {
//   const { camera, mouse } = useThree();
//   const moonRef = useRef();
//   const raycaster = useRef(new THREE.Raycaster());

//   useFrame(() => {
//     if (moonRef.current) {
//       raycaster.current.setFromCamera(mouse, camera);
//       const intersects = raycaster.current.intersectObject(moonRef.current, true);

//       if (intersects.length > 0) {
//         const point = intersects[0].point;

//         const sphereCoords = new THREE.Spherical();
//         sphereCoords.setFromVector3(point);

//         const latitude = (90 - (sphereCoords.phi * 180) / Math.PI).toFixed(2);
//         const longitude = ((sphereCoords.theta * 180) / Math.PI - 180).toFixed(2);

//         setCoordinates({ latitude, longitude });
//       } else {
//         setCoordinates({ latitude: 0, longitude: 0 });
//       }
//     }
//   });

//   return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]}/>;
// };

// const MoonLayer = () => {
//   const [showStars, setShowStars] = useState(true);
//   const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
//   const [showTexture, setShowTexture] = useState(false); // Manage texture visibility
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
//         setShowTexture={setShowTexture} // Pass setter for texture visibility
//       />
//       <Canvas
//         camera={{
//           position: [500, 500, 500],
//           fov: 50,
//           near: 1,
//           far: 10000,
//         }}
//         onPointerMove={handlePointerMove}
//       >
//         {showStars && (
//           <Stars radius={300} depth={250} count={8000} factor={10} saturation={0} fade={true} />
//         )}
//         <ambientLight intensity={2.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />

//         {/* RaycasterHandler handles moon interaction */}
//         <RaycasterHandler setCoordinates={setCoordinates} />

//         {/* Show MoonTexture only if showTexture is true */}
//         <MoonModel
//           scale={[0.5, 0.5, 0.5]}
//           overlayUrl={showTexture ? "pkj.png" : ""} // Load texture only when showTexture is true
//           visible={showTexture}
//         />

//         <OrbitControls
//           enableZoom={true}
//           zoomSpeed={2.0}
//           rotateSpeed={1.2}
//           enablePan={true}
//           minDistance={280} // Minimum distance for zoom
//           maxDistance={2000} // Maximum distance for zoom
//         />
//       </Canvas>

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