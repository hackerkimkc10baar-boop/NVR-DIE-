import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { NavTab, SystemStats, BackgroundProcess, OptimizationLogEntry } from '../types/index.ts';
import { sound } from '../utils/audio.ts';

export type EmulatorType = 'BlueStacks 5' | 'LDPlayer 9' | 'NoxPlayer' | 'Gameloop' | 'MuMu Player' | 'SmartGaGa' | 'Direct PC Game';

interface BoosterContextType {
  isLoggedIn: boolean;
  username: string;
  login: (uname: string) => void;
  logout: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: SystemStats;
  selectedEmulator: EmulatorType;
  setSelectedEmulator: (emu: EmulatorType) => void;
  isOptimizing: boolean;
  optimizationProgress: number;
  currentOptimizationStage: string;
  optimizationLogs: OptimizationLogEntry[];
  backgroundProcesses: BackgroundProcess[];
  isMuted: boolean;
  toggleMute: () => void;
  triggerAutoConfig: () => Promise<void>;
  connectEmulator: () => Promise<void>;
  disconnectEmulator: () => void;
  toggleGpuMax: () => void;
  toggleFanTurbo: () => void;
  setTargetFps: (fps: number) => void;
  toggleProcessSuspension: (id: string) => void;
  restoreAllProcesses: () => void;
  showOverlayHud: boolean;
  setShowOverlayHud: (show: boolean) => void;
}

const initialProcesses: BackgroundProcess[] = [
  { id: '1', name: 'Windows Search Indexer (SearchIndexer.exe)', category: 'telemetry', ramUsageMb: 342, cpuUsagePercent: 6.2, isSuspended: false, impactLevel: 'High', description: 'Indexes files in background causing drive thrashing and micro-stutters.' },
  { id: '2', name: 'Connected User Experiences & Telemetry (DiagTrack)', category: 'telemetry', ramUsageMb: 185, cpuUsagePercent: 3.8, isSuspended: false, impactLevel: 'High', description: 'Diagnostic tracking sending continuous background packets.' },
  { id: '3', name: 'Microsoft OneDrive Background Sync', category: 'updater', ramUsageMb: 240, cpuUsagePercent: 4.1, isSuspended: false, impactLevel: 'Medium', description: 'Constantly checks cloud file changes and bandwidth.' },
  { id: '4', name: 'SysMain / Superfetch Memory Preload', category: 'system', ramUsageMb: 410, cpuUsagePercent: 5.0, isSuspended: false, impactLevel: 'High', description: 'Forces unnecessary disk caching during active gaming sessions.' },
  { id: '5', name: 'Google Chrome Background Worker', category: 'app', ramUsageMb: 520, cpuUsagePercent: 7.4, isSuspended: false, impactLevel: 'High', description: 'Keeps dormant browser tabs alive in memory.' },
  { id: '6', name: 'Discord GPU Hardware Acceleration', category: 'app', ramUsageMb: 310, cpuUsagePercent: 3.2, isSuspended: false, impactLevel: 'Medium', description: 'Competes with emulator for direct GPU encoder resources.' },
  { id: '7', name: 'Windows Update Orchestrator (UsoClient)', category: 'updater', ramUsageMb: 160, cpuUsagePercent: 2.5, isSuspended: false, impactLevel: 'Medium', description: 'Runs background update queries during matches.' },
  { id: '8', name: 'Print Spooler Service (spoolsv.exe)', category: 'system', ramUsageMb: 85, cpuUsagePercent: 0.8, isSuspended: false, impactLevel: 'Low', description: 'Unneeded background printing daemon.' },
];

const BoosterContext = createContext<BoosterContextType | undefined>(undefined);

export const BoosterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('arun');
  const [activeTab, setActiveTabState] = useState<NavTab>('performance');
  const [selectedEmulator, setSelectedEmulator] = useState<EmulatorType>('BlueStacks 5');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [currentOptimizationStage, setCurrentOptimizationStage] = useState<string>('');
  const [optimizationLogs, setOptimizationLogs] = useState<OptimizationLogEntry[]>([]);
  const [backgroundProcesses, setBackgroundProcesses] = useState<BackgroundProcess[]>(initialProcesses);
  const [showOverlayHud, setShowOverlayHud] = useState<boolean>(true);

  // Stats matching screenshot values:
  // CPU: 54 °C, 39%, 3.2 GHz, 28 W
  // GPU: 48 °C, 23%, 54 W
  // CPU Fan: 1981 rpm
  // GPU Fan: 2700 rpm
  // RAM: 3.3 / 11.7 GB (27%)
  const [stats, setStats] = useState<SystemStats>({
    cpuTemp: 54,
    cpuUsage: 39,
    cpuClock: 3.2,
    cpuPower: 28,
    gpuTemp: 48,
    gpuUsage: 23,
    gpuPower: 54,
    cpuFanRpm: 1981,
    gpuFanRpm: 2700,
    usedRamGb: 3.3,
    totalRamGb: 11.7,
    ramUsagePercent: 27,
    timerResolutionMs: 15.6,
    fps: 59,
    targetFps: 120,
    gpuMaxActive: false,
    fanTurboActive: false,
    blueStacksConnected: false,
    autoConfigOptimized: false,
  });

  const setActiveTab = (tab: NavTab) => {
    sound.playClick();
    setActiveTabState(tab);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const login = (uname: string) => {
    sound.playBoostStart();
    setUsername(uname || 'arun');
    setIsLoggedIn(true);
  };

  const logout = () => {
    sound.playClick();
    setIsLoggedIn(false);
  };

  // Natural subtle hardware fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // When auto config is optimized and fan turbo is on, temperatures cool down significantly!
        const baseCpuTemp = prev.autoConfigOptimized ? (prev.fanTurboActive ? 42 : 46) : 54;
        const baseGpuTemp = prev.autoConfigOptimized ? (prev.gpuMaxActive ? 44 : 41) : 48;
        const baseCpuFan = prev.fanTurboActive ? 3450 : (prev.autoConfigOptimized ? 2150 : 1981);
        const baseGpuFan = prev.gpuMaxActive ? 3800 : (prev.fanTurboActive ? 3200 : 2700);

        const jitter = (Math.random() - 0.5);
        const newCpuTemp = Math.round(baseCpuTemp + jitter * 1.5);
        const newGpuTemp = Math.round(baseGpuTemp + jitter * 1.2);
        const newCpuFan = Math.round(baseCpuFan + (Math.random() - 0.5) * 40);
        const newGpuFan = Math.round(baseGpuFan + (Math.random() - 0.5) * 50);

        // FPS calculation based on boost status
        let targetFpsDisplay = 59;
        if (prev.blueStacksConnected && prev.autoConfigOptimized) {
          targetFpsDisplay = prev.targetFps; // 120 or 240
        } else if (prev.blueStacksConnected) {
          targetFpsDisplay = 90;
        } else if (prev.autoConfigOptimized) {
          targetFpsDisplay = 85;
        }

        const newFps = Math.min(prev.targetFps, Math.max(54, Math.round(targetFpsDisplay + (Math.random() - 0.4) * 2)));

        return {
          ...prev,
          cpuTemp: newCpuTemp,
          gpuTemp: newGpuTemp,
          cpuFanRpm: newCpuFan,
          gpuFanRpm: newGpuFan,
          fps: newFps,
          cpuUsage: Math.max(18, Math.min(65, Math.round(prev.cpuUsage + (Math.random() - 0.5) * 3))),
          gpuUsage: Math.max(15, Math.min(85, Math.round(prev.gpuUsage + (Math.random() - 0.5) * 2))),
        };
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const toggleGpuMax = () => {
    sound.playClick();
    setStats(prev => {
      const nextGpuMax = !prev.gpuMaxActive;
      if (nextGpuMax) {
        sound.playFanTurbo();
      }
      return {
        ...prev,
        gpuMaxActive: nextGpuMax,
        gpuFanRpm: nextGpuMax ? 3800 : 2700,
        gpuPower: nextGpuMax ? 72 : 54,
      };
    });
  };

  const toggleFanTurbo = () => {
    sound.playClick();
    setStats(prev => {
      const nextTurbo = !prev.fanTurboActive;
      if (nextTurbo) {
        sound.playFanTurbo();
      }
      return {
        ...prev,
        fanTurboActive: nextTurbo,
        cpuFanRpm: nextTurbo ? 3450 : 1981,
        gpuFanRpm: nextTurbo ? 3600 : 2700,
      };
    });
  };

  const setTargetFps = (target: number) => {
    sound.playClick();
    setStats(prev => ({
      ...prev,
      targetFps: target,
      fps: prev.blueStacksConnected ? target : prev.fps,
    }));
  };

  // Connect Emulator & 120 FPS lock
  const connectEmulator = useCallback(async () => {
    sound.playBoostStart();
    setStats(prev => ({ ...prev, blueStacksConnected: true, fps: prev.targetFps }));
  }, []);

  const disconnectEmulator = () => {
    sound.playClick();
    setStats(prev => ({ ...prev, blueStacksConnected: false, fps: 59 }));
  };

  // Full Automatic Background Settings Optimizer
  const triggerAutoConfig = useCallback(async () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptimizationProgress(10);
    sound.playBoostStart();
    setOptimizationLogs([]);

    const log = (stage: string, message: string, status: 'pending' | 'success' | 'info' = 'info') => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setOptimizationLogs(curr => [...curr, { timestamp: time, stage, message, status }]);
      setCurrentOptimizationStage(message);
    };

    log('INIT', `Scanning background environment for ${selectedEmulator} and Free Fire...`, 'info');
    await new Promise(r => setTimeout(r, 400));
    setOptimizationProgress(25);

    log('RAM_PURGE', 'Flushing Windows Standby List & Trimming heap working sets...', 'pending');
    await new Promise(r => setTimeout(r, 600));
    // Simulate real memory freeing from 3.3 GB down to 2.1 GB!
    setStats(prev => ({
      ...prev,
      usedRamGb: 2.1,
      ramUsagePercent: 18,
    }));
    log('RAM_PURGE', 'Freed 1.2 GB of cached RAM. Standby memory restored to pool.', 'success');
    setOptimizationProgress(50);

    log('PROCESSES', 'Suspending 8 unnecessary telemetry, indexing & background updaters...', 'pending');
    await new Promise(r => setTimeout(r, 500));
    setBackgroundProcesses(prev => prev.map(p => ({ ...p, isSuspended: true })));
    log('PROCESSES', 'Background processes successfully paused without terminating critical services.', 'success');
    setOptimizationProgress(70);

    log('TIMER_RES', 'Locking Windows multimedia timer resolution to 0.500ms (NtSetTimerResolution)...', 'pending');
    await new Promise(r => setTimeout(r, 450));
    setStats(prev => ({
      ...prev,
      timerResolutionMs: 0.500,
    }));
    log('TIMER_RES', 'Global timer resolution locked at 0.5ms. Micro-stutters and input latency minimized.', 'success');
    setOptimizationProgress(85);

    log('AFFINITY', `Applying Realtime Process Priority to ${selectedEmulator} engine...`, 'pending');
    await new Promise(r => setTimeout(r, 400));
    log('NETWORK', 'Enabling TCPNoDelay and disabling Nagle algorithm for ping stability (< 18ms).', 'success');
    setOptimizationProgress(100);

    // Complete
    setStats(prev => ({
      ...prev,
      autoConfigOptimized: true,
      blueStacksConnected: true,
      fps: prev.targetFps,
      cpuTemp: 46,
      gpuTemp: 42,
    }));

    sound.playSuccess();
    log('COMPLETE', '✨ ARMORA BOOSTER: All background settings fully optimized for gaming performance!', 'success');
    await new Promise(r => setTimeout(r, 600));
    setIsOptimizing(false);
  }, [isOptimizing, selectedEmulator]);

  const toggleProcessSuspension = (id: string) => {
    sound.playClick();
    setBackgroundProcesses(prev =>
      prev.map(p => (p.id === id ? { ...p, isSuspended: !p.isSuspended } : p))
    );
  };

  const restoreAllProcesses = () => {
    sound.playClick();
    setBackgroundProcesses(prev => prev.map(p => ({ ...p, isSuspended: false })));
  };

  return (
    <BoosterContext.Provider
      value={{
        isLoggedIn,
        username,
        login,
        logout,
        activeTab,
        setActiveTab,
        stats,
        selectedEmulator,
        setSelectedEmulator,
        isOptimizing,
        optimizationProgress,
        currentOptimizationStage,
        optimizationLogs,
        backgroundProcesses,
        isMuted,
        toggleMute,
        triggerAutoConfig,
        connectEmulator,
        disconnectEmulator,
        toggleGpuMax,
        toggleFanTurbo,
        setTargetFps,
        toggleProcessSuspension,
        restoreAllProcesses,
        showOverlayHud,
        setShowOverlayHud,
      }}
    >
      {children}
    </BoosterContext.Provider>
  );
};

export const useBooster = (): BoosterContextType => {
  const context = useContext(BoosterContext);
  if (!context) {
    throw new Error('useBooster must be used within a BoosterProvider');
  }
  return context;
};
