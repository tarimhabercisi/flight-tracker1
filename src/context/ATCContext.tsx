import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { Station } from '../types';
import { stations } from '../data/stations';

interface WeatherData {
  name: string;
  description: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface ATCContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  setCurrentStation: (station: Station) => void;
  playATC: () => void;
  stopATC: () => void;
  adjustVolume: (amount: number) => void;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
}

const ATCContext = createContext<ATCContextType | undefined>(undefined);

export const ATCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const playATC = () => {
    if (!currentStation) return;
    
    if (audioRef.current) {
      audioRef.current.src = currentStation.streamUrl;
      audioRef.current.volume = volume;
      
      audioRef.current.play().catch(err => {
        console.error("Error playing audio: ", err);
        setError("Unable to play the selected stream.");
      });
      
      setIsPlaying(true);
    }
  };
  
  const stopATC = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const adjustVolume = (amount: number) => {
    setVolume(prev => {
      const newVolume = Math.min(1, Math.max(0, prev + amount));
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      return newVolume;
    });
  };
  
  const fetchWeather = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiKey = '62bc64d515f8934e1a20f8c23268df81'; // OpenWeatherMap API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Weather data not available');
      
      const data = await response.json();
      
      setWeatherData({
        name: data.name,
        description: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
      });
    } catch (error) {
      console.error(error);
      setError('Unable to fetch weather data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentStation && currentStation.lat && currentStation.lon) {
      fetchWeather(currentStation.lat, currentStation.lon);
    }
  }, [currentStation]);
  
  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  return (
    <ATCContext.Provider value={{
      currentStation,
      isPlaying,
      volume,
      weatherData,
      isLoading,
      error,
      audioRef,
      setCurrentStation,
      playATC,
      stopATC,
      adjustVolume,
      fetchWeather
    }}>
      <audio ref={audioRef} />
      {children}
    </ATCContext.Provider>
  );
};

export const useATC = () => {
  const context = useContext(ATCContext);
  if (context === undefined) {
    throw new Error('useATC must be used within an ATCProvider');
  }
  return context;
};