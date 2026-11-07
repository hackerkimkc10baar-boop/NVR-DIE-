import React, { useEffect, useRef } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import { Flame, Fan, Gauge, Activity, Cpu, Zap, Crown, Flower2 } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { stats, toggleGpuMax, toggleFanTurbo, setTargetFps, selectedEmulator } = useBooster();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live real-time canvas frame time graph in glowing Cherry Blossom pink
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const history: number[] = Array.from({ length: 40 }, () => 8.3 + (Math.random() - 0.5) * 1.2);

    const render = () => {
      const jitter = stats.autoConfigOptimized ? (Math.random() - 0.5) * 0.3 : (Math.random() - 0.5) * 2.8;
      const expectedFrameTime = 1000 / stats.fps;
      const nextVal = Math.max(4, Math.min(22, expectedFrameTime + jitter));
      history.push(nextVal);
      if (history.length > 50) history.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle cherry blossom grid lines
      ctx.strokeStyle = 'rgba(255, 183, 197, 0.12)';
      ctx.lineWidth = 1;
      [8.3, 16.6].forEach(ms => {
        const y = canvas.height - (ms / 25) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      });

      // Draw frame time curve in vibrant Cherry Blossom pink
      ctx.beginPath();
      const step = canvas.width / (history.length - 1);
      history.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height - (val / 25) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#ff75a0';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(255, 117, 160, 0.8)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Soft Cherry Blossom gradient fill
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(255, 117, 160, 0.3)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [stats.fps, stats.autoConfigOptimized]);

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 bg-[#120811] overflow-y-auto select-none relative z-20">
      {/* Top Header: "Performance" and "GPU max" (Screenshot 59 in Cherry Blossom) */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-pink-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-pink-100 tracking-tight">
              Performance
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase">
              <Crown className="w-2.5 h-2.5 text-pink-300" />
              ARUNNVRDIE
            </span>
          </div>
          <p className="text-xs text-pink-300/70 mt-0.5 uppercase tracking-wide font-semibold">
            REAL-TIME HARDWARE TELEMETRY & 100% SAKURA FOCUS ALLOCATION
          </p>
        </div>

        {/* GPU max toggle button in Cherry Blossom Pink */}
        <button
          onClick={toggleGpuMax}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            stats.gpuMaxActive
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.6)] scale-105'
              : 'bg-[#220f1e] text-pink-300/70 hover:text-pink-100 border border-pink-900/60'
          }`}
        >
          <Flame className={`w-3.5 h-3.5 ${stats.gpuMaxActive ? 'fill-white' : 'text-pink-400'}`} />
          <span className="uppercase">GPU max</span>
          {stats.gpuMaxActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          )}
        </button>
      </div>

      {/* Primary Hardware Metrics Grid (Exact Layout from Screenshot 59 in Cherry Blossom) */}
      <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6 relative overflow-hidden">
        {/* Row 1: Temperatures and stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-pink-950/80">
          {/* CPU Metric: Glowing Cherry Blossom Pink 54 °C */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tighter text-[#ff75a0] tabular-nums drop-shadow-[0_0_14px_rgba(255,117,160,0.5)]">
                {stats.cpuTemp}
              </span>
              <span className="text-2xl font-light text-pink-300/60">°C</span>
            </div>
            <div className="mt-2 text-xs font-mono font-medium text-pink-200/80 tracking-wide">
              CPU · {stats.cpuUsage}% · {stats.cpuClock.toFixed(1)} GHz · {stats.cpuPower} W
            </div>
          </div>

          {/* GPU Metric: Radiant Sakura White/Blush 48 °C */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tighter text-pink-100 tabular-nums drop-shadow-[0_0_10px_rgba(255,218,224,0.4)]">
                {stats.gpuTemp}
              </span>
              <span className="text-2xl font-light text-pink-300/60">°C</span>
            </div>
            <div className="mt-2 text-xs font-mono font-medium text-pink-200/80 tracking-wide">
              GPU · {stats.gpuUsage}% · {stats.gpuPower} W
            </div>
          </div>
        </div>

        {/* Row 2: Fan Speeds (Screenshot 59: 1981 rpm CPU fan, 2700 rpm GPU fan) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
          {/* CPU fan */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter text-pink-100 tabular-nums">
                {stats.cpuFanRpm}
              </span>
              <span className="text-lg font-light text-pink-300/60">rpm</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-pink-300/80">
              <Fan
                className={`w-3.5 h-3.5 text-pink-400 transition-transform ${
                  stats.fanTurboActive ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: stats.fanTurboActive ? '0.35s' : '1.5s' }}
              />
              <span>CPU fan</span>
              {stats.fanTurboActive && (
                <span className="text-[10px] text-pink-300 font-bold uppercase bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">TURBO</span>
              )}
            </div>
          </div>

          {/* GPU fan */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tighter text-pink-100 tabular-nums">
                {stats.gpuFanRpm}
              </span>
              <span className="text-lg font-light text-pink-300/60">rpm</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-pink-300/80">
              <Fan
                className={`w-3.5 h-3.5 text-pink-400 transition-transform ${
                  stats.gpuMaxActive ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: stats.gpuMaxActive ? '0.3s' : '1.2s' }}
              />
              <span>GPU fan</span>
              {stats.gpuMaxActive && (
                <span className="text-[10px] text-pink-300 font-bold uppercase bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">OVERCLOCKED</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Focus Banner: ALL PROCESSES DEDICATED TO FREE FIRE */}
      <div className="bg-[#1a0c18] border border-pink-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <Zap className="w-5 h-5 fill-pink-400 text-pink-400" />
          </div>
          <div>
            <span className="text-xs font-black text-pink-100 uppercase tracking-wider block">
              NEVERDIE SAKURA PROCESS ISOLATION: ACTIVE
            </span>
            <p className="text-[11px] text-pink-300/70 uppercase">
              100% CPU CORES & RAM DEDICATED EXCLUSIVELY TO {selectedEmulator.toUpperCase()} & FREE FIRE.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-200 border border-pink-400/40 uppercase shadow-sm">
          REALTIME PRIORITY
        </span>
      </div>

      {/* Real-time High Refresh Emulator FPS Engine & Frame Time Stability Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FPS Live Counter Card */}
        <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-pink-300/80 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-pink-400" />
                ACTIVE EMULATOR FPS
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/40 uppercase shadow-sm">
                {stats.fps} FPS LOCKED
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-5xl font-black text-[#ff75a0] tabular-nums tracking-tight drop-shadow-[0_0_12px_rgba(255,117,160,0.4)]">
                {stats.fps}
              </span>
              <span className="text-sm font-bold text-pink-300/70">FPS</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-pink-200 mt-3 pt-3 border-t border-pink-950">
              <div>
                <span className="text-pink-400/70 block text-[10px] uppercase">1% LOW FPS</span>
                <span className="font-bold text-pink-100">{Math.round(stats.fps * 0.94)} FPS</span>
              </div>
              <div>
                <span className="text-pink-400/70 block text-[10px] uppercase">FRAME TIME</span>
                <span className="font-bold text-pink-100">{(1000 / stats.fps).toFixed(1)} ms</span>
              </div>
            </div>
          </div>

          {/* Target FPS Selector in Cherry Blossom Pink */}
          <div className="mt-4 pt-3 border-t border-pink-950">
            <span className="text-[11px] font-semibold text-pink-300/80 block mb-2 uppercase">
              SELECT TARGET REFRESH RATE CAP:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[60, 90, 120, 240].map(fpsVal => (
                <button
                  key={fpsVal}
                  onClick={() => setTargetFps(fpsVal)}
                  className={`py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    stats.targetFps === fpsVal
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                      : 'bg-[#220f1e] text-pink-300/80 hover:bg-[#2e1428] border border-pink-900/50'
                  }`}
                >
                  {fpsVal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Frame Time Jitter Waveform Canvas */}
        <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-5 flex flex-col justify-between shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">
                LIVE FRAME TIME STABILITY (ms JITTER)
              </span>
            </div>
            <span className="text-xs font-mono text-pink-300/70 uppercase">
              {stats.autoConfigOptimized ? 'ULTRA-SMOOTH · 0.5ms SAKURA TIMER' : 'STANDARD 15.6ms TIMER'}
            </span>
          </div>

          {/* The canvas with Cherry Blossom styling */}
          <div className="h-28 w-full bg-[#120811] rounded-xl overflow-hidden border border-pink-900/40 relative my-2">
            <canvas
              ref={canvasRef}
              width={500}
              height={112}
              className="w-full h-full block"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-pink-300/70 pt-2 border-t border-pink-950">
            <span className="flex items-center gap-1.5 uppercase font-medium text-pink-200">
              <Cpu className="w-3.5 h-3.5 text-pink-400" />
              PHYSICAL P-CORES: ALL UNPARKED (ZERO STUTTER)
            </span>
            <button
              onClick={toggleFanTurbo}
              className="text-xs font-bold text-pink-300 hover:text-pink-100 flex items-center gap-1 cursor-pointer uppercase"
            >
              <Fan className="w-3 h-3 text-pink-400" />
              {stats.fanTurboActive ? 'DISABLE TURBO COOLING' : 'ENABLE TURBO COOLING (100% FAN)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
