  import React, { useEffect, useState } from "react";
  import Sidebar from "./components/sidebar"; // Import Sidebar
  import Demo from "./components/2d/Demo"; // Import 2D Component
  import MoonLayer from "./components/3d/moonlayer"; // Import 3D Component
  import "./App.css";


  const App = () => {
    const [viewMode, setViewMode] = useState("3D"); // Default view mode
    const [selectedElement1, setSelectedElement1] = useState("Al"); // Default element for dropdown 1
    const [selectedElement2, setSelectedElement2] = useState("Al"); // Default element for dropdown 2


    return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedElement1={selectedElement1}
          setSelectedElement1={setSelectedElement1}
          selectedElement2={selectedElement2}
          setSelectedElement2={setSelectedElement2}
        />
        

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {viewMode === "2D" ? (
            <Demo selectedElement1={selectedElement1} selectedElement2={selectedElement2} />
          ) : (
            <MoonLayer viewMode={viewMode}  selectedElement1={selectedElement1} selectedElement2={selectedElement2} />
          )}
        </div>
      </div>
    );
  };

  export default App;
