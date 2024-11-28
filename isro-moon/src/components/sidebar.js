import React from 'react';
import './sidebar.css';

const Sidebar = ({ setShowStars, setShowAlTexture, 
  setShowSiTexture,autoRotate, setAutoRotate, setShowTexture }) => {
  return (
    <div className="sidebar">
      <h3>Settings</h3>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              defaultChecked
              onChange={(e) => setShowStars(e.target.checked)}
            />
            Show Stars
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setShowAlTexture(e.target.checked)} // Toggle texture
            />
            Al Ratio
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setShowSiTexture(e.target.checked)} // Toggle texture
            />
            SI Ratio
          </label>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
