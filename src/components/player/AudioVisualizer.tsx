import React, { useEffect, useRef } from 'react';
import { audioPlayer } from '../../services/audioPlayer';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  className = 'w-full h-12',
  barCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = audioPlayer.getVisualizerData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barCount) - 2;
      const step = Math.floor(data.length / barCount) || 1;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? (data[i * step] || 15) : 8;
        const normalized = val / 255;
        const barHeight = Math.max(3, normalized * height);

        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gradient from violet to cyan
        const grad = ctx.createLinearGradient(0, y, 0, height);
        grad.addColorStop(0, '#c084fc'); // purple-400
        grad.addColorStop(0.5, '#ec4899'); // pink-500
        grad.addColorStop(1, '#06b6d4'); // cyan-500

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={48}
      className={`${className} block`}
    />
  );
};
