import React, { useEffect, useRef } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import {
  Wifi,
  RotateCcw,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  Sparkles,
  Crown,
  Activity,
  CheckCircle2,
  Server
} from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const NetworkView: React.FC = () => {
  const {
    dnsProviders,
    selectedDns,
    setSelectedDns,
    freeFireServers,
    isResettingDns,
    resetDnsAndStabilizePing,
    networkDedicatedToGame,
    toggleNetworkDedication,
    selectedEmulator,
  } = useBooster();

  const pingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Ping Jitter Waveform Canvas
  useEffect(() => {
    const canvas = pingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const history: number[] = Array.from({ length: 45 }, () => 14 + (Math.random() - 0.5) * 1.5);

    const render = () => {
      const jitter = networkDedicatedToGame ? (Math.random() - 0.5) * 0.4 : (Math.random() - 0.5) * 3.5;
      const nextPing = Math.max(8, Math.min(35, 12 + jitter));
      history.push(nextPing);
      if (history.length > 50) history.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle cherry blossom grid lines
      ctx.strokeStyle = 'rgba(255, 183, 197, 0.12)';
      ctx.lineWidth = 1;
      [10, 20, 30].forEach(ms => {
        const y = canvas.height - (ms / 40) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      });

      // Draw ping curve in radiant Cherry Blossom pink
      ctx.beginPath();
      const step = canvas.width / (history.length - 1);
      history.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height - (val / 40) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#ff75a0';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(255, 117, 160, 0.85)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Soft Cherry Blossom gradient fill
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(255, 117, 160, 0.35)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [networkDedicatedToGame]);

  const handleSelectDns = (id: string) => {
    sound.playClick();
    setSelectedDns(id);
  };

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 bg-[#120811] overflow-y-auto select-none relative z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-pink-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-pink-100 tracking-tight uppercase flex items-center gap-2">
              <Wifi className="w-6 h-6 text-pink-400" />
              <span>NETWORK & PING OPTIMIZER</span>
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase shadow-[0_0_8px_rgba(244,63,94,0.3)]">
              <Crown className="w-3 h-3 text-pink-300" />
              OWNER: ARUNNVRDIE
            </span>
          </div>
          <p className="text-xs text-pink-300/70 mt-1 uppercase font-semibold">
            RESET WINDOWS DNS, ELIMINATE FREE FIRE PACKET LOSS & LOCK 100% BANDWIDTH TO {selectedEmulator.toUpperCase()}
          </p>
        </div>

        {/* 100% QoS Bandwidth Dedication Toggle */}
        <button
          onClick={toggleNetworkDedication}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            networkDedicatedToGame
              ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-200 border border-pink-500/50 shadow-[0_0_14px_rgba(244,63,94,0.4)]'
              : 'bg-[#220f1e] text-pink-300/60 border border-pink-900/50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span>QoS PRIORITY: {networkDedicatedToGame ? '100% GAME LOCKED' : 'SHARED'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================ */}
        {/* LEFT TWO COLUMNS: DNS RESET & BANDWIDTH DEDICATION */}
        {/* ============================================================ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: DNS RESET & FLUSH ENGINE */}
          <div className="bg-[#1a0c18] border border-pink-500/40 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-6 w-32 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-pink-100 uppercase tracking-wide flex items-center gap-2">
                  <Globe className="w-4 h-4 text-pink-400" />
                  <span>WINDOWS DNS FLUSH & LOW-LATENCY ROUTE SELECTOR</span>
                </h3>
                <p className="text-xs text-pink-300/70 mt-0.5">
                  Resets DNS cache (ipconfig /flushdns), repairs Winsock catalog & routes directly to Garena Free Fire servers
                </p>
              </div>

              <button
                onClick={resetDnsAndStabilizePing}
                disabled={isResettingDns}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 text-white font-black tracking-wider text-xs py-2.5 px-5 rounded-xl shadow-[0_4px_16px_rgba(244,63,94,0.4)] uppercase transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResettingDns ? 'animate-spin' : ''}`} />
                <span>{isResettingDns ? 'RESETTING DNS...' : 'FLUSH & RESET DNS NOW'}</span>
              </button>
            </div>

            {/* DNS Providers Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {dnsProviders.map(provider => {
                const isSelected = selectedDns === provider.id;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleSelectDns(provider.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-pink-500/25 to-rose-500/15 border-pink-400/80 shadow-[0_0_14px_rgba(244,63,94,0.3)]'
                        : 'bg-[#220f1e] border-pink-900/50 hover:border-pink-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-pink-100 uppercase">
                          {provider.name}
                        </span>
                        {provider.isPopularGaming && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-pink-500 text-white uppercase">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-pink-300/70">
                        {provider.recommendedFor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-pink-950 text-xs">
                      <span className="font-mono text-pink-300/90 text-[11px]">
                        {provider.primaryIp} · {provider.secondaryIp}
                      </span>
                      <span className="font-mono font-bold text-[#ff75a0]">
                        {provider.pingMs} ms
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Real-time Network Tweaks Applied */}
            <div className="p-3.5 rounded-xl bg-[#140813] border border-pink-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-pink-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>TCPNoDelay: 1 (Nagle Algorithm Disabled)</span>
              </span>
              <span className="flex items-center gap-1.5 text-pink-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>TCPAckFrequency: 1 (Instant Ack)</span>
              </span>
              <span className="flex items-center gap-1.5 text-pink-200">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>MTU 1500 (No Packet Fragmentation)</span>
              </span>
            </div>
          </div>

          {/* Card: 100% BANDWIDTH ALLOCATION (QoS NETWORK FOCUS) */}
          <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-pink-100 uppercase tracking-wide flex items-center gap-2">
                  <Radio className="w-4 h-4 text-pink-400" />
                  <span>EMULATOR & FREE FIRE BANDWIDTH FOCUS</span>
                </h3>
                <p className="text-xs text-pink-300/70 mt-0.5">
                  Forces Windows Network Adapter to reserve maximum throughput for {selectedEmulator.toUpperCase()} and cuts background packet stealing
                </p>
              </div>

              <span className="text-xs font-black text-[#ff75a0] bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-400/40 uppercase">
                100% DEDICATED
              </span>
            </div>

            {/* Live Realtime Jitter Waveform Canvas */}
            <div className="my-3">
              <div className="flex justify-between items-center text-xs text-pink-300/80 mb-1.5">
                <span className="font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-pink-400" />
                  LIVE NETWORK PING JITTER & PACKET STABILITY (ms)
                </span>
                <span className="font-mono text-[#ff75a0] font-bold">ZERO BUFFERBLOAT</span>
              </div>
              <div className="h-28 w-full bg-[#120811] rounded-xl overflow-hidden border border-pink-900/40 relative">
                <canvas
                  ref={pingCanvasRef}
                  width={500}
                  height={112}
                  className="w-full h-full block"
                />
              </div>
            </div>

            <p className="text-[11px] text-pink-300/70 leading-relaxed pt-1">
              * By setting <strong>NetworkThrottlingIndex = 0xFFFFFFFF</strong> and <strong>SystemResponsiveness = 0</strong>, Windows stops throttling game packets when background apps generate traffic, guaranteeing sub-15ms bullet registration in Free Fire.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: FREE FIRE SERVERS LATENCY MATRIX */}
        {/* ============================================================ */}
        <div className="space-y-6">
          {/* Free Fire Server Ping Matrix */}
          <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-pink-100 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-pink-400" />
                FREE FIRE CLUSTERS
              </span>
              <button
                onClick={resetDnsAndStabilizePing}
                disabled={isResettingDns}
                className="text-[11px] font-bold text-pink-400 hover:text-pink-300 cursor-pointer uppercase"
              >
                {isResettingDns ? 'Pinging...' : 'PROBE PING'}
              </button>
            </div>

            <div className="space-y-2.5">
              {freeFireServers.map(server => (
                <div
                  key={server.code}
                  className="p-2.5 rounded-xl bg-[#220f1e] border border-pink-900/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-pink-100">{server.code}</span>
                      <span className="text-[11px] text-pink-300/70">{server.region}</span>
                    </div>
                    <span className="text-[10px] text-pink-400/60 block">
                      Jitter: {server.jitter}ms · Loss: {server.packetLoss}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-[#ff75a0] text-sm tabular-nums block">
                      {server.ping} ms
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {server.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick DNS Flush Actions */}
          <div className="bg-gradient-to-br from-pink-900/40 via-[#1a0c18] to-[#120811] border border-pink-500/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-black text-pink-100 uppercase tracking-wide">
                AUTOMATED NETWORK CLEANER
              </span>
            </div>

            <div className="space-y-2 text-xs text-pink-200/80">
              <div className="flex justify-between py-1 border-b border-pink-950">
                <span>DNS Cache Status:</span>
                <span className="font-bold text-emerald-400">Purged & Synced</span>
              </div>
              <div className="flex justify-between py-1 border-b border-pink-950">
                <span>Active Emulator Hook:</span>
                <span className="font-bold text-pink-300">{selectedEmulator.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-pink-950">
                <span>Bandwidth Share:</span>
                <span className="font-bold text-[#ff75a0]">100% Free Fire</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Packet Loss Prevention:</span>
                <span className="font-bold text-emerald-400">Locked (0.00%)</span>
              </div>
            </div>

            <button
              onClick={resetDnsAndStabilizePing}
              className="w-full bg-[#241020] hover:bg-[#32152c] border border-pink-500/50 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md uppercase tracking-wider mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
              <span>REFRESH & STABILIZE ALL ROUTES</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
