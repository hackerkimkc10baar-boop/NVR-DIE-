export type NavTab = 'performance' | 'booster' | 'settings_exe';

export interface SystemStats {
  cpuTemp: number;
  cpuUsage: number;
  cpuClock: number;
  cpuPower: number;
  gpuTemp: number;
  gpuUsage: number;
  gpuPower: number;
  cpuFanRpm: number;
  gpuFanRpm: number;
  usedRamGb: number;
  totalRamGb: number;
  ramUsagePercent: number;
  timerResolutionMs: number;
  fps: number;
  targetFps: number;
  gpuMaxActive: boolean;
  fanTurboActive: boolean;
  blueStacksConnected: boolean;
  autoConfigOptimized: boolean;
}

export interface BackgroundProcess {
  id: string;
  name: string;
  category: 'telemetry' | 'system' | 'updater' | 'app';
  ramUsageMb: number;
  cpuUsagePercent: number;
  isSuspended: boolean;
  impactLevel: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface OptimizationLogEntry {
  timestamp: string;
  stage: string;
  message: string;
  status: 'pending' | 'success' | 'info';
}
