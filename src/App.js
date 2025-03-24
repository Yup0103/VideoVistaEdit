import React from 'react';
import Sidebar from './components/Sidebar';
import ConfigPanel from './components/ConfigPanel';
import VideoPreview from './components/VideoPreview';
import './App.css';

function App() {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <ConfigPanel />
        <VideoPreview />
      </div>
    </div>
  );
}

export default App; 