export type NavTab = 'performance' | 'booster' | 'network' | 'settings_exe';

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

export interface DnsProvider {
  id: string;
  name: string;
  primaryIp: string;
  secondaryIp: string;
  pingMs: number;
  recommendedFor: string;
  isPopularGaming: boolean;
}

export interface FreeFireServerRoute {
  region: string;
  code: string;
  ping: number;
  jitter: number;
  packetLoss: number;
  status: 'Optimal' | 'Stable' | 'Moderate';
}

export interface DormantApp {
  id: string;
  name: string;
  occupiedRamMb: number;
  status: 'Occupying RAM (Idle)' | 'Terminated & Freed';
  serviceTag: string;
  description: string;
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
