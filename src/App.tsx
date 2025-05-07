import React from 'react';
import MapDisplay from './components/MapDisplay';
import ATCControls from './components/ATCControls';
import WeatherInfo from './components/WeatherInfo';
import LiveCaptions from './components/LiveCaptions';
import { ATCProvider } from './context/ATCContext';

function App() {
  return (
    <ATCProvider>
      <div className="relative min-h-screen bg-black text-white">
        <MapDisplay />
        <ATCControls />
        <LiveCaptions />
        <WeatherInfo />
      </div>
    </ATCProvider>
  );
}

export default App;