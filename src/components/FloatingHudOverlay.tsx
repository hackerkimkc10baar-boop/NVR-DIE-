import React, { useState, useEffect, useRef } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import { X, Move, Flower2, Maximize2, Minimize2 } from 'lucide-react';

export const FloatingHudOverlay: React.FC = () => {
  const { stats, internalFps, externalFps, showOverlayHud, setShowOverlayHud, selectedEmulator } = useBooster();
  const [position, setPosition] = useState({ x: 24, y: 72 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    isDragging: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 24,
    initialY: 72,
    isDragging: false,
  });

  const positionRef = useRef(position);
  positionRef.current = position;

  // Window-level smooth dragging with pointer events & requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const nextX = Math.max(8, Math.min(window.innerWidth - 270, dragRef.current.initialX + deltaX));
      const nextY = Math.max(8, Math.min(window.innerHeight - 120, dragRef.current.initialY + deltaY));

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: nextX, y: nextY });
      });
    };

    const handlePointerUp = () => {
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false;
        setIsDragging(false);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!showOverlayHud) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Don't drag if clicking buttons inside the header
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y,
      isDragging: true,
    };
    setIsDragging(true);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
  };

  const snapToCorner = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const margin = 20;
    const width = 260;
    const height = 180;
    switch (corner) {
      case 'top-left':
        setPosition({ x: margin, y: margin + 40 });
        break;
      case 'top-right':
        setPosition({ x: window.innerWidth - width - margin, y: margin + 40 });
        break;
      case 'bottom-left':
        setPosition({ x: margin, y: window.innerHeight - height - margin });
        break;
      case 'bottom-right':
        setPosition({ x: window.innerWidth - width - margin, y: window.innerHeight - height - margin });
        break;
    }
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out, box-shadow 0.2s ease',
        touchAction: 'none',
      }}
      className={`fixed top-0 left-0 z-50 select-none rounded-xl overflow-hidden border border-pink-500/50 bg-[#160815f5] backdrop-blur-md text-xs font-mono w-64 ${
        isDragging
          ? 'shadow-[0_12px_45px_rgba(244,63,94,0.6)] border-pink-400 cursor-grabbing ring-1 ring-pink-400'
          : 'shadow-[0_8px_32px_rgba(244,63,94,0.35)] cursor-grab'
      }`}
    >
      {/* Draggable Titlebar - Click and drag anywhere here to move effortlessly */}
      <div
        onPointerDown={handlePointerDown}
        className={`px-3 py-2 bg-[#251022] border-b border-pink-900/60 flex items-center justify-between transition-colors ${
          isDragging ? 'bg-[#33152e]' : 'hover:bg-[#2c1328]'
        }`}
      >
        <div className="flex items-center gap-1.5 text-pink-300 font-extrabold text-[10px] tracking-wider uppercase pointer-events-none">
          <Flower2 className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>NEVERDIE · {selectedEmulator.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Corner Snap Helper */}
          <div className="flex items-center gap-0.5 text-[8px] text-pink-400/60">
            <button
              onClick={() => snapToCorner('top-left')}
              title="Snap Top-Left"
              className="p-0.5 hover:text-pink-200 cursor-pointer"
            >
              ◤
            </button>
            <button
              onClick={() => snapToCorner('top-right')}
              title="Snap Top-Right"
              className="p-0.5 hover:text-pink-200 cursor-pointer"
            >
              ◥
            </button>
          </div>

          {/* Minimize / Compact toggle */}
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="text-pink-300/70 hover:text-white p-0.5 cursor-pointer"
            title={isCompact ? 'Expand Details' : 'Compact HUD'}
          >
            {isCompact ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>

          {/* Drag Indicator */}
          <div
            title="Drag to move anywhere"
            className="text-pink-400 p-0.5 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <Move className="w-3 h-3 text-pink-300" />
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowOverlayHud(false)}
            className="text-pink-300/60 hover:text-white p-0.5 cursor-pointer"
            title="Hide HUD"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid with Dual FPS */}
      <div className="p-3 space-y-2">
        {/* Dual FPS Row */}
        <div className="grid grid-cols-2 gap-2 border-b border-pink-900/60 pb-2">
          <div>
            <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest block">
              INT FPS (FREE FIRE)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#ff75a0] tabular-nums tracking-tight drop-shadow-[0_0_8px_rgba(255,117,160,0.5)]">
                {internalFps}
              </span>
              <span className="text-[10px] text-pink-300/60 font-bold">FPS</span>
            </div>
          </div>

          <div className="border-l border-pink-900/60 pl-2">
            <span className="text-[9px] font-bold text-pink-200/90 uppercase tracking-widest block">
              EXT PC (MONITOR)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-pink-100 tabular-nums tracking-tight">
                {externalFps}
              </span>
              <span className="text-[10px] text-pink-300/60 font-bold">Hz</span>
            </div>
          </div>
        </div>

        {/* Extended Hardware Telemetry (Hidden in compact mode) */}
        {!isCompact && (
          <>
            {/* Frame Time & Latency */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
              <div>
                <span className="text-[9px] text-pink-400/80 block uppercase">FRAME TIME</span>
                <span className="font-bold text-pink-100 tabular-nums">
                  {(1000 / internalFps).toFixed(1)} ms
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
          </>
        )}

        {/* Owner Tag & Drag Helper */}
        <div className="pt-1.5 border-t border-pink-900/60 flex items-center justify-between text-[9px] text-pink-300/70">
          <span className="text-pink-300 font-bold uppercase">OWNER: ARUNNVRDIE</span>
          <span className="text-pink-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
            DRAG ANYWHERE
          </span>
        </div>
      </div>
    </div>
  );
};
