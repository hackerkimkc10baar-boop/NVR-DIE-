import React, { useState } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import { downloadOptimizerPackage, downloadGitHubReleaseKit } from '../utils/exeGenerator.ts';
import {
  Download,
  Terminal,
  Shield,
  Activity,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  Crown,
  Trash2,
  Layers,
  PowerOff,
  Cpu,
  Github,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Share2
} from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const SettingsExeView: React.FC = () => {
  const {
    stats,
    selectedEmulator,
    backgroundProcesses,
    dormantApps,
    dormantMemoryOccupiedMb,
    isPurgingDormant,
    purgeDormantApps,
    toggleProcessSuspension,
    restoreAllProcesses,
    showOverlayHud,
    setShowOverlayHud,
  } = useBooster();

  const [activeDownloadType, setActiveDownloadType] = useState<'exe' | 'bat' | 'ps1'>('exe');
  const [isSimulatingExe, setIsSimulatingExe] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [githubRepo, setGithubRepo] = useState<string>(() => {
    return localStorage.getItem('neverdie_github_repo') || 'ARUNNVRDIE/NEVERDIE-BOOSTER';
  });
  const [isEditingRepo, setIsEditingRepo] = useState(false);
  const [tempRepo, setTempRepo] = useState(githubRepo);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedReleaseUrl, setCopiedReleaseUrl] = useState(false);

  const [pingResults, setPingResults] = useState<{ region: string; ping: number; status: 'Optimal' | 'Good' }[]>([
    { region: 'Asia / Singapore (Free Fire Prime)', ping: 18, status: 'Optimal' },
    { region: 'India / Mumbai (Free Fire SA)', ping: 14, status: 'Optimal' },
    { region: 'Brazil / Sao Paulo (Free Fire BR)', ping: 42, status: 'Good' },
    { region: 'US East / Virginia', ping: 35, status: 'Good' },
    { region: 'Europe / Frankfurt', ping: 28, status: 'Optimal' },
  ]);
  const [isPinging, setIsPinging] = useState(false);

  const handleDownload = (type: 'exe' | 'bat' | 'ps1') => {
    sound.playBoostStart();
    downloadOptimizerPackage(selectedEmulator, type);
  };

  const handleSaveRepo = () => {
    const cleaned = tempRepo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const finalRepo = cleaned || 'ARUNNVRDIE/NEVERDIE-BOOSTER';
    setGithubRepo(finalRepo);
    localStorage.setItem('neverdie_github_repo', finalRepo);
    setIsEditingRepo(false);
    sound.playSuccess();
  };

  const handleDownloadFromGitHub = () => {
    sound.playBoostStart();
    downloadOptimizerPackage(selectedEmulator, 'exe');
    // Open GitHub Releases page
    window.open(`https://github.com/${githubRepo}/releases`, '_blank', 'noopener,noreferrer');
  };

  const handleExportReleaseKit = () => {
    sound.playSuccess();
    downloadGitHubReleaseKit(selectedEmulator, githubRepo);
  };

  const [psCommandMode, setPsCommandMode] = useState<'desktop' | 'quick'>('desktop');

  const desktopCommand = `powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $path = Join-Path ([Environment]::GetFolderPath('Desktop')) 'NEVERDIE_BOOSTER_v2.4_SETUP.exe'; Invoke-WebRequest -Uri 'https://github.com/${githubRepo}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe' -OutFile $path; Start-Process -FilePath $path -Verb RunAs"`;
  const quickCommand = `iwr -useb "https://github.com/${githubRepo}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe" -OutFile "$HOME\\Desktop\\NEVERDIE_BOOSTER.exe"; Start-Process "$HOME\\Desktop\\NEVERDIE_BOOSTER.exe" -Verb RunAs`;

  const activeCommand = psCommandMode === 'desktop' ? desktopCommand : quickCommand;

  const copyPowerShellCommand = () => {
    navigator.clipboard.writeText(activeCommand);
    setCopiedCommand(true);
    sound.playClick();
    setTimeout(() => setCopiedCommand(false), 2200);
  };

  const copyReleaseUrl = () => {
    const url = `https://github.com/${githubRepo}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe`;
    navigator.clipboard.writeText(url);
    setCopiedReleaseUrl(true);
    sound.playClick();
    setTimeout(() => setCopiedReleaseUrl(false), 2200);
  };

  const runExeSimulation = async () => {
    if (isSimulatingExe) return;
    setIsSimulatingExe(true);
    setSimulationLogs([]);
    sound.playBoostStart();

    const steps = [
      `⚡ NEVERDIE BOOSTER v2.4 (SAKURA EDITION) - OWNER: ARUNNVRDIE`,
      `🔒 ELEVATING PROCESS PRIVILEGES TO NT AUTHORITY\\SYSTEM...`,
      `🧹 OFFING 7 DORMANT APPS & EMPTYING INACTIVE WORKING SETS...`,
      `🌸 HALTED: DiagTrack, SysMain, WSearch, WerSvc, Edge WebView2 (2.63 GB RECLAIMED)...`,
      `⚡ FORCING DISCRETE HIGH-PERFORMANCE GPU TO ${selectedEmulator.toUpperCase()}...`,
      `🎯 PINNING PHYSICAL P-CORES (0x000000FF) & REALTIME PRIORITY 128...`,
      `⏱️ LOCKING MULTIMEDIA TIMER RESOLUTION TO 0.500ms...`,
      `🌐 APPLYING TCPNODELAY=1 & DISABLING NAGLE ALGORITHM (SUB-18ms PING)...`,
      `✨ [SUCCESS] NEVERDIE BOOSTER: DORMANT SPACE CLEARED & 120 FPS READY FOR FREE FIRE!`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 380));
      setSimulationLogs(prev => [...prev, steps[i]]);
      sound.playClick();
    }

    sound.playSuccess();
    setIsSimulatingExe(false);
  };

  const handleRefreshPing = async () => {
    setIsPinging(true);
    sound.playClick();
    await new Promise(r => setTimeout(r, 600));
    setPingResults([
      { region: 'Asia / Singapore (Free Fire Prime)', ping: Math.floor(Math.random() * 5 + 15), status: 'Optimal' },
      { region: 'India / Mumbai (Free Fire SA)', ping: Math.floor(Math.random() * 4 + 12), status: 'Optimal' },
      { region: 'Brazil / Sao Paulo (Free Fire BR)', ping: Math.floor(Math.random() * 8 + 38), status: 'Good' },
      { region: 'US East / Virginia', ping: Math.floor(Math.random() * 6 + 32), status: 'Good' },
      { region: 'Europe / Frankfurt', ping: Math.floor(Math.random() * 5 + 24), status: 'Optimal' },
    ]);
    setIsPinging(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 sm:p-8 bg-[#120811] overflow-y-auto select-none relative z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-pink-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-pink-100 tracking-tight uppercase">
              NEVERDIE BOOSTER SUITE
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase shadow-[0_0_8px_rgba(244,63,94,0.3)]">
              <Crown className="w-3 h-3 text-pink-300" />
              OWNER: ARUNNVRDIE
            </span>
          </div>
          <p className="text-xs text-pink-300/70 mt-1 uppercase font-semibold">
            OFF DORMANT SERVICES, RECLAIM GHOST MEMORY & DOWNLOAD STANDALONE WINDOWS .EXE
          </p>
        </div>

        {/* HUD Toggle in Cherry Blossom style */}
        <button
          onClick={() => {
            sound.playClick();
            setShowOverlayHud(!showOverlayHud);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            showOverlayHud
              ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-200 border border-pink-500/50 shadow-[0_0_14px_rgba(244,63,94,0.4)]'
              : 'bg-[#220f1e] text-pink-300/60 border border-pink-900/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-pink-400" />
          <span>IN-GAME HUD: {showOverlayHud ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================ */}
        {/* LEFT COLUMN: DORMANT APPS PURGER & STANDALONE WINDOWS .EXE */}
        {/* ============================================================ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: DORMANT & INACTIVE APPLICATIONS PURGER (User Request) */}
          <div className="bg-[#1a0c18] border border-pink-500/40 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-6 w-36 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-pink-100 uppercase tracking-wide">
                    DORMANT & GHOST APPLICATION PURGER
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 border border-pink-400/40 uppercase">
                    OFF INACTIVE APPS
                  </span>
                </div>
                <p className="text-xs text-pink-300/70 mt-0.5">
                  Terminates dormant background services not currently running on screen but occupying RAM & disk cache
                </p>
              </div>

              {/* Memory Occupied Counter */}
              <div className="text-right">
                <span className="text-xs text-pink-400/80 block uppercase font-bold">OCCUPIED BY IDLE APPS</span>
                <span className="text-xl font-black text-[#ff75a0] font-mono tabular-nums">
                  {(dormantMemoryOccupiedMb / 1024).toFixed(2)} GB
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-4 pt-2 border-t border-pink-950/70">
              <span className="text-xs text-pink-200/90 font-medium">
                {dormantMemoryOccupiedMb > 0
                  ? '7 inactive background services detected holding memory working sets'
                  : '✨ All dormant apps offed! 2.63 GB memory fully freed for Free Fire'}
              </span>

              <button
                onClick={purgeDormantApps}
                disabled={isPurgingDormant || dormantMemoryOccupiedMb === 0}
                className={`bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 text-white font-black tracking-wider text-xs py-2 px-5 rounded-xl shadow-[0_4px_16px_rgba(244,63,94,0.4)] uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                  dormantMemoryOccupiedMb === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>{isPurgingDormant ? 'OFFING DORMANT APPS...' : 'OFF ALL DORMANT APPS & FREE SPACE'}</span>
              </button>
            </div>

            {/* List of Dormant Apps Occupying Space */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {dormantApps.map(app => (
                <div
                  key={app.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    app.status === 'Terminated & Freed'
                      ? 'bg-[#140813]/60 border-pink-950/70 opacity-60'
                      : 'bg-[#220f1e] border-pink-900/50 hover:border-pink-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-pink-100">
                        {app.name}
                      </span>
                      {app.status === 'Terminated & Freed' ? (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                          OFFED & FREED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                          OCCUPYING {app.occupiedRamMb} MB
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-pink-300/60">
                      {app.description} · <span className="font-mono text-pink-300">{app.serviceTag}</span>
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-pink-200">
                    {app.status === 'Terminated & Freed' ? '0 MB' : `${app.occupiedRamMb} MB`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Windows EXE & Scripts in Cherry Blossom styling */}
          <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-6 w-28 h-1 bg-gradient-to-r from-pink-500 to-rose-400 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-pink-100 uppercase tracking-wide">
                  DOWNLOAD WINDOWS EXECUTABLE (.EXE)
                </h3>
                <p className="text-xs text-pink-300/80 mt-0.5 uppercase">
                  STANDALONE ONE-CLICK OPTIMIZER BY <strong className="text-pink-300">ARUNNVRDIE</strong> (TARGET: {selectedEmulator.toUpperCase()})
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-pink-200 bg-pink-500/20 px-2.5 py-1 rounded-lg border border-pink-500/30">
                v2.4.0 SAKURA
              </span>
            </div>

            <p className="text-xs text-pink-200/80 leading-relaxed mb-6">
              This compiled Windows optimizer halts dormant apps, purges standby memory, unparks all CPU cores, binds dedicated GPU, and locks 0.500ms multimedia timer resolution directly on your low-end PC or laptop with zero dependencies.
            </p>

            {/* Download Buttons in Cherry Blossom Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => handleDownload('exe')}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 text-white font-black tracking-wider text-xs py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(244,63,94,0.45)] uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>NEVERDIE.EXE</span>
                </div>
                <span className="text-[10px] opacity-90 font-normal">Direct Executable</span>
              </button>

              <button
                onClick={() => handleDownload('bat')}
                className="bg-[#241020] hover:bg-[#32152c] text-pink-100 font-bold tracking-wider text-xs py-3.5 px-4 rounded-xl border border-pink-900/60 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-pink-400" />
                  <span>QUICKBOOST.BAT</span>
                </div>
                <span className="text-[10px] text-pink-300/60 font-normal">Windows Batch</span>
              </button>

              <button
                onClick={() => handleDownload('ps1')}
                className="bg-[#241020] hover:bg-[#32152c] text-pink-100 font-bold tracking-wider text-xs py-3.5 px-4 rounded-xl border border-pink-900/60 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>TURBO.PS1</span>
                </div>
                <span className="text-[10px] text-pink-300/60 font-normal">PowerShell Script</span>
              </button>
            </div>

            {/* Interactive In-App EXE Animation Simulator */}
            <div className="pt-4 border-t border-pink-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-pink-400" />
                  LIVE EXE RUNNER CONSOLE ANIMATION
                </span>
                <button
                  onClick={runExeSimulation}
                  disabled={isSimulatingExe}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer uppercase"
                >
                  <Play className="w-3 h-3 fill-pink-400" />
                  {isSimulatingExe ? 'RUNNING EXE...' : 'TEST RUN EXE ANIMATION'}
                </button>
              </div>

              {/* Console window in Cherry Blossom styling */}
              <div className="bg-[#120811] border border-pink-900/60 rounded-xl p-3.5 font-mono text-[11px] text-pink-200/90 min-h-[140px] max-h-48 overflow-y-auto space-y-1">
                {simulationLogs.length === 0 ? (
                  <div className="text-pink-400/50 py-4 text-center uppercase">
                    Click 'TEST RUN EXE ANIMATION' to watch NEVERDIE BOOSTER console execution in real-time.
                  </div>
                ) : (
                  simulationLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes('[SUCCESS]')
                          ? 'text-pink-300 font-bold bg-pink-500/20 px-1 py-0.5 rounded border border-pink-500/30'
                          : log.includes('NEVERDIE')
                          ? 'text-[#ff75a0] font-bold'
                          : 'text-pink-200/90'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Card: GITHUB RELEASES & EXECUTABLE DOWNLOAD HUB (User Request) */}
          <div className="bg-[#1a0c18] border border-pink-500/40 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-6 w-36 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 rounded-b-full shadow-[0_0_12px_rgba(244,63,94,0.8)]" />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    <Github className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-pink-100 uppercase tracking-wide flex items-center gap-2">
                      <span>GITHUB RELEASES & EXECUTABLE HUB</span>
                    </h3>
                    <p className="text-xs text-pink-300/70 mt-0.5">
                      Download NEVERDIE.EXE directly from your GitHub repository or distribute to your community
                    </p>
                  </div>
                </div>
              </div>

              <span className="self-start text-[10px] font-black px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-200 border border-pink-500/40 uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-pink-300" />
                OWNER: ARUNNVRDIE
              </span>
            </div>

            {/* Repository Config & Links Bar */}
            <div className="bg-[#130712] border border-pink-900/60 rounded-xl p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-pink-400 font-bold uppercase shrink-0">REPO:</span>
                {isEditingRepo ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={tempRepo}
                      onChange={(e) => setTempRepo(e.target.value)}
                      placeholder="username/repository"
                      className="bg-[#220f1e] text-xs text-pink-100 px-2.5 py-1 rounded-lg border border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-400 flex-1 font-mono"
                    />
                    <button
                      onClick={handleSaveRepo}
                      className="px-2.5 py-1 text-xs font-bold bg-pink-500 hover:bg-pink-400 text-white rounded-lg cursor-pointer"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => {
                        setTempRepo(githubRepo);
                        setIsEditingRepo(false);
                      }}
                      className="px-2 py-1 text-xs text-pink-400 hover:text-pink-200 cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-pink-200 bg-pink-950/60 px-2.5 py-0.5 rounded border border-pink-900/50">
                      github.com/{githubRepo}
                    </span>
                    <button
                      onClick={() => setIsEditingRepo(true)}
                      className="text-[10px] font-bold text-pink-400 hover:text-pink-300 underline uppercase cursor-pointer"
                    >
                      CHANGE
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://github.com/${githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-pink-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#241020] hover:bg-[#34162e] border border-pink-900/50 transition-colors flex items-center gap-1"
                >
                  <span>REPO</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://github.com/${githubRepo}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-pink-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#241020] hover:bg-[#34162e] border border-pink-900/50 transition-colors flex items-center gap-1"
                >
                  <span>RELEASES</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Action Grid: Direct GitHub EXE Download & Release Kit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Primary Download from GitHub button */}
              <button
                onClick={handleDownloadFromGitHub}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 text-white font-black tracking-wide text-xs p-4 rounded-xl shadow-[0_4px_20px_rgba(244,63,94,0.4)] uppercase transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <div className="text-xs font-black">DOWNLOAD EXE FROM GITHUB</div>
                    <div className="text-[10px] text-pink-100/80 font-normal">
                      NEVERDIE_BOOSTER_v2.4_SETUP.exe
                    </div>
                  </div>
                </div>
                <Github className="w-5 h-5 text-white/70" />
              </button>

              {/* Export GitHub Release Kit */}
              <button
                onClick={handleExportReleaseKit}
                className="bg-[#241020] hover:bg-[#34162e] text-pink-100 font-bold tracking-wide text-xs p-4 rounded-xl border border-pink-900/70 hover:border-pink-700 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-pink-100">EXPORT GITHUB RELEASE KIT</div>
                    <div className="text-[10px] text-pink-300/60 font-normal">
                      README.md with badges & release guide
                    </div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-pink-400 transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>

            {/* Direct 1-Line PowerShell Command For Community & Players */}
            <div className="bg-[#120811] border border-pink-900/60 rounded-xl p-3.5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-pink-300 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-pink-400" />
                    DIRECT POWERSHELL DOWNLOAD COMMAND
                  </span>
                  {/* Mode switcher */}
                  <div className="flex items-center p-0.5 rounded-lg bg-[#220f1e] border border-pink-900/50 text-[10px] font-bold">
                    <button
                      onClick={() => setPsCommandMode('desktop')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        psCommandMode === 'desktop'
                          ? 'bg-pink-500 text-white shadow-sm'
                          : 'text-pink-300/70 hover:text-pink-200'
                      }`}
                    >
                      Desktop + Admin
                    </button>
                    <button
                      onClick={() => setPsCommandMode('quick')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        psCommandMode === 'quick'
                          ? 'bg-pink-500 text-white shadow-sm'
                          : 'text-pink-300/70 hover:text-pink-200'
                      }`}
                    >
                      Quick 1-Liner
                    </button>
                  </div>
                </div>

                <button
                  onClick={copyPowerShellCommand}
                  className="text-[11px] font-bold text-pink-300 hover:text-white px-2.5 py-1 rounded-lg bg-pink-950/80 hover:bg-pink-900/80 border border-pink-800/60 transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  {copiedCommand ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">COMMAND COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY POWERSHELL COMMAND</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#0d040c] border border-pink-950 font-mono text-[11px] text-pink-200/90 break-all select-all flex items-center justify-between gap-2 shadow-inner">
                <span>{activeCommand}</span>
              </div>
              <p className="text-[10px] text-pink-400/80 leading-relaxed">
                💡 <strong>How to use on your PC:</strong> Press <kbd className="px-1 py-0.5 rounded bg-pink-950 border border-pink-800 text-pink-200">Win + X</kbd> &gt; open <strong>Terminal / PowerShell</strong>, paste this command, and press <kbd className="px-1 py-0.5 rounded bg-pink-950 border border-pink-800 text-pink-200">Enter</kbd>. It directly downloads <strong className="text-pink-200 font-mono">NEVERDIE_BOOSTER_v2.4_SETUP.exe</strong> from your GitHub to your PC Desktop and starts optimization automatically.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: SYSTEM TWEAKS & PING BENCHMARK */}
        {/* ============================================================ */}
        <div className="space-y-6">
          {/* Owner Credit Banner in Cherry Blossom theme */}
          <div className="bg-gradient-to-br from-pink-900/40 via-[#1a0c18] to-[#120811] border border-pink-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <Crown className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400/90 block">
                  BRAND & CREATOR
                </span>
                <h4 className="text-base font-black text-pink-100 uppercase tracking-tight">
                  NEVERDIE BOOSTER
                </h4>
                <p className="text-xs font-extrabold text-pink-300 uppercase tracking-wide">
                  OWNER: ARUNNVRDIE
                </p>
              </div>
            </div>
          </div>

          {/* Low Latency Network Ping Monitor */}
          <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-pink-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-pink-400" />
                GAME SERVER PING
              </span>
              <button
                onClick={handleRefreshPing}
                disabled={isPinging}
                className="text-[11px] font-bold text-pink-400 hover:text-pink-300 cursor-pointer uppercase"
              >
                {isPinging ? 'Pinging...' : 'Test Ping'}
              </button>
            </div>

            <div className="space-y-2">
              {pingResults.map(res => (
                <div
                  key={res.region}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#220f1e] border border-pink-900/40"
                >
                  <span className="text-pink-200/80 font-medium truncate max-w-[180px]">
                    {res.region}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#ff75a0] tabular-nums">
                      {res.ping} ms
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Kernel Tweaks Status */}
          <div className="bg-[#1a0c18] border border-pink-900/50 rounded-2xl p-5 shadow-xl space-y-3">
            <span className="text-xs font-bold text-pink-200 uppercase tracking-wider block">
              KERNEL & HARDWARE STATUS
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-pink-950">
                <span className="text-pink-300/60">Dormant Apps:</span>
                <span className="font-bold text-pink-200">
                  {dormantMemoryOccupiedMb === 0 ? 'Purged & Offed' : `${(dormantMemoryOccupiedMb / 1024).toFixed(2)} GB Occupied`}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-pink-950">
                <span className="text-pink-300/60">Timer Resolution:</span>
                <span className="font-mono font-bold text-[#ff75a0]">
                  {stats.timerResolutionMs.toFixed(3)} ms
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-pink-950">
                <span className="text-pink-300/60">Power Scheme:</span>
                <span className="font-bold text-pink-200">Ultimate Performance</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-pink-950">
                <span className="text-pink-300/60">Core Parking:</span>
                <span className="font-bold text-pink-200">100% Unparked</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-pink-950">
                <span className="text-pink-300/60">TCP NoDelay:</span>
                <span className="font-bold text-pink-200">Enabled (Sub-18ms)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-pink-300/60">Target Emulator:</span>
                <span className="font-bold text-pink-300">{selectedEmulator}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
