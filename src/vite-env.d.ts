/// <reference types="vite/client" />

interface Window {
  webkitSpeechRecognition: any;
}

interface SpeechRecognitionError extends Event {
  error: string;
}