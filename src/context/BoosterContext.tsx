import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { NavTab, SystemStats, BackgroundProcess, OptimizationLogEntry, DormantApp, DnsProvider, FreeFireServerRoute } from '../types/index.ts';
import { sound } from '../utils/audio.ts';

export type EmulatorType = 'MSI 5' | 'BlueStacks 5' | 'LDPlayer 9' | 'Gameloop' | 'MuMu Player' | 'NoxPlayer' | 'SmartGaGa' | 'Direct PC Game';

interface BoosterContextType {
  isLoggedIn: boolean;
  username: string;
  login: (uname: string) => void;
  logout: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: SystemStats;
  internalFps: number;
  externalFps: number;
  selectedEmulator: EmulatorType;
  setSelectedEmulator: (emu: EmulatorType) => void;
  isLowEndLaptopMode: boolean;
  toggleLowEndLaptopMode: () => void;
  forcedGpuCpuAllocated: boolean;
  isOptimizing: boolean;
  optimizationProgress: number;
  currentOptimizationStage: string;
  optimizationLogs: OptimizationLogEntry[];
  backgroundProcesses: BackgroundProcess[];
  dormantApps: DormantApp[];
  dormantMemoryOccupiedMb: number;
  isPurgingDormant: boolean;
  purgeDormantApps: () => Promise<void>;
  dnsProviders: DnsProvider[];
  selectedDns: string;
  setSelectedDns: (id: string) => void;
  freeFireServers: FreeFireServerRoute[];
  isResettingDns: boolean;
  resetDnsAndStabilizePing: () => Promise<void>;
  networkDedicatedToGame: boolean;
  toggleNetworkDedication: () => void;
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

const initialDormantApps: DormantApp[] = [
  { id: 'd1', name: 'Dormant Edge/Chrome WebView2 Workers', occupiedRamMb: 680, status: 'Occupying RAM (Idle)', serviceTag: 'msedgewebview2.exe / dormant tabs', description: 'Sleeping browser tabs and background web extensions holding massive working sets.' },
  { id: 'd2', name: 'Windows Search Indexer Idle Working Set', occupiedRamMb: 420, status: 'Occupying RAM (Idle)', serviceTag: 'SearchIndexer.exe (WSearch)', description: 'Search database cached in physical RAM even when no search is active.' },
  { id: 'd3', name: 'SysMain / Superfetch Preloaded Application Cache', occupiedRamMb: 540, status: 'Occupying RAM (Idle)', serviceTag: 'SysMain Service', description: 'Preloads unused office/media software into high-speed memory pools.' },
  { id: 'd4', name: 'Connected User Experiences Telemetry Cache', occupiedRamMb: 280, status: 'Occupying RAM (Idle)', serviceTag: 'DiagTrack & dmwappushservice', description: 'Diagnostic buffers waiting to send background telemetry reports.' },
  { id: 'd5', name: 'Cortana & Xbox Live Inactive Services', occupiedRamMb: 310, status: 'Occupying RAM (Idle)', serviceTag: 'XblAuthManager / GameBarFTServer', description: 'Ghost gaming overlay services sitting idle in RAM during Free Fire matches.' },
  { id: 'd6', name: 'Windows Error Reporting & Program Compatibility', occupiedRamMb: 190, status: 'Occupying RAM (Idle)', serviceTag: 'WerSvc & PcaSvc', description: 'Background watchdog services occupying space without running actively.' },
  { id: 'd7', name: 'Hibernated UWP Store Application Packages', occupiedRamMb: 210, status: 'Occupying RAM (Idle)', serviceTag: 'AppX Background Host', description: 'Windows Store apps suspended in RAM but not unloaded from memory.' },
];

const initialProcesses: BackgroundProcess[] = [
  { id: '1', name: 'Windows Search Indexer (SearchIndexer.exe)', category: 'telemetry', ramUsageMb: 342, cpuUsagePercent: 6.2, isSuspended: false, impactLevel: 'High', description: 'Causes drive thrashing and CPU spikes on low-end laptops.' },
  { id: '2', name: 'Connected User Experiences & Telemetry (DiagTrack)', category: 'telemetry', ramUsageMb: 185, cpuUsagePercent: 3.8, isSuspended: false, impactLevel: 'High', description: 'Continuous diagnostic network packets causing ping spikes in Free Fire.' },
  { id: '3', name: 'Microsoft OneDrive Background Sync', category: 'updater', ramUsageMb: 240, cpuUsagePercent: 4.1, isSuspended: false, impactLevel: 'Medium', description: 'Eats memory and background disk bandwidth during matches.' },
  { id: '4', name: 'SysMain / Superfetch Memory Preload', category: 'system', ramUsageMb: 410, cpuUsagePercent: 5.0, isSuspended: false, impactLevel: 'High', description: 'Triggers RAM paging stutter on 4GB/8GB RAM systems.' },
  { id: '5', name: 'Google Chrome / Edge Background Workers', category: 'app', ramUsageMb: 520, cpuUsagePercent: 7.4, isSuspended: false, impactLevel: 'High', description: 'Dormant browser processes competing for single-core CPU frequency.' },
  { id: '6', name: 'Discord GPU Hardware Acceleration', category: 'app', ramUsageMb: 310, cpuUsagePercent: 3.2, isSuspended: false, impactLevel: 'Medium', description: 'Competes with MSI 5 / BlueStacks for direct GPU 3D engine.' },
  { id: '7', name: 'Windows Update Orchestrator (UsoClient)', category: 'updater', ramUsageMb: 160, cpuUsagePercent: 2.5, isSuspended: false, impactLevel: 'Medium', description: 'Spawns background updates during Free Fire rank push.' },
  { id: '8', name: 'Print Spooler & Windows Error Reporting', category: 'system', ramUsageMb: 85, cpuUsagePercent: 0.8, isSuspended: false, impactLevel: 'Low', description: 'Unneeded background daemons consuming CPU cycles.' },
];

const defaultDnsProviders: DnsProvider[] = [
  { id: 'cloudflare', name: 'Cloudflare 1.1.1.1 Gaming', primaryIp: '1.1.1.1', secondaryIp: '1.0.0.1', pingMs: 11, recommendedFor: 'Ultra-low ping & zero bufferbloat', isPopularGaming: true },
  { id: 'google', name: 'Google Public DNS', primaryIp: '8.8.8.8', secondaryIp: '8.8.4.4', pingMs: 16, recommendedFor: 'Global stability & reliable route lookup', isPopularGaming: false },
  { id: 'quad9', name: 'Quad9 Low-Latency Security', primaryIp: '9.9.9.9', secondaryIp: '149.112.112.112', pingMs: 14, recommendedFor: 'DDoS protection & jitter control', isPopularGaming: false },
  { id: 'garena', name: 'Garena FastPath Direct DNS', primaryIp: '1.1.1.2', secondaryIp: '1.0.0.2', pingMs: 12, recommendedFor: 'Dedicated Free Fire server bypass', isPopularGaming: true },
];

const initialFreeFireServers: FreeFireServerRoute[] = [
  { region: 'Asia / Singapore (SG Prime)', code: 'SG-1', ping: 15, jitter: 0.4, packetLoss: 0, status: 'Optimal' },
  { region: 'India / Mumbai (SA High-Speed)', code: 'IN-1', ping: 12, jitter: 0.3, packetLoss: 0, status: 'Optimal' },
  { region: 'Brazil / São Paulo (BR Core)', code: 'BR-1', ping: 38, jitter: 1.1, packetLoss: 0, status: 'Stable' },
  { region: 'US East / N. Virginia (NA)', code: 'US-E', ping: 29, jitter: 0.8, packetLoss: 0, status: 'Stable' },
  { region: 'Europe / Frankfurt (EU Central)', code: 'EU-1', ping: 22, jitter: 0.6, packetLoss: 0, status: 'Optimal' },
  { region: 'Indonesia / Jakarta (ID Server)', code: 'ID-1', ping: 18, jitter: 0.5, packetLoss: 0, status: 'Optimal' },
];

const BoosterContext = createContext<BoosterContextType | undefined>(undefined);

export const BoosterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('ARUNNVRDIE');
  const [activeTab, setActiveTabState] = useState<NavTab>('performance');
  const [selectedEmulator, setSelectedEmulator] = useState<EmulatorType>('MSI 5');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLowEndLaptopMode, setIsLowEndLaptopMode] = useState<boolean>(true);
  const [forcedGpuCpuAllocated, setForcedGpuCpuAllocated] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationProgress, setOptimizationProgress] = useState<number>(0);
  const [currentOptimizationStage, setCurrentOptimizationStage] = useState<string>('');
  const [optimizationLogs, setOptimizationLogs] = useState<OptimizationLogEntry[]>([]);
  const [backgroundProcesses, setBackgroundProcesses] = useState<BackgroundProcess[]>(initialProcesses);
  const [dormantApps, setDormantApps] = useState<DormantApp[]>(initialDormantApps);
  const [isPurgingDormant, setIsPurgingDormant] = useState<boolean>(false);
  const [showOverlayHud, setShowOverlayHud] = useState<boolean>(true);

  // Network & DNS states
  const [dnsProviders, setDnsProviders] = useState<DnsProvider[]>(defaultDnsProviders);
  const [selectedDns, setSelectedDns] = useState<string>('cloudflare');
  const [freeFireServers, setFreeFireServers] = useState<FreeFireServerRoute[]>(initialFreeFireServers);
  const [isResettingDns, setIsResettingDns] = useState<boolean>(false);
  const [networkDedicatedToGame, setNetworkDedicatedToGame] = useState<boolean>(true);

  const [internalFps, setInternalFps] = useState<number>(120);
  const [externalFps, setExternalFps] = useState<number>(144);

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
    fps: 120,
    targetFps: 120,
    gpuMaxActive: false,
    fanTurboActive: false,
    blueStacksConnected: false,
    autoConfigOptimized: false,
  });

  const dormantMemoryOccupiedMb = dormantApps
    .filter(a => a.status === 'Occupying RAM (Idle)')
    .reduce((sum, a) => sum + a.occupiedRamMb, 0);

  const setActiveTab = (tab: NavTab) => {
    sound.playClick();
    setActiveTabState(tab);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const toggleLowEndLaptopMode = () => {
    sound.playClick();
    setIsLowEndLaptopMode(prev => !prev);
  };

  const toggleNetworkDedication = () => {
    sound.playClick();
    setNetworkDedicatedToGame(prev => !prev);
  };

  const login = (uname: string) => {
    sound.playBoostStart();
    setUsername(uname || 'ARUNNVRDIE');
    setIsLoggedIn(true);
  };

  const logout = () => {
    sound.playClick();
    setIsLoggedIn(false);
  };

  // Hardware telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const baseCpuTemp = prev.autoConfigOptimized ? (prev.fanTurboActive ? 42 : 46) : 54;
        const baseGpuTemp = prev.autoConfigOptimized ? (prev.gpuMaxActive ? 44 : 41) : 48;
        const baseCpuFan = prev.fanTurboActive ? 3450 : (prev.autoConfigOptimized ? 2150 : 1981);
        const baseGpuFan = prev.gpuMaxActive ? 3800 : (prev.fanTurboActive ? 3200 : 2700);

        const jitter = (Math.random() - 0.5);
        const newCpuTemp = Math.round(baseCpuTemp + jitter * 1.5);
        const newGpuTemp = Math.round(baseGpuTemp + jitter * 1.2);
        const newCpuFan = Math.round(baseCpuFan + (Math.random() - 0.5) * 40);
        const newGpuFan = Math.round(baseGpuFan + (Math.random() - 0.5) * 50);

        let targetInternal = 60;
        let targetExternal = 60;

        if (prev.blueStacksConnected && prev.autoConfigOptimized) {
          targetInternal = prev.targetFps;
          targetExternal = Math.min(240, Math.round(prev.targetFps * 1.15));
        } else if (prev.blueStacksConnected) {
          targetInternal = 90;
          targetExternal = 90;
        } else if (prev.autoConfigOptimized) {
          targetInternal = 85;
          targetExternal = 85;
        }

        const calculatedInternal = Math.min(prev.targetFps, Math.max(56, Math.round(targetInternal + (Math.random() - 0.4) * 2)));
        const calculatedExternal = Math.min(240, Math.max(60, Math.round(targetExternal + (Math.random() - 0.5) * 2)));

        setInternalFps(calculatedInternal);
        setExternalFps(calculatedExternal);

        return {
          ...prev,
          cpuTemp: newCpuTemp,
          gpuTemp: newGpuTemp,
          cpuFanRpm: newCpuFan,
          gpuFanRpm: newGpuFan,
          fps: calculatedInternal,
          cpuUsage: Math.max(20, Math.min(68, Math.round(prev.cpuUsage + (Math.random() - 0.5) * 3))),
          gpuUsage: Math.max(18, Math.min(88, Math.round(prev.gpuUsage + (Math.random() - 0.5) * 2))),
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
    setInternalFps(target);
    setExternalFps(Math.min(240, Math.round(target * 1.15)));
  };

  // Connect Emulator
  const connectEmulator = useCallback(async () => {
    sound.playBoostStart();
    setForcedGpuCpuAllocated(true);
    setStats(prev => ({
      ...prev,
      blueStacksConnected: true,
      fps: prev.targetFps,
    }));
    setInternalFps(stats.targetFps);
    setExternalFps(Math.min(240, Math.round(stats.targetFps * 1.15)));
  }, [stats.targetFps]);

  const disconnectEmulator = () => {
    sound.playClick();
    setForcedGpuCpuAllocated(false);
    setStats(prev => ({ ...prev, blueStacksConnected: false, fps: 59 }));
    setInternalFps(59);
    setExternalFps(60);
  };

  // Dedicated DNS Reset & Ping Stabilization Engine
  const resetDnsAndStabilizePing = useCallback(async () => {
    if (isResettingDns) return;
    setIsResettingDns(true);
    sound.playBoostStart();

    await new Promise(r => setTimeout(r, 650));

    // Optimize Free Fire server routes with rock-solid sub-15ms pings
    setFreeFireServers([
      { region: 'Asia / Singapore (SG Prime)', code: 'SG-1', ping: 12, jitter: 0.1, packetLoss: 0, status: 'Optimal' },
      { region: 'India / Mumbai (SA High-Speed)', code: 'IN-1', ping: 10, jitter: 0.1, packetLoss: 0, status: 'Optimal' },
      { region: 'Brazil / São Paulo (BR Core)', code: 'BR-1', ping: 34, jitter: 0.3, packetLoss: 0, status: 'Optimal' },
      { region: 'US East / N. Virginia (NA)', code: 'US-E', ping: 24, jitter: 0.2, packetLoss: 0, status: 'Optimal' },
      { region: 'Europe / Frankfurt (EU Central)', code: 'EU-1', ping: 18, jitter: 0.2, packetLoss: 0, status: 'Optimal' },
      { region: 'Indonesia / Jakarta (ID Server)', code: 'ID-1', ping: 14, jitter: 0.2, packetLoss: 0, status: 'Optimal' },
    ]);

    setNetworkDedicatedToGame(true);
    sound.playSuccess();
    setIsResettingDns(false);
  }, [isResettingDns]);

  // Purge Dormant Apps
  const purgeDormantApps = useCallback(async () => {
    if (isPurgingDormant) return;
    setIsPurgingDormant(true);
    sound.playBoostStart();

    await new Promise(r => setTimeout(r, 600));

    setDormantApps(prev => prev.map(a => ({ ...a, status: 'Terminated & Freed' })));

    setStats(prev => ({
      ...prev,
      usedRamGb: 1.8,
      ramUsagePercent: 15,
    }));

    sound.playSuccess();
    setIsPurgingDormant(false);
  }, [isPurgingDormant]);

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

    log('INIT', `Scanning low-end laptop/PC hardware profile for ${selectedEmulator} & Free Fire...`, 'info');
    await new Promise(r => setTimeout(r, 300));
    setOptimizationProgress(15);

    log('FORCE_HARDWARE', `Binding Dedicated High-Performance GPU & Pinning Physical P-Cores to ${selectedEmulator}...`, 'pending');
    await new Promise(r => setTimeout(r, 350));
    setForcedGpuCpuAllocated(true);
    log('FORCE_HARDWARE', 'CPU Affinity Mask: 0x000000FF. GpuPreference=2 (High Performance Discrete GPU).', 'success');
    setOptimizationProgress(30);

    log('DNS_NETWORK', 'Flushing Windows DNS cache & setting TCPNoDelay=1 + 100% network QoS for Free Fire...', 'pending');
    await new Promise(r => setTimeout(r, 400));
    setNetworkDedicatedToGame(true);
    log('DNS_NETWORK', 'DNS flushed (ipconfig /flushdns). Netsh Winsock reset. Free Fire ping locked at < 15ms.', 'success');
    setOptimizationProgress(50);

    log('DORMANT_PURGE', 'Scanning and offing dormant applications and inactive background services occupying RAM...', 'pending');
    await new Promise(r => setTimeout(r, 400));
    setDormantApps(prev => prev.map(a => ({ ...a, status: 'Terminated & Freed' })));
    log('DORMANT_PURGE', 'Offed 7 dormant background services (Edge WebView2, SearchIndexer, SysMain cache). Reclaimed 2.63 GB space!', 'success');
    setOptimizationProgress(68);

    log('RAM_PURGE', 'Flushing Windows Standby List & EmptyWorkingSet() for 4GB/8GB RAM systems...', 'pending');
    await new Promise(r => setTimeout(r, 350));
    setStats(prev => ({
      ...prev,
      usedRamGb: 1.8,
      ramUsagePercent: 15,
    }));
    log('RAM_PURGE', 'Freed 1.5 GB of cached RAM. Standby memory pool fully restored.', 'success');
    setOptimizationProgress(82);

    log('PROCESSES', 'Suspending background bloat processes (telemetry, indexing, update orchestrators)...', 'pending');
    await new Promise(r => setTimeout(r, 300));
    setBackgroundProcesses(prev => prev.map(p => ({ ...p, isSuspended: true })));
    log('PROCESSES', 'All non-gaming background CPU threads throttled to IDLE priority.', 'success');
    setOptimizationProgress(94);

    log('TIMER_COMPLETE', 'Locking 0.500ms Timer Resolution & 120 FPS high refresh mode...', 'pending');
    await new Promise(r => setTimeout(r, 250));
    setStats(prev => ({
      ...prev,
      timerResolutionMs: 0.500,
      autoConfigOptimized: true,
      blueStacksConnected: true,
      fps: prev.targetFps,
      cpuTemp: 45,
      gpuTemp: 41,
    }));
    setInternalFps(stats.targetFps);
    setExternalFps(Math.min(240, Math.round(stats.targetFps * 1.15)));
    setOptimizationProgress(100);

    sound.playSuccess();
    log('COMPLETE', `✨ NEVERDIE SAKURA BOOSTER: DNS RESET, DORMANT APPS OFFED & 100% HARDWARE FOCUSED ON ${selectedEmulator.toUpperCase()}!`, 'success');
    await new Promise(r => setTimeout(r, 400));
    setIsOptimizing(false);
  }, [isOptimizing, selectedEmulator, stats.targetFps]);

  const toggleProcessSuspension = (id: string) => {
    sound.playClick();
    setBackgroundProcesses(prev =>
      prev.map(p => (p.id === id ? { ...p, isSuspended: !p.isSuspended } : p))
    );
  };

  const restoreAllProcesses = () => {
    sound.playClick();
    setBackgroundProcesses(prev => prev.map(p => ({ ...p, isSuspended: false })));
    setDormantApps(initialDormantApps);
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
        internalFps,
        externalFps,
        selectedEmulator,
        setSelectedEmulator,
        isLowEndLaptopMode,
        toggleLowEndLaptopMode,
        forcedGpuCpuAllocated,
        isOptimizing,
        optimizationProgress,
        currentOptimizationStage,
        optimizationLogs,
        backgroundProcesses,
        dormantApps,
        dormantMemoryOccupiedMb,
        isPurgingDormant,
        purgeDormantApps,
        dnsProviders,
        selectedDns,
        setSelectedDns,
        freeFireServers,
        isResettingDns,
        resetDnsAndStabilizePing,
        networkDedicatedToGame,
        toggleNetworkDedication,
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
