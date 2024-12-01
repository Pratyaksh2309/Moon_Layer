    import React, { useEffect } from "react";
    import "ol/ol.css";
    import Map from "ol/Map";
    import View from "ol/View";
    import TileLayer from "ol/layer/Tile";
    import ImageLayer from "ol/layer/Image";
    import XYZ from "ol/source/XYZ";
    import GeoTIFF from "ol/source/GeoTIFF";
    import { fromLonLat } from "ol/proj";

    const GeoTiffLayer = ({ url, map }) => {
    useEffect(() => {
        const rasterLayer = new ImageLayer({
        source: new GeoTIFF({ sources: [{ url }] }),
        opacity: 0.9,
        });

        map.addLayer(rasterLayer);

        rasterLayer.getSource().on("ready", () => {
        const extent = rasterLayer.getSource().getExtent();
        map.getView().fit(extent, { duration: 1000 });
        });
    }, [url, map]);

    return null;
    };

    const App = () => {
    useEffect(() => {
        const map = new Map({
        target: "map",
        layers: [
            new TileLayer({
            source: new XYZ({
                url: "https://lroc-tiles.quickmap.io/tiles/wac_nac_nacroi/lunar-fulleqc/{z}/{x}/{y}.png",
            }),
            }),
        ],
        view: new View({
            center: fromLonLat([0, 90]),
            zoom: 2,
            minZoom: 0,
            maxZoom: 9,
        }),
        });

        // Attach the map object to the component for GeoTIFF use
        window.map = map;
    }, []);

    return (
        <div style={{ height: "100vh", width: "auto", padding: "1%" }}>
        <div id="map" style={{ height: "100%", width: "100%" }}></div>
        {window.map && <GeoTiffLayer url="/Al_Si_combined.tiff" map={window.map} />}
        </div>
    );
    };

    export default App;
