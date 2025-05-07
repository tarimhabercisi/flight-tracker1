import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    
    if (!canvasContext) return;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        const gradient = canvasContext.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(0.5, '#14B8A6');
        gradient.addColorStop(1, '#60A5FA');
        
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioRef]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full rounded"
      width={160}
      height={40}
    />
  );
};

export default AudioVisualizer;