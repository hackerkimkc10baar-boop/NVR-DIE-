import React, { useState } from 'react';
import { useBooster, EmulatorType } from '../context/BoosterContext.tsx';
import {
  Zap,
  CheckCircle2,
  Terminal,
  ChevronDown,
  Layers,
  Sparkles,
  Crown,
  Laptop,
  Cpu,
  Monitor,
  Flame,
  HelpCircle,
  PowerOff,
  Github
} from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const BoosterView: React.FC = () => {
  const {
    stats,
    internalFps,
    externalFps,
    selectedEmulator,
    setSelectedEmulator,
    isLowEndLaptopMode,
    toggleLowEndLaptopMode,
    forcedGpuCpuAllocated,
    dormantMemoryOccupiedMb,
    isPurgingDormant,
    purgeDormantApps,
    isOptimizing,
    optimizationProgress,
    currentOptimizationStage,
    optimizationLogs,
    triggerAutoConfig,
    connectEmulator,
    disconnectEmulator,
    setActiveTab,
  } = useBooster();

  const [showLogs, setShowLogs] = useState(false);
  const [showEmulatorDropdown, setShowEmulatorDropdown] = useState(false);
  const [showFpsInfo, setShowFpsInfo] = useState(false);

  const emulatorOptions: { name: EmulatorType; desc: string; badge?: string }[] = [
    { name: 'MSI 5', desc: 'MSIAppPlayer.exe / BlueStacks MSI 5 Android 11', badge: 'RECOMMENDED' },
    { name: 'BlueStacks 5', desc: 'HD-Player.exe / Pie 64-bit & Android 11' },
    { name: 'LDPlayer 9', desc: 'dnplayer.exe / Android 9 64-bit Kernel' },
    { name: 'Gameloop', desc: 'AndroidProcess.exe / Tencent AOW Engine' },
    { name: 'MuMu Player', desc: 'MuMuPlayer.exe / Vulkan Graphics Mode' },
    { name: 'NoxPlayer', desc: 'Nox.exe / Virtualization Direct3D' },
    { name: 'SmartGaGa', desc: 'Titan.exe / Lightweight Titan Engine' },
    { name: 'Direct PC Game', desc: 'Free Fire PC / Steam / Riot / Epic Games' },
  ];

  const handleEmulatorSelect = (emu: EmulatorType) => {
    sound.playClick();
    setSelectedEmulator(emu);
    setShowEmulatorDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 bg-[#120811] overflow-y-auto select-none relative z-20">
      {/* Top Header: "Booster" with MSI 5 & Dual FPS highlights */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-pink-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-pink-100 tracking-tight">
              Booster
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase">
              <Crown className="w-2.5 h-2.5 text-pink-300" />
              OWNER: ARUNNVRDIE
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-200 border border-pink-400/30 uppercase">
              <Laptop className="w-2.5 h-2.5 text-pink-400" />
              LOW-END PC READY
            </span>
          </div>
          <p className="text-xs text-pink-300/70 mt-0.5 uppercase tracking-wide font-semibold">
            REALTIME EMULATOR FPS UNLOCKER & FULL HARDWARE CONVERGENCE
          </p>
        </div>

        {/* Selected Emulator Switcher featuring MSI 5 */}
        <div className="relative">
          <button
            onClick={() => {
              sound.playClick();
              setShowEmulatorDropdown(!showEmulatorDropdown);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#220f1e] hover:bg-[#2c1328] text-xs font-bold text-pink-100 border border-pink-900/60 transition-all cursor-pointer uppercase shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>TARGET: <strong className="text-pink-300 font-extrabold">{selectedEmulator.toUpperCase()}</strong></span>
            <ChevronDown className="w-3 h-3 text-pink-400" />
          </button>

          {showEmulatorDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#1e0d1b] border border-pink-900/80 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[10px] font-black text-pink-400 uppercase tracking-wider flex items-center justify-between">
                <span>SELECT TARGET EMULATOR</span>
                <span className="text-pink-300/60 text-[9px]">MSI 5 & BLUESTACKS</span>
              </div>
              {emulatorOptions.map(opt => (
                <button
                  key={opt.name}
                  onClick={() => handleEmulatorSelect(opt.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col cursor-pointer ${
                    selectedEmulator === opt.name
                      ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-white font-bold border border-pink-500/40'
                      : 'text-pink-200/80 hover:bg-pink-950/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase">{opt.name}</span>
                    {opt.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-pink-500 text-white uppercase shadow-sm">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase text-pink-400/60">{opt.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* ============================================================ */}
        {/* DUAL FPS ARCHITECTURE BANNER (Internal vs External FPS Explanation) */}
        {/* ============================================================ */}
        <div className="bg-[#1a0c18] border border-pink-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-pink-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-pink-400" />
                  DUAL-FPS INTERPOLATION ARCHITECTURE (SMOOTH GAMEPLAY LOCK)
                </span>
                <button
                  onClick={() => setShowFpsInfo(!showFpsInfo)}
                  className="text-pink-400/70 hover:text-pink-200 cursor-pointer"
                  title="How Internal vs External FPS Works"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-pink-200/80 leading-relaxed">
                By unlocking <strong>INTERNAL EMULATOR FPS</strong> in Free Fire's virtual Android engine while synchronizing <strong>EXTERNAL PC FPS</strong> on your host monitor, input latency drops to near-zero and one-tap headshots register with buttery smoothness even on low-end laptops.
              </p>
            </div>
          </div>

          {/* Dual FPS Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-pink-950/70">
            <div className="bg-[#220f1e] border border-pink-900/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                  INTERNAL EMULATOR FPS (FREE FIRE ENGINE)
                </span>
                <span className="text-xs text-pink-200/70">Virtual Android Render Rate</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#ff75a0] tabular-nums tracking-tight">
                  {internalFps}
                </span>
                <span className="text-xs font-bold text-pink-400 ml-1">FPS</span>
              </div>
            </div>

            <div className="bg-[#220f1e] border border-pink-900/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                  EXTERNAL PC FPS (HOST MONITOR DISPLAY)
                </span>
                <span className="text-xs text-pink-200/70">Direct3D Frame-Paced Rate</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-pink-100 tabular-nums tracking-tight">
                  {externalFps}
                </span>
                <span className="text-xs font-bold text-pink-400 ml-1">Hz</span>
              </div>
            </div>
          </div>

          {showFpsInfo && (
            <div className="mt-3 p-3 rounded-xl bg-[#140813] border border-pink-900/60 text-[11px] text-pink-200/90 space-y-1.5 animate-in fade-in duration-150">
              <p>
                <strong>Why Dual FPS Matters for Free Fire:</strong> Most low-end laptops stutter because the emulator's internal Android clock drifts from the Windows monitor refresh rate. NEVERDIE BOOSTER locks the internal engine to 120 FPS via ASTC cache override and decouples host VSync presentation, giving smooth 120+ FPS sensitivity!
              </p>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CARD 1: EMULATOR REALTIME BOOSTER (MSI 5 / BLUESTACKS) */}
        {/* ============================================================ */}
        <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
          {/* Top cherry blossom accent line */}
          <div className="absolute top-0 left-6 w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-400 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-pink-100 uppercase">
                {selectedEmulator.toUpperCase()} REALTIME BOOSTER
              </h3>
              <p className="text-xs text-pink-300/70">
                Optimizes system performance, frame rates & dedicated GPU bindings
              </p>
            </div>

            {/* Low-End Laptop Preset Toggle */}
            <button
              onClick={toggleLowEndLaptopMode}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isLowEndLaptopMode
                  ? 'bg-pink-500/20 text-pink-200 border border-pink-400/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'bg-[#220f1e] text-pink-400/60 border border-pink-900/50'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-pink-400" />
              <span>LOW-END LAPTOP MODE: {isLowEndLaptopMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Status badge: Cherry Blossom Pink pill */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {stats.blueStacksConnected ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-400 bg-pink-500/20 text-pink-200 text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                <span>CONNECTED: 100% GPU & CPU LOCKED TO FREE FIRE ({stats.targetFps} FPS)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-900/70 bg-pink-950/40 text-pink-400 text-xs font-black tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>IDLE · READY TO CONNECT</span>
              </div>
            )}

            {forcedGpuCpuAllocated && (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-200 border border-pink-400/40 uppercase">
                <Cpu className="w-3 h-3 inline mr-1 text-pink-400" />
                P-CORES PINNED (0x000000FF)
              </span>
            )}
          </div>

          {/* Action Buttons: FORCE CONNECT & DEDICATE HARDWARE */}
          <div className="flex flex-wrap items-center gap-4">
            {stats.blueStacksConnected ? (
              <button
                onClick={disconnectEmulator}
                className="bg-[#241020] hover:bg-[#30152b] text-pink-200 border border-pink-900/60 font-black tracking-wider text-xs sm:text-sm py-3 px-8 rounded-xl transition-all duration-150 uppercase cursor-pointer"
              >
                DISCONNECT & RESET
              </button>
            ) : (
              <button
                onClick={connectEmulator}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 active:scale-[0.99] text-white font-black tracking-wider text-xs sm:text-sm py-3.5 px-8 rounded-xl transition-all duration-150 shadow-[0_4px_22px_rgba(244,63,94,0.45)] uppercase cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>CONNECT & FORCE GPU/CPU TO {selectedEmulator.toUpperCase()}</span>
              </button>
            )}

            {stats.blueStacksConnected && (
              <span className="text-xs text-pink-300 font-bold flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                DEDICATED GPU (NVIDIA/AMD) & REALTIME THREADS BOUND EXCLUSIVELY TO FREE FIRE
              </span>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARD 2: BOOSTER AUTO CONFIG (RAM FLUSH & DORMANT APPS REDUCTION) */}
        {/* ============================================================ */}
        <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
          {/* Top cherry blossom accent line */}
          <div className="absolute top-0 left-6 w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
            {/* Left title and subtitle */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-pink-100 uppercase">
                BOOSTER AUTO CONFIG
              </h3>
              <p className="text-xs text-pink-300/70">
                Off dormant background apps, halt unused services & flush standby RAM
              </p>
              {dormantMemoryOccupiedMb > 0 && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    {(dormantMemoryOccupiedMb / 1024).toFixed(2)} GB DORMANT APPS DETECTED
                  </span>
                  <button
                    onClick={purgeDormantApps}
                    disabled={isPurgingDormant}
                    className="text-[10px] font-extrabold text-pink-300 hover:text-white uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <PowerOff className="w-3 h-3 text-pink-400" />
                    <span>OFF THEM NOW</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right side: TOTAL MEMORY RAM, 3.3 / 11.7 GB, Progress Bar, USAGE 27% */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-pink-400/80 uppercase">
                  TOTAL MEMORY RAM
                </span>
                <span className="text-sm font-black text-pink-100 tracking-tight font-mono tabular-nums">
                  {stats.usedRamGb.toFixed(1)} / {stats.totalRamGb.toFixed(1)} GB
                </span>
              </div>

              {/* Progress Bar with Glowing Cherry Blossom Gradient Fill */}
              <div className="w-full h-2 bg-[#251122] rounded-full overflow-hidden border border-pink-900/50">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(244,63,94,0.7)]"
                  style={{ width: `${stats.ramUsagePercent}%` }}
                />
              </div>

              {/* USAGE 27% in Radiant Sakura Pink */}
              <div className="text-[11px] font-bold tracking-wider text-[#ff75a0] uppercase flex items-center justify-between">
                <span>USAGE {stats.ramUsagePercent}%</span>
                {stats.autoConfigOptimized && (
                  <span className="text-pink-300/70 font-normal">
                    (1.5 GB FREED · DORMANT APPS TERMINATED)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Row: Glowing Cherry Blossom AUTO CONFIG Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={triggerAutoConfig}
              disabled={isOptimizing}
              className={`bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 active:scale-[0.99] text-white font-black tracking-wider text-xs sm:text-sm py-3 px-8 rounded-xl transition-all duration-150 shadow-[0_4px_22px_rgba(244,63,94,0.45)] uppercase cursor-pointer flex items-center gap-2 ${
                isOptimizing ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 fill-white text-white" />
              <span>{isOptimizing ? 'OFFING APPS & OPTIMIZING...' : 'AUTO CONFIG (MAX BOOST)'}</span>
            </button>

            {/* Toggle Terminal Optimization Log */}
            <button
              onClick={() => {
                sound.playClick();
                setShowLogs(!showLogs);
              }}
              className="text-xs font-semibold text-pink-300/70 hover:text-pink-100 flex items-center gap-1.5 transition-colors cursor-pointer uppercase"
            >
              <Terminal className="w-3.5 h-3.5 text-pink-400" />
              <span>{showLogs ? 'HIDE CONSOLE LOGS' : 'VIEW REAL-TIME TWEAK STEPS'}</span>
            </button>
          </div>

          {/* Live Progress Bar during Auto Config */}
          {isOptimizing && (
            <div className="mt-5 pt-4 border-t border-pink-950 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-pink-300 animate-pulse uppercase">
                  ⚡ {currentOptimizationStage}
                </span>
                <span className="font-mono text-pink-400">{optimizationProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#251122] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                  style={{ width: `${optimizationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Terminal Logs Drawer */}
          {showLogs && (
            <div className="mt-5 p-4 rounded-xl bg-[#120811] border border-pink-900/60 font-mono text-xs text-pink-200/90 space-y-2 max-h-48 overflow-y-auto">
              <div className="text-[10px] text-pink-400 font-black uppercase tracking-wider pb-1 border-b border-pink-900/40 flex items-center justify-between">
                <span>NEVERDIE SAKURA KERNEL ENGINE LOGS [OWNER: ARUNNVRDIE]:</span>
                <span className="text-pink-300/60 text-[9px]">TARGET: {selectedEmulator.toUpperCase()}</span>
              </div>
              {optimizationLogs.length === 0 ? (
                <p className="text-pink-400/60 italic py-2 uppercase">
                  CLICK 'AUTO CONFIG' TO OFF DORMANT APPS AND DEDICATE 100% HARDWARE TO FREE FIRE.
                </p>
              ) : (
                optimizationLogs.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-pink-400/60 shrink-0">[{entry.timestamp}]</span>
                    <span className="text-pink-300 shrink-0 uppercase font-bold">{entry.stage}:</span>
                    <span className="uppercase font-medium text-pink-100">
                      {entry.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
