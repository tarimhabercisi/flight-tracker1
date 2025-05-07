import React from 'react';
import { Cloud, Wind, Thermometer, Droplet } from 'lucide-react';
import { useATC } from '../context/ATCContext';

const WeatherInfo: React.FC = () => {
  const { weatherData, isLoading, error, currentStation } = useATC();

  if (!currentStation) return null;
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-11/12 md:w-80">
      <div className="backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 transition-all duration-300">
        <h2 className="text-xl font-bold text-center mb-2">
          {currentStation.code} - {currentStation.name}
        </h2>
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 py-2">{error}</div>
        )}
        
        {weatherData && !isLoading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-300/90">
                <Cloud className="mr-2" size={20} />
                <span className="capitalize">{weatherData.description}</span>
              </div>
              {weatherData.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
                  alt={weatherData.description}
                  className="h-12 w-12"
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-amber-300/90">
                <Thermometer className="mr-2" size={18} />
                <span>{weatherData.temp.toFixed(1)}°C</span>
              </div>
              
              <div className="flex items-center text-teal-300/90">
                <Droplet className="mr-2" size={18} />
                <span>{weatherData.humidity}%</span>
              </div>
              
              <div className="flex items-center text-gray-300/90">
                <Wind className="mr-2" size={18} />
                <span>{weatherData.windSpeed} m/s</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400/90 mt-2 text-center">
              Wind conditions may affect audio quality
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherInfo;