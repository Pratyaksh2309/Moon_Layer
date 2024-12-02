import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import { fromLonLat } from "ol/proj";

const App = () => {
    const mapRef = useRef(null); // Use a ref to store the map instance

    useEffect(() => {
        if (!mapRef.current) {
            // Moon base map layer
            const moonLayer = new TileLayer({
                source: new XYZ({
                    url: "https://lroc-tiles.quickmap.io/tiles/wac_nac_nacroi/lunar-fulleqc/{z}/{x}/{y}.png",
                }),
            });

            // ImageStatic layer for GeoTIFF overlay
            const imageLayer = new ImageLayer({
                source: new ImageStatic({
                    url: "./kop.png", // Path to TIFF image
                   // imageSize: [1106, 553], // Example size, adjust according to your TIFF image's resolution
                    projection: 'EPSG:4326', // Ensure the projection matches your TIFF file's projection
                     imageExtent: [0, 0, 360, 86], // World extent (longitude, latitude bounds of the image)
                }),
                opacity: 0.6, // Adjust opacity to control overlay transparency
            });

            // Initialize map with base and overlay layers
            mapRef.current = new Map({
                target: "map",
                layers: [moonLayer, imageLayer],
                view: new View({
                    center: fromLonLat([0, 80]),
                    zoom: 2,
                    minZoom: 0,
                    maxZoom: 9,
                }),
            });
        }
    }, []);

    return (
        <div style={{ height: "100vh", width: "auto" }}>
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
};

export default App;
