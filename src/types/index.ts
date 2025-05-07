export interface Station {
  id: string;
  code: string;
  name: string;
  streamUrl: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  name: string;
  description: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon?: string;
}