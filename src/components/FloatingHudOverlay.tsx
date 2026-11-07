import React, { useState } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import { Zap, X, Move, Flower2 } from 'lucide-react';

export const FloatingHudOverlay: React.FC = () => {
  const { stats, showOverlayHud, setShowOverlayHud, selectedEmulator } = useBooster();
  const [position, setPosition] = useState({ x: 20, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  if (!showOverlayHud) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 240, e.clientX - dragOffset.x)),
      y: Math.max(10, Math.min(window.innerHeight - 160, e.clientY - dragOffset.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-40 select-none shadow-[0_8px_32px_rgba(244,63,94,0.35)] rounded-xl overflow-hidden border border-pink-500/50 bg-[#180a16f2] backdrop-blur-md text-xs font-mono w-60 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Draggable Titlebar in Cherry Blossom */}
      <div
        onMouseDown={handleMouseDown}
        className="px-3 py-1.5 bg-[#251022] border-b border-pink-900/60 flex items-center justify-between cursor-move"
      >
        <div className="flex items-center gap-1.5 text-pink-300 font-extrabold text-[10px] tracking-wider uppercase">
          <Flower2 className="w-3 h-3 text-pink-400" />
          <span>NEVERDIE · {selectedEmulator.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Move className="w-2.5 h-2.5 text-pink-400/60" />
          <button
            onClick={() => setShowOverlayHud(false)}
            className="text-pink-300/60 hover:text-white p-0.5 cursor-pointer"
            title="Hide HUD"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="p-3 space-y-2">
        {/* Live FPS Display */}
        <div className="flex items-baseline justify-between border-b border-pink-900/60 pb-1.5">
          <span className="text-[10px] font-bold text-pink-400/80 uppercase tracking-widest">
            IN-GAME FPS
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#ff75a0] tabular-nums tracking-tight drop-shadow-[0_0_8px_rgba(255,117,160,0.5)]">
              {stats.fps}
            </span>
            <span className="text-[10px] text-pink-300/60 font-bold">FPS</span>
          </div>
        </div>

        {/* Frame Time & Latency */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
          <div>
            <span className="text-[9px] text-pink-400/80 block uppercase">FRAME TIME</span>
            <span className="font-bold text-pink-100 tabular-nums">
              {(1000 / stats.fps).toFixed(1)} ms
            </span>
          </div>
          <div>
            <span className="text-[9px] text-pink-400/80 block uppercase">NET PING</span>
            <span className="font-bold text-[#ff75a0] tabular-nums">
              18 ms
            </span>
          </div>
        </div>

        {/* Hardware Thermals */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-pink-900/60">
          <div className="flex items-center gap-1">
            <span className="text-pink-400 font-bold">CPU:</span>
            <span className="font-bold text-pink-100">{stats.cpuTemp}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-pink-300/80 font-bold">GPU:</span>
            <span className="font-bold text-pink-100">{stats.gpuTemp}°C</span>
          </div>
        </div>

        {/* Owner Tag in ALL CAPS */}
        <div className="pt-1.5 border-t border-pink-900/60 flex items-center justify-between text-[9px] text-pink-300/70">
          <span className="text-pink-300 font-bold">OWNER: ARUNNVRDIE</span>
          <span className="text-pink-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
            100% FOCUS
          </span>
        </div>
      </div>
    </div>
  );
};
