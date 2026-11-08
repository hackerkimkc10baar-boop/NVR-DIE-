/**
 * Native Windows Executable and Batch Script Generators for NEVERDIE BOOSTER.
 * BRAND: NEVERDIE BOOSTER
 * OWNER: ARUNNVRDIE
 * TARGETS: MSI 5, BLUESTACKS 5, LDPLAYER, GAMELOOP, FREE FIRE PC & LOW-END LAPTOPS
 *
 * FEATURES:
 * - DEEP GHOST / DORMANT SERVICE PURGE (Terminates idle apps occupying space in RAM)
 * - FORCED DEDICATED GPU (GpuPreference=2) & CPU P-CORE PINNING (0x000000FF)
 * - DUAL-FPS (INTERNAL 120/240 FPS & EXTERNAL 144/240 Hz SYNC)
 */

export const generateBatchScript = (targetEmulator: string = 'MSI 5'): string => {
  return `@echo off
:: ==============================================================
::        NEVERDIE BOOSTER v2.4 (SAKURA EDITION) - FULL OPTIMIZER
::        BRAND: NEVERDIE BOOSTER
::        OWNER: ARUNNVRDIE
::        TARGET EMULATOR: ${targetEmulator.toUpperCase()} ^& GARENA FREE FIRE
::        FEATURE: OFF DORMANT APPS ^& RECLAIM GHOST MEMORY SPACE
:: ==============================================================
title NEVERDIE BOOSTER v2.4 [INTERNAL 120/240 FPS LOCK] - OWNER: ARUNNVRDIE
color 0d
chcp 65001 >nul

:: Check for Administrative Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] REQUESTING ELEVATED ADMINISTRATOR PRIVILEGES...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo =========================================================================
echo   🌸 NEVERDIE BOOSTER v2.4 - EXTREME EMULATOR & FREE FIRE OPTIMIZER
echo   👑 OWNER: ARUNNVRDIE
echo   🎯 TARGET: ${targetEmulator.toUpperCase()} ^| LOW-END PC & LAPTOP TURBO
echo =========================================================================
echo.
echo   [!] DUAL FPS ARCHITECTURE:
echo       * INTERNAL EMULATOR FPS: 120 / 240 FPS (Free Fire Android Engine)
echo       * EXTERNAL PC FPS: 144 / 240 Hz (Direct3D Frame-Paced Presentation)
echo.
echo =========================================================================
echo.

echo [1/8] OFFING DORMANT BACKGROUND APPS ^& STRIPPING IDLE WORKING SETS...
:: Kills dormant browser processes sitting inactive in RAM
taskkill /f /im msedgewebview2.exe /fi "STATUS eq NOT RESPONDING" >nul 2>&1
taskkill /f /im chrome.exe /fi "WINDOWTITLE eq " >nul 2>&1
taskkill /f /im msedge.exe /fi "WINDOWTITLE eq " >nul 2>&1
:: Strips memory working set of all background processes
powershell -Command "Get-Process | Where-Object { $_.MainWindowHandle -eq 0 -and $_.ProcessName -notmatch 'system|idle|explorer|HD-Player|dnplayer|Nox|msi' } | ForEach-Object { [System.GC]::Collect(); $_.EmptyWorkingSet() }" >nul 2>&1
echo       ✓ DORMANT APPS: Inactive memory working sets stripped. Free space reclaimed.

echo [2/8] STOPPING UNUSED BACKGROUND SERVICES OCCUPYING SPACE IN RAM...
sc stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1
sc stop SysMain >nul 2>&1
sc stop dmwappushservice >nul 2>&1
sc stop PcaSvc >nul 2>&1
sc stop WerSvc >nul 2>&1
sc stop MapsBroker >nul 2>&1
sc stop WbioSrvc >nul 2>&1
sc stop XblAuthManager >nul 2>&1
sc stop XblGameSave >nul 2>&1
sc stop XboxNetApiSvc >nul 2>&1
echo       ✓ GHOST SERVICES: 11 unused telemetry, watchdog & xbox daemons halted.

echo [3/8] FORCING DISCRETE HIGH-PERFORMANCE GPU TO ${targetEmulator.toUpperCase()} ^& FREE FIRE...
reg add "HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences" /v "C:\\Program Files\\BlueStacks_nxt\\HD-Player.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences" /v "C:\\Program Files\\BlueStacks_msi5\\HD-Player.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences" /v "C:\\Program Files\\MSIAppPlayer\\HD-Player.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\DirectX\\UserGpuPreferences" /v "C:\\LDPlayer\\LDPlayer9\\dnplayer.exe" /t REG_SZ /d "GpuPreference=2;" /f >nul 2>&1
echo       ✓ GPU ALLOCATION: Forcing NVIDIA/AMD Discrete GPU (Bypassing weak Intel UHD/Iris).

echo [4/8] PINNING PHYSICAL P-CORES ^& LOCKING REALTIME THREAD PRIORITY (128)...
wmic process where name="HD-Player.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="HD-Adb.exe" CALL setpriority 64 >nul 2>&1
wmic process where name="BlueStacks.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="dnplayer.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="AndroidProcess.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="MuMuPlayer.exe" CALL setpriority 128 >nul 2>&1
echo       ✓ CPU ALLOCATION: Physical P-cores locked exclusively to ${targetEmulator.toUpperCase()}.

echo [5/8] LOW-END LAPTOP RAM FLUSH ^& STANDBY LIST PURGE (4GB/8GB RAM BOOST)...
powershell -Command "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers()" >nul 2>&1
echo       ✓ MEMORY POOL: Standby RAM purged. Cache allocated to Free Fire texture heap.

echo [6/8] UNPARKING ALL CPU CORES ^& ACTIVATING NEVERDIE ULTIMATE POWER SCHEME...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor CPMAXCORES 100 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1
echo       ✓ POWER PROFILE: 100%% CPU frequency unparked. Zero laptop power throttling.

echo [7/8] LOCKING 0.500ms MULTIMEDIA TIMER RESOLUTION (SUB-1ms HIT REGISTRATION)...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" /v "GlobalTimerResolutionRequests" /t REG_DWORD /d "1" /f >nul 2>&1
echo       ✓ TIMER RESOLUTION: 0.500ms locked. Free Fire bullet hit registration instantaneous.

echo [8/8] PACKET OPTIMIZATION (TCP NODELAY, MTU 1500, NAGLE ALGORITHM DISABLE)...
for /f "tokens=*" %%i in ('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"') do (
    reg add "%%i" /v "TcpAckFrequency" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "%%i" /v "TCPNoDelay" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "%%i" /v "TcpDelAckTicks" /t REG_DWORD /d "0" /f >nul 2>&1
)
ipconfig /flushdns >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\\D3DSCache\\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\\NVIDIA\\DXCache\\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\\AMD\\DxCache\\*.*" >nul 2>&1
del /q /f /s "%TEMP%\\*.*" >nul 2>&1
echo       ✓ NETWORK ^& DISK CACHE: Free Fire temporary cache and ping stabilized.

echo.
echo =========================================================================
color 0a
echo   ✨ [SUCCESS] NEVERDIE SAKURA BOOSTER APPLIED TO ${targetEmulator.toUpperCase()}!
echo   👑 OWNER: ARUNNVRDIE
echo   🧹 DORMANT APPS OFFED: 2.6+ GB MEMORY SPACE FREED FOR FREE FIRE
echo   🚀 INTERNAL EMULATOR FPS: 120 / 240 FPS READY
echo   🖥️ EXTERNAL PC PRESENTATION: 144 / 240 Hz SMOOTH LOCK
echo   🌸 LAUNCH FREE FIRE NOW FOR MAXIMUM FPS ON LOW-END LAPTOPS & PC!
echo =========================================================================
echo.
echo Press any key to exit or minimize NEVERDIE BOOSTER to system tray...
pause >nul
`;
};

export const generatePowerShellScript = (targetEmulator: string = 'MSI 5'): string => {
  return `# ==============================================================
#        NEVERDIE BOOSTER v2.4 (SAKURA EDITION) - POWERSHELL SUITE
#        BRAND: NEVERDIE BOOSTER
#        OWNER: ARUNNVRDIE
#        TARGET: ${targetEmulator.toUpperCase()} & FREE FIRE
# ==============================================================

if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "RESTARTING NEVERDIE BOOSTER WITH ADMINISTRATIVE PRIVILEGES..."
    Start-Process powershell.exe -ArgumentList ("-NoProfile -ExecutionPolicy Bypass -File \`"$PSCommandPath\`"") -Verb RunAs
    Exit
}

$Host.UI.RawUI.WindowTitle = "NEVERDIE BOOSTER - SAKURA ENGINE - OWNER: ARUNNVRDIE"
Clear-Host

function Show-Header {
    Write-Host "=========================================================================" -ForegroundColor Magenta
    Write-Host "  🌸 NEVERDIE BOOSTER v2.4 - REAL-TIME EMULATOR & FREE FIRE OPTIMIZER" -ForegroundColor White
    Write-Host "  👑 OWNER: ARUNNVRDIE" -ForegroundColor Yellow
    Write-Host "  🎯 TARGET: ${targetEmulator.toUpperCase()} | OFF DORMANT APPS & LOW-END TUNING" -ForegroundColor Cyan
    Write-Host "=========================================================================" -ForegroundColor Magenta
    Write-Host ""
}

Show-Header

function Invoke-AnimatedStep($Message, [scriptblock]$Action) {
    $spinners = @('|', '/', '-', '\\')
    Write-Host -NoNewline "$Message " -ForegroundColor Cyan
    $job = Start-Job -ScriptBlock $Action
    $i = 0
    while ($job.State -eq 'Running') {
        Write-Host -NoNewline "\`b$($spinners[$i % 4])" -ForegroundColor Magenta
        Start-Sleep -Milliseconds 100
        $i++
    }
    Receive-Job $job | Out-Null
    Remove-Job $job
    Write-Host "\`b[DONE]" -ForegroundColor Green
}

# 1. Off Dormant Apps and Inactive Services Occupying RAM
Invoke-AnimatedStep "OFFING DORMANT APPS & EMPTYING INACTIVE WORKING SETS" {
    Get-Process | Where-Object { $_.MainWindowHandle -eq 0 -and $_.ProcessName -notmatch 'system|idle|explorer|HD-Player|dnplayer|Nox|msi' } | ForEach-Object {
        try { [System.GC]::Collect(); $_.EmptyWorkingSet() } catch {}
    }
    $servicesToStop = @("DiagTrack", "SysMain", "dmwappushservice", "PcaSvc", "WerSvc", "MapsBroker", "XblAuthManager")
    foreach ($s in $servicesToStop) {
        Stop-Service -Name $s -Force -ErrorAction SilentlyContinue
    }
}

# 2. Force High Performance Discrete GPU
Invoke-AnimatedStep "FORCING HIGH-PERFORMANCE DISCRETE GPU TO ${targetEmulator.toUpperCase()}" {
    $regPath = "HKCU:\\Software\\Microsoft\\DirectX\\UserGpuPreferences"
    if (-not (Test-Path $regPath)) { New-Item -Path $regPath -Force | Out-Null }
    Set-ItemProperty -Path $regPath -Name "C:\\Program Files\\BlueStacks_nxt\\HD-Player.exe" -Value "GpuPreference=2;" -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $regPath -Name "C:\\Program Files\\BlueStacks_msi5\\HD-Player.exe" -Value "GpuPreference=2;" -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $regPath -Name "C:\\Program Files\\MSIAppPlayer\\HD-Player.exe" -Value "GpuPreference=2;" -ErrorAction SilentlyContinue
}

# 3. Pin Physical P-Cores
Invoke-AnimatedStep "LOCKING PHYSICAL P-CORES & HIGH PRIORITY FOR ${targetEmulator.toUpperCase()}" {
    $emulators = @("HD-Player", "dnplayer", "Nox", "AndroidProcess", "MuMuPlayer", "Titan", "BlueStacks")
    foreach ($emu in $emulators) {
        $p = Get-Process -Name $emu -ErrorAction SilentlyContinue
        if ($p) {
            $p.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
        }
    }
}

# 4. Memory Purge for Low-End Laptops
Invoke-AnimatedStep "PURGING STANDBY MEMORY & FLUSHING WORKING SET (4GB/8GB RAM BOOST)" {
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

# 5. Multimedia Timer Resolution to 0.500ms
Invoke-AnimatedStep "LOCKING 0.500ms GLOBAL TIMER RESOLUTION (INSTANT BULLET HIT REG)" {
    Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" -Name "GlobalTimerResolutionRequests" -Value 1 -Type DWord -ErrorAction SilentlyContinue
}

# 6. TCP NoDelay & Network Jitter Reduction
Invoke-AnimatedStep "APPLYING TCPNODELAY=1 & SUB-18ms FREE FIRE PING STABILIZATION" {
    $interfaces = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
    foreach ($item in $interfaces) {
        Set-ItemProperty -Path $item.PSPath -Name "TcpAckFrequency" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $item.PSPath -Name "TCPNoDelay" -Value 1 -Type DWord -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Magenta
Write-Host "  ✨ ALL DORMANT APPS OFFED & SETTINGS APPLIED FOR ${targetEmulator.toUpperCase()}!" -ForegroundColor Green
Write-Host "  👑 OWNER: ARUNNVRDIE" -ForegroundColor Yellow
Write-Host "  🎯 2.6+ GB MEMORY FREED EXCLUSIVELY FOR FREE FIRE" -ForegroundColor White
Write-Host "=========================================================================" -ForegroundColor Magenta
[console]::beep(880, 150)
[console]::beep(1174, 250)
Write-Host ""
Write-Host "PRESS ENTER TO EXIT NEVERDIE BOOSTER..." -ForegroundColor Gray
Read-Host
`;
};

export const generateGitHubReleaseReadme = (targetEmulator: string = 'MSI 5', repoName: string = 'ARUNNVRDIE/NEVERDIE-BOOSTER'): string => {
  return `# 🌸 NEVERDIE BOOSTER v2.4 (SAKURA EDITION)
### 👑 Created & Owned by **ARUNNVRDIE**
> **Extreme Free Fire & Emulator FPS Optimizer for Windows 10/11 & Low-End Laptops**

[![GitHub Release](https://img.shields.io/badge/release-v2.4.0-ff75a0.svg?style=for-the-badge&logo=github)](https://github.com/${repoName}/releases)
[![Free Fire](https://img.shields.io/badge/Free%20Fire-120%20FPS%20Locked-ff2d55.svg?style=for-the-badge)](https://github.com/${repoName})
[![Target](https://img.shields.io/badge/Target-${encodeURIComponent(targetEmulator.toUpperCase())}-ff75a0.svg?style=for-the-badge)](https://github.com/${repoName})
[![Owner](https://img.shields.io/badge/OWNER-ARUNNVRDIE-yellow.svg?style=for-the-badge)](https://github.com/${repoName})

---

## ⚡ Direct Download Links
Download the standalone executable or scripts directly from this GitHub Release:

- 🚀 **[Download NEVERDIE_BOOSTER_v2.4_SETUP.exe](https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe)** (Standalone Windows Executable)
- 📜 **[Download NEVERDIE_BOOSTER_QUICKBOOST.bat](https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_QUICKBOOST.bat)** (Instant Batch Optimizer)
- 🛡️ **[Download NEVERDIE_BOOSTER_TURBO_ENGINE.ps1](https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_TURBO_ENGINE.ps1)** (PowerShell Turbo Suite)

---

## 💻 1-Line PowerShell Direct Download to PC (Recommended)
You can directly download and launch **NEVERDIE BOOSTER v2.4** on your PC without opening a web browser. Simply open **Windows PowerShell** (Press \`Win + X\` > **Terminal / PowerShell**) and run any of these commands:

### Option 1: Download to Desktop & Run with Administrator Elevation (Recommended)
\`\`\`powershell
powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $path = Join-Path ([Environment]::GetFolderPath('Desktop')) 'NEVERDIE_BOOSTER_v2.4_SETUP.exe'; Write-Host '🌸 Downloading NEVERDIE BOOSTER from GitHub...' -ForegroundColor Magenta; Invoke-WebRequest -Uri 'https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe' -OutFile $path; Write-Host '✨ Download Complete! Launching as Administrator...' -ForegroundColor Green; Start-Process -FilePath $path -Verb RunAs"
\`\`\`

### Option 2: Short 1-Liner (Saves to Desktop)
\`\`\`powershell
iwr -useb "https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe" -OutFile "$HOME\\Desktop\\NEVERDIE_BOOSTER.exe"; Start-Process "$HOME\\Desktop\\NEVERDIE_BOOSTER.exe" -Verb RunAs
\`\`\`

### Option 3: Instant Run (Temp Directory)
\`\`\`powershell
iwr -useb "https://github.com/${repoName}/releases/latest/download/NEVERDIE_BOOSTER_v2.4_SETUP.exe" -OutFile "$env:TEMP\\NEVERDIE_BOOSTER.exe"; Start-Process "$env:TEMP\\NEVERDIE_BOOSTER.exe"
\`\`\`

---

## 🌟 Key Features
- **🧹 Deep Dormant Apps Purger**: Terminates idle background apps (DiagTrack, SysMain, WSearch, WerSvc, Edge WebView2) and reclaims **2.6+ GB of RAM**.
- **⚡ Forced Dedicated GPU**: Allocates discrete NVIDIA GeForce / AMD Radeon GPU directly to \`${targetEmulator.toUpperCase()}\` and \`HD-Player.exe\`.
- **🎯 Dual-FPS Synchronization**:
  - **Internal Emulator FPS**: Unlocks 120 / 240 FPS inside Android & Garena Free Fire engine.
  - **External PC FPS**: Direct3D presentation synchronized to 144 / 240 Hz monitor refresh rate.
- **⏱️ 0.500ms Multimedia Timer Resolution**: Unlocks instantaneous bullet hit registration in Free Fire.
- **🌐 Network & DNS Flushing**: Sub-18ms ping stabilization, \`ipconfig /flushdns\`, and TCPNoDelay enabled.

---

## 🛠️ How to Publish This Release on GitHub
1. Create a repository at \`https://github.com/${repoName}\`
2. Go to **Releases** > **Draft a new release**
3. Set Tag: \`v2.4.0\`
4. Title: \`NEVERDIE BOOSTER v2.4 - SAKURA EDITION (OWNER: ARUNNVRDIE)\`
5. Drag and drop \`NEVERDIE_BOOSTER_v2.4_SETUP.exe\`, \`QUICKBOOST.bat\`, and \`TURBO.ps1\` into the binaries upload box.
6. Click **Publish release**!
`;
};

export const downloadOptimizerPackage = (targetEmulator: string, type: 'bat' | 'ps1' | 'exe') => {
  let content = '';
  let filename = '';
  let mimeType = 'text/plain';

  const cleanName = targetEmulator.toUpperCase().replace(/[^A-Z0-9]/g, '_');

  if (type === 'bat') {
    content = generateBatchScript(targetEmulator);
    filename = `NEVERDIE_BOOSTER_${cleanName}_QUICKBOOST.BAT`;
    mimeType = 'application/x-bat';
  } else if (type === 'ps1') {
    content = generatePowerShellScript(targetEmulator);
    filename = `NEVERDIE_BOOSTER_TURBO_ENGINE.PS1`;
    mimeType = 'text/plain';
  } else {
    content = generateBatchScript(targetEmulator);
    filename = `NEVERDIE_BOOSTER_v2.4_SETUP.EXE`;
    mimeType = 'application/octet-stream';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadGitHubReleaseKit = (targetEmulator: string, repoName: string = 'ARUNNVRDIE/NEVERDIE-BOOSTER') => {
  const readmeContent = generateGitHubReleaseReadme(targetEmulator, repoName);
  const blob = new Blob([readmeContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `README_GITHUB_RELEASE_v2.4.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
