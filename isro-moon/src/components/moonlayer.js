import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';
import "./moonlayer.css";

const MoonLayer = () => {
  const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load the textures (Moon texture + Displacement map)
  const moonTexture = useLoader(TextureLoader, 'p.jpg', () => {
    setIsLoading(false); // Set loading to false when texture is loaded
  });
  const displacementMap = useLoader(TextureLoader, 'd.jpg'); // Displacement map

  // Adjust how the displacement map affects the geometry
  displacementMap.wrapS = displacementMap.wrapT = RepeatWrapping;

  const calculateLatLong = (cameraPosition) => {
    const radius = Math.sqrt(
      cameraPosition.x ** 2 + cameraPosition.y ** 2 + cameraPosition.z ** 2
    );
    const latitude = (Math.asin(cameraPosition.y / radius) * 180) / Math.PI;
    const longitude =
      (Math.atan2(cameraPosition.z, cameraPosition.x) * 180) / Math.PI;
    return {
      latitude: latitude.toFixed(2),
      longitude: longitude.toFixed(2),
    };
  };

  const HandleControls = () => {
    const { camera } = useThree();
    return (
      <OrbitControls
        enableZoom={true}
        onChange={() => {
          const { x, y, z } = camera.position;
          setCoordinates(calculateLatLong({ x, y, z }));
        }}
      />
    );
  };

 

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <Canvas>
        <Stars
          radius={300}
          depth={60}
          count={5000}
          factor={7}
          saturation={0}
          fade={true}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
          {/* Apply displacement map with additional properties */}
          <meshStandardMaterial
            map={moonTexture} // Diffuse map (color)
            displacementMap={displacementMap} // Displacement map
            displacementScale={0.1} // Adjust displacement intensity
            roughness={1}
            metalness={0.1}
          />
        </Sphere>
        <HandleControls />
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

// import React, { useState, useEffect } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { OrbitControls, Sphere, Stars } from '@react-three/drei';
// import { RepeatWrapping } from 'three';
// import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader'; // Import TIFFLoader
// import "./moonlayer.css";

// const MoonLayer = () => {
//   const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
//   const [moonTexture, setMoonTexture] = useState(null);
//   const [displacementMap, setDisplacementMap] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load the TIFF textures manually
//   useEffect(() => {
//     const loader = new TIFFLoader();

//     // Asynchronously load the texture and displacement map
//     const loadTextures = async () => {
//       try {
//         const moonTex = await loader.loadAsync('p.jpg'); // Update with your file path
//         const displacementTex = await loader.loadAsync('d.jpg'); // Update with your file path

//         // Apply RepeatWrapping to displacement map
//         displacementTex.wrapS = RepeatWrapping;
//         displacementTex.wrapT = RepeatWrapping;

//         setMoonTexture(moonTex);
//         setDisplacementMap(displacementTex);
//         setIsLoading(false); // Set loading to false when done
//       } catch (error) {
//         console.error("Error loading textures:", error);
//         setIsLoading(false); // Prevent infinite loading state
//       }
//     };

//     loadTextures();
//   }, []);

//   // Calculate latitude and longitude
//   const calculateLatLong = (cameraPosition) => {
//     const radius = Math.sqrt(
//       cameraPosition.x ** 2 + cameraPosition.y ** 2 + cameraPosition.z ** 2
//     );
//     const latitude = (Math.asin(cameraPosition.y / radius) * 180) / Math.PI;
//     const longitude =
//       (Math.atan2(cameraPosition.z, cameraPosition.x) * 180) / Math.PI;
//     return {
//       latitude: latitude.toFixed(2),
//       longitude: longitude.toFixed(2),
//     };
//   };

//   const HandleControls = React.memo(() => {
//     const { camera } = useThree();
//     return (
//       <OrbitControls
//         enableZoom={true}
//         maxPolarAngle={Math.PI} // Allow full 360-degree view
//         minPolarAngle={0}
//         onChange={() => {
//           const { x, y, z } = camera.position;
//           setCoordinates(calculateLatLong({ x, y, z }));
//         }}
//       />
//     );
//   });

//   return (
//     <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
//       <Canvas>
//         <Stars
//           radius={300}
//           depth={60}
//           count={5000}
//           factor={7}
//           saturation={0}
//           fade={true}
//         />
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
//           {/* Apply displacement map with additional properties */}
//           <meshStandardMaterial
//             map={moonTexture} // Diffuse map (color)
//             displacementMap={displacementMap} // Displacement map
//             displacementScale={0.1} // Adjust displacement intensity
//             roughness={1}
//             metalness={0.1}
//           />
//         </Sphere>
//         <HandleControls />
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
