import React from 'react';
import './sidebar.css';

const Sidebar = ({ setShowStars, autoRotate, setAutoRotate }) => {
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
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
            />
            Auto Rotate Moon
          </label>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
