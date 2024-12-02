import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
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

            // Locally saved XYZ tile layer
            const localTileLayer = new TileLayer({
                source: new XYZ({
                    url: "/New Folder/test/{z}/{x}/{y}.png", // Path to the locally saved XYZ tiles
                    tileSize: 256, // Default tile size for XYZ,
                    projection: "EPSG:3857", // Match the projection of your tiles
                }),
                opacity: 0.8, // Adjust opacity if needed
                center: [50, 20]
            });

            // Initialize map with base and overlay layers
            mapRef.current = new Map({
                target: "map",
                layers: [moonLayer, localTileLayer],
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
