import React, { useEffect, useState } from 'react';
import { useATC } from '../context/ATCContext';
import { Ship, Plane } from 'lucide-react';

const MapDisplay: React.FC = () => {
  const { currentStation } = useATC();
  const [mapUrl, setMapUrl] = useState('https://globe.adsbexchange.com/');
  const [showMarineTraffic, setShowMarineTraffic] = useState(false);

  useEffect(() => {
    if (currentStation && currentStation.lat && currentStation.lon) {
      if (showMarineTraffic) {
        setMapUrl(`https://www.marinetraffic.com/en/ais/embed/zoom:12/centery:${currentStation.lat}/centerx:${currentStation.lon}/maptype:4/shownames:true/mmsi:0/shipid:0/fleet:false/fleet_id:/vtypes:/showmenu:true/remember:false/showpositions:true/showship:true`);
      } else {
        setMapUrl(`https://globe.adsbexchange.com/?lat=${currentStation.lat}&lon=${currentStation.lon}&zoom=12&hideSidebar`);
      }
    }
  }, [currentStation, showMarineTraffic]);

  return (
    <div className="w-full h-screen relative">
      <iframe
        className="w-full h-full border-none"
        src={mapUrl}
        title={showMarineTraffic ? "MarineTraffic Map" : "ADS-B Exchange Map"}
        loading="lazy"
        allow="fullscreen"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
      
      <button
        onClick={() => setShowMarineTraffic(prev => !prev)}
        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200"
      >
        {showMarineTraffic ? (
          <>
            <Plane size={20} className="text-blue-400" />
            <span className="text-white">Show Air Traffic</span>
          </>
        ) : (
          <>
            <Ship size={20} className="text-blue-400" />
            <span className="text-white">Show Marine Traffic</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MapDisplay;