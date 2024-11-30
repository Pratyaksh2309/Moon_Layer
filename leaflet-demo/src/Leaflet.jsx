    import React, { useEffect } from "react";
    import { MapContainer, TileLayer, useMap } from "react-leaflet";
    import "leaflet/dist/leaflet.css";
    import GeoRasterLayer from "georaster-layer-for-leaflet";
    import georaster from "georaster";

    const GeoTiffLayer = ({ url }) => {
    const map = useMap();

    useEffect(() => {
        const loadGeoRaster = async () => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const raster = await georaster(arrayBuffer);

        const layer = new GeoRasterLayer({
            georaster: raster,
            opacity:0.1,
            resolution: 256,     
        });

        map.addLayer(layer);
        map.fitBounds(layer.getBounds());
        };

        loadGeoRaster();
    }, [url, map]);

    return null;
    };

    const App = () => {
    return (
        <div style={{ height: "100vh", width: "auto", padding: '1%' }}>
        <MapContainer
            center={[60, 0]}
            zoom={2}
            minZoom={1}
            maxZoom={9}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://lroc-tiles.quickmap.io/tiles/wac_nac_nacroi/lunar-fulleqc/{z}/{x}/{y}.png" tms={false} />
            <GeoTiffLayer url="/Al_Si_combined.tiff" />
        </MapContainer>
        </div>
    );
    };

    export default App;
