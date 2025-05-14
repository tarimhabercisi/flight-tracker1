import React, { useEffect, useState } from 'react';
import { useATC } from '../context/ATCContext';
import { Ship, Plane, Layers } from 'lucide-react';

const MapDisplay: React.FC = () => {
  const { currentStation } = useATC();
  const [mapUrl, setMapUrl] = useState('https://globe.adsbexchange.com/');
  const [showMarineTraffic, setShowMarineTraffic] = useState(false);
  const [airOpacity, setAirOpacity] = useState(1);
  const [marineOpacity, setMarineOpacity] = useState(1);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (currentStation && currentStation.lat && currentStation.lon) {
      if (showMarineTraffic) {
        setMapUrl(`https://www.marinetraffic.com/en/ais/embed/zoom:12/centery:${currentStation.lat}/centerx:${currentStation.lon}/maptype:2/shownames:true/mmsi:0/shipid:0/fleet:false/fleet_id:/vtypes:/showmenu:false/remember:false/showpositions:true/showship:true/showvrmtree:false/showmarinenotes:false/showgrid:false`);
      } else {
        setMapUrl(`https://globe.adsbexchange.com/?lat=${currentStation.lat}&lon=${currentStation.lon}&zoom=12&hideSidebar`);
      }
    }
  }, [currentStation, showMarineTraffic]);

  return (
    <div className="w-full h-screen relative">
      <div className="relative w-full h-full">
        {/* Air Traffic Layer */}
        <div className="absolute inset-0" style={{ opacity: airOpacity }}>
          <iframe
            className="w-full h-full border-none"
            src={showMarineTraffic ? '' : mapUrl}
            title="ADS-B Exchange Map"
            loading="lazy"
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Marine Traffic Layer */}
        <div className="absolute inset-0" style={{ opacity: marineOpacity }}>
          <iframe
            className="w-full h-full border-none"
            src={showMarineTraffic ? mapUrl : ''}
            title="MarineTraffic Map"
            loading="lazy"
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
      
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowControls(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200"
        >
          <Layers size={20} className="text-blue-400" />
          <span className="text-white">Layer Controls</span>
        </button>

        {showControls && (
          <div className="p-4 bg-black/70 backdrop-blur-md rounded-lg border border-white/20">
            <div className="space-y-4">
              {/* Air Traffic Control */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Plane size={16} className="text-blue-400" />
                  <span className="text-white text-sm">Air Traffic</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={airOpacity}
                  onChange={(e) => setAirOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Marine Traffic Control */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Ship size={16} className="text-blue-400" />
                  <span className="text-white text-sm">Marine Traffic</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={marineOpacity}
                  onChange={(e) => setMarineOpacity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;