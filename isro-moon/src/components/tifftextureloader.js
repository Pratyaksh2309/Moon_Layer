import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { fromArrayBuffer } from 'geotiff';

const MoonTexture = ({ visible }) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loadTiff = async () => {
      try {
        const response = await fetch('output_AI_2022.tiff');
        const arrayBuffer = await response.arrayBuffer();

        // Use geotiff.js to decode the TIFF
        const tiff = await fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage(); // Get the first image
        const width = image.getWidth();
        const height = image.getHeight();
        const rgba = await image.readRasters({ interleave: true });

        // Create a texture from the decoded RGBA data
        const texture = new THREE.DataTexture(
          new Uint8Array(rgba),
          width,
          height,
          THREE.RGBAFormat
        );
        texture.needsUpdate = true;
        setTexture(texture);
      } catch (error) {
        console.error('Error loading TIFF file:', error);
      }
    };

    loadTiff();
  }, []);

  if (!texture || !visible) return null;

  return <meshStandardMaterial attach="material" map={texture} />;
};

export default MoonTexture;
