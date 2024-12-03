import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat } from "ol/proj";
import "./Demo.css";

const Demo = ({ selectedElement1, selectedElement2 }) => {
  const mapRef = useRef(null);
  const [imageLayers, setImageLayers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map with a base moonLayer
      const moonLayer = new TileLayer({
        source: new XYZ({
          url: "https://lroc-tiles.quickmap.io/tiles/wac_nac_nacroi/lunar-fulleqc/{z}/{x}/{y}.png",
        }),
      });

      mapRef.current = new Map({
        target: "map",
        layers: [moonLayer],
        view: new View({
          center: fromLonLat([0, 80]),
          zoom: 3,
          minZoom: 0,
          maxZoom: 9,
        }),
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // Remove existing image layers
      imageLayers.forEach((layer) => mapRef.current.removeLayer(layer));

      // Generate new image layers based on selected elements
      const baseExtent = [-180, 0, 180, 120];
      const imageWidth = baseExtent[2] - baseExtent[0];
      const repeatedExtents = [];
      for (let i = -4; i <= 4; i++) {
        const offset = i * imageWidth;
        repeatedExtents.push([
          baseExtent[0] + offset,
          baseExtent[1],
          baseExtent[2] + offset,
          baseExtent[3],
        ]);
      }

      // Determine the texture URL based on the selected elements
      const textureUrl = `./${selectedElement1}_${selectedElement2}.png` || "";

      const newImageLayers = repeatedExtents.map((extent) => {
        return new ImageLayer({
          source: new ImageStatic({
            url: textureUrl, // Use the selected texture
            projection: "EPSG:4326",
            imageExtent: extent,
          }),
          opacity: 0.5,
        });
      });

      // Add new layers to the map
      newImageLayers.forEach((layer) => mapRef.current.addLayer(layer));
      setImageLayers(newImageLayers);
    }
  }, [selectedElement1, selectedElement2]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* Map Container */}
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default Demo;
