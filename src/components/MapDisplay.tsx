import React, { useEffect, useState } from 'react';
import { useATC } from '../context/ATCContext';

const MapDisplay: React.FC = () => {
  const { currentStation } = useATC();
  const [mapUrl, setMapUrl] = useState('https://globe.adsbexchange.com/');

  useEffect(() => {
    if (currentStation && currentStation.lat && currentStation.lon) {
      setMapUrl(`https://globe.adsbexchange.com/?lat=${currentStation.lat}&lon=${currentStation.lon}&zoom=12`);
    }
  }, [currentStation]);

  return (
    <div className="w-full h-screen relative">
      <iframe
        className="w-full h-full border-none"
        src={mapUrl}
        title="ADS-B Exchange Map"
        loading="lazy"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
    </div>
  );
};

export default MapDisplay;