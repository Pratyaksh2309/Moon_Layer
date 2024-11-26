import React from 'react';
import "./App.css"
import Sidebar from './components/sidebar';
import MoonLayer from './components/moonlayer';

const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", width: "100%" }}>
        <MoonLayer/>

      </div>
    </div>
  );
};

export default App;
