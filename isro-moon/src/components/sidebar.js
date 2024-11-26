import React from 'react';
import './sidebar.css'; // Create CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
