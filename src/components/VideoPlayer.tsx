import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Film, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  customVideoUrl: string | null;
  onUploadVideo: (file: File) => void;
  aspectMode?: 'cover' | 'contain';
  isHeroBackground?: boolean;
  className?: string;
  showControlsOverlay?: boolean;
}

export function VideoPlayer({
  customVideoUrl,
  onUploadVideo,
  aspectMode = 'cover',
  isHeroBackground = false,
  className = '',
  showControlsOverlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // If no custom video URL is provided, run a futuristic BillKart POS Barcode & Particle Video Animation on canvas
  useEffect(() => {
    if (customVideoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for POS network
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#FF1E42', '#FF6A00', '#FFA000', '#FF4A6B'];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let scanY = 0;
    let scanDirection = 1;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Deep dark surface background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070709');
      bgGrad.addColorStop(0.5, '#140F18');
      bgGrad.addColorStop(1, '#070709');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic grid
      ctx.strokeStyle = 'rgba(255, 30, 66, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw futuristic curved POS ribbons
      const waveOffset = frame * 0.015;
      ctx.save();
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const startY = height * 0.35 + w * 45;
        ctx.moveTo(0, startY);
        for (let x = 0; x <= width; x += 20) {
          const cy =
            startY +
            Math.sin(x * 0.005 + waveOffset + w) * 35 +
            Math.cos(x * 0.008 - waveOffset) * 20;
          ctx.lineTo(x, cy);
        }
        ctx.strokeStyle =
          w === 0
            ? 'rgba(184, 245, 0, 0.25)'
            : w === 1
            ? 'rgba(25, 214, 107, 0.28)'
            : 'rgba(87, 227, 155, 0.15)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();

      // Draw particle network
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(25, 214, 107, 0.12)';
            ctx.lineWidth = 1 - dist / 90;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Smart Barcode Laser Scanning Line
      scanY += scanDirection * 2.2;
      if (scanY > height * 0.75) scanDirection = -1;
      if (scanY < height * 0.2) scanDirection = 1;

      const laserGrad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12);
      laserGrad.addColorStop(0, 'rgba(255, 30, 66, 0)');
      laserGrad.addColorStop(0.5, 'rgba(255, 106, 0, 0.85)');
      laserGrad.addColorStop(1, 'rgba(255, 30, 66, 0)');

      ctx.fillStyle = laserGrad;
      ctx.fillRect(width * 0.1, scanY - 6, width * 0.8, 12);

      // Core bright laser beam
      ctx.beginPath();
      ctx.moveTo(width * 0.08, scanY);
      ctx.lineTo(width * 0.92, scanY);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#FF1E42';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [customVideoUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadVideo(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onUploadVideo(file);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      id="splash-video-container"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative overflow-hidden w-full h-full flex items-center justify-center ${className} ${
        isDragOver ? 'ring-2 ring-[#FF1E42] ring-offset-2 ring-offset-[#070709]' : ''
      }`}
    >
      {/* Hidden File Input for Custom Video Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Video element if custom URL is provided */}
      {customVideoUrl ? (
        <video
          ref={videoRef}
          src={customVideoUrl}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className={`w-full h-full transition-all duration-500 ${
            aspectMode === 'cover' ? 'object-cover' : 'object-contain'
          }`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        /* Built-in dynamic POS motion video simulation on Canvas */
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      )}

      {/* Atmospheric Dark Gradient Overlays for optimal text contrast and readability */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top Header Fade */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#070709] via-[#070709]/75 to-transparent" />
        
        {/* Bottom Loading Area Dark Vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#070709] via-[#070709]/85 to-transparent" />

        {/* Soft Radial Ambient Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,7,9,0.75)_95%)]" />
      </div>

      {/* Drag & Drop Feedback Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 bg-[#070709]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#FF1E42]">
          <Upload className="w-12 h-12 text-[#FF1E42] animate-bounce mb-3" />
          <p className="text-base font-bold text-white">Drop your custom video here</p>
          <p className="text-xs text-[#A09CA8] mt-1">Supports MP4, WebM, MOV</p>
        </div>
      )}

      {/* Floating Control Bar (Subtle & Non-intrusive) */}
      {showControlsOverlay && !isHeroBackground && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#140F18]/85 border border-white/10 backdrop-blur-md opacity-70 hover:opacity-100 transition-opacity">
          {customVideoUrl && (
            <>
              <button
                type="button"
                onClick={togglePlay}
                title={isPlaying ? 'Pause video' : 'Play video'}
                className="p-1.5 rounded-lg text-white hover:bg-[#1F1422] hover:text-[#FFA000] transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="p-1.5 rounded-lg text-white hover:bg-[#1F1422] hover:text-[#FFA000] transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload custom splash video"
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-[#FF4A6B] hover:text-[#FFA000] hover:bg-[#1F1422] transition-colors"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Video</span>
          </button>
        </div>
      )}
    </div>
  );
}
