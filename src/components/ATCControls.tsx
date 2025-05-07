import React, { useCallback, useState, useEffect } from 'react';
import { Play, Square, Volume1, Volume2, Headphones } from 'lucide-react';
import { useATC } from '../context/ATCContext';
import { Station } from '../types';
import { stations } from '../data/stations';
import AudioVisualizer from './AudioVisualizer';

const ATCControls: React.FC = () => {
  const { 
    currentStation, 
    isPlaying, 
    volume,
    setCurrentStation, 
    playATC, 
    stopATC, 
    adjustVolume,
    audioRef
  } = useATC();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStation = stations.find(station => station.id === e.target.value);
    if (selectedStation) {
      setCurrentStation(selectedStation);
      
      // If already playing, automatically play the new station
      if (isPlaying) {
        setTimeout(() => playATC(), 100);
      }
    }
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };
  
  // Handle keyboard shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      isPlaying ? stopATC() : playATC();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustVolume(0.1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustVolume(-0.1);
    }
  }, [isPlaying, playATC, stopATC, adjustVolume]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
  
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-11/12 md:w-auto'
    }`}>
      <div className="backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
        <div className="flex items-center gap-3">
          <button
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/50 hover:bg-blue-700/50 transition-colors"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand controls" : "Collapse controls"}
          >
            <Headphones size={16} />
          </button>
          
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={isPlaying ? stopATC : playATC}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isPlaying 
                      ? 'bg-red-600/50 hover:bg-red-700/50' 
                      : 'bg-green-600/50 hover:bg-green-700/50'
                  } transition-colors`}
                  aria-label={isPlaying ? "Stop" : "Play"}
                >
                  {isPlaying ? <Square size={18} /> : <Play size={18} className="ml-1" />}
                </button>
                
                <button
                  onClick={() => adjustVolume(-0.1)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                  aria-label="Volume down"
                >
                  <Volume1 size={16} />
                </button>
                
                <button
                  onClick={() => adjustVolume(0.1)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                  aria-label="Volume up"
                >
                  <Volume2 size={16} />
                </button>
                
                <div className="h-2 w-16 bg-gray-700/50 rounded-full overflow-hidden ml-1">
                  <div 
                    className="h-full bg-blue-500/50 transition-all duration-300"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <select
                  id="atc-stream"
                  value={currentStation?.id || ''}
                  onChange={handleStationChange}
                  className="w-full bg-gray-800/50 border border-gray-700/50 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select an ATC Stream</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.code} - {station.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {isPlaying && audioRef.current && (
                <div className="hidden md:block w-40 h-12">
                  <AudioVisualizer audioRef={audioRef} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATCControls;