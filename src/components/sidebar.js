import React from "react";
import "./sidebar.css";

const Sidebar = ({
  viewMode,
  setViewMode,
  selectedElement1,
  setSelectedElement1,
  selectedElement2,
  setSelectedElement2,
}) => {
  const elements = ["Al", "Si", "Element 3", "Element 4", "Element 5", "Element 6"];

  return (
    <div className="sidebar">
      <h3>Settings</h3>
      <ul>
        {/* Toggle View Mode */}
        <li>
          <h4>View Mode</h4>
          <label>
            <input
              type="radio"
              name="viewMode"
              value="2D"
              checked={viewMode === "2D"}
              onChange={() => setViewMode("2D")}
            />
            2D
          </label>
          <label>
            <input
              type="radio"
              name="viewMode"
              value="3D"
              checked={viewMode === "3D"}
              onChange={() => setViewMode("3D")}
            />
            3D
          </label>
        </li>

        {/* Dropdown for Element 1 Selection */}
        <li>
          <h4>Select Element 1</h4>
          <select
            value={selectedElement1}
            onChange={(e) => setSelectedElement1(e.target.value)}
          >
            {elements.map((element, index) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
          </select>
        </li>

        {/* Dropdown for Element 2 Selection */}
        <li>
          <h4>Select Element 2</h4>
          <select
            value={selectedElement2}
            onChange={(e) => setSelectedElement2(e.target.value)}
          >
            {elements.map((element, index) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
