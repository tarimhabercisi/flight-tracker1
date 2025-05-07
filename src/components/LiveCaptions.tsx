import React, { useEffect, useState, useRef } from 'react';
import { useATC } from '../context/ATCContext';

const LiveCaptions: React.FC = () => {
  const { isPlaying, audioRef } = useATC();
  const [captions, setCaptions] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;

    try {
      // Initialize Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      // Handle results
      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          setCaptions(prev => {
            const newCaptions = [...prev, lastResult[0].transcript];
            return newCaptions.slice(-3); // Keep only last 3 captions
          });
        }
      };

      // Handle errors
      recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event.error);
      };

      // Start recognition
      recognitionRef.current.start();

    } catch (error) {
      console.error('Speech recognition not supported:', error);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setCaptions([]);
    };
  }, [isPlaying, audioRef]);

  if (!isPlaying || captions.length === 0) return null;

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-10 w-11/12 md:w-3/4 max-w-4xl">
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-4 shadow-lg border border-white/10">
        <div className="space-y-2">
          {captions.map((caption, index) => (
            <p 
              key={index} 
              className="text-white/90 text-center text-lg"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {caption}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCaptions;