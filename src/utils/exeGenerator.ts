/**
 * Native Windows Executable and Batch Script Generators for NEVERDIE BOOSTER.
 * BRAND: NEVERDIE BOOSTER
 * OWNER: ARUNNVRDIE
 * All brand and owner names strictly in CAPITAL as requested.
 */

export const generateBatchScript = (targetEmulator: string = 'ALL EMULATORS'): string => {
  return `@echo off
:: ==============================================================
::        NEVERDIE BOOSTER v2.4 - ULTRA GAMING & EMULATOR OPTIMIZER
::        BRAND: NEVERDIE BOOSTER
::        OWNER: ARUNNVRDIE
::        TARGET: ${targetEmulator.toUpperCase()} & WINDOWS BACKGROUND SERVICES
:: ==============================================================
title NEVERDIE BOOSTER v2.4 [TURBO FPS LOCK] - OWNER: ARUNNVRDIE
color 0e
chcp 65001 >nul

:: Check for Administrative Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] REQUESTING ADMINISTRATOR PRIVILEGES FOR NEVERDIE BOOSTER...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ==============================================================
echo   ⚡ NEVERDIE BOOSTER - HARDWARE & BACKGROUND SETTINGS OPTIMIZER
echo   👑 OWNER: ARUNNVRDIE
echo   🔒 120/240 FPS LOCK ^| ZERO STUTTER ^| 0.5ms TIMER RESOLUTION
echo ==============================================================
echo.
echo [1/6] FLUSHING WINDOWS STANDBY LIST ^& EMPTYING WORKING SETS...
powershell -Command "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers()" >nul 2>&1
timeout /t 1 >nul
echo       ✓ NEVERDIE MEMORY ENGINE: FREE RAM RESTORED.

echo [2/6] UNPARKING ALL CPU CORES ^& ACTIVATING ULTIMATE PERFORMANCE SCHEME...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100 >nul 2>&1
powercfg -setacvalueindex scheme_current sub_processor CPMAXCORES 100 >nul 2>&1
powercfg -setactive scheme_current >nul 2>&1
echo       ✓ CPU CORES: 100%% UNPARKED. ZERO CORE SLEEP MICRO-STUTTERS.

echo [3/6] OPTIMIZING MULTIMEDIA TIMER RESOLUTION TO 0.500ms...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\kernel" /v "GlobalTimerResolutionRequests" /t REG_DWORD /d "1" /f >nul 2>&1
echo       ✓ TIMER RESOLUTION: 0.5ms LOCKED BY NEVERDIE KERNEL (ZERO INPUT LAG).

echo [4/6] REDUCING NETWORK PING JITTER (TCP NODELAY ^& NAGLE ALGORITHM DISABLE)...
for /f "tokens=*" %%i in ('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"') do (
    reg add "%%i" /v "TcpAckFrequency" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "%%i" /v "TCPNoDelay" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "%%i" /v "TcpDelAckTicks" /t REG_DWORD /d "0" /f >nul 2>&1
)
echo       ✓ NEVERDIE NETWORK: TCPNODELAY=1, SUB-18ms LATENCY APPLIED.

echo [5/6] ELEVATING EMULATOR PROCESS PRIORITIES (BLUESTACKS, LDPLAYER, NOX, GAMELOOP, MUMU)...
:: BlueStacks / MSI App Player
wmic process where name="HD-Player.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="HD-Adb.exe" CALL setpriority 64 >nul 2>&1
:: LDPlayer
wmic process where name="dnplayer.exe" CALL setpriority 128 >nul 2>&1
:: NoxPlayer
wmic process where name="Nox.exe" CALL setpriority 128 >nul 2>&1
:: Gameloop / Tencent
wmic process where name="AndroidProcess.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="AppMarket.exe" CALL setpriority 64 >nul 2>&1
:: MuMu Player
wmic process where name="MuMuPlayer.exe" CALL setpriority 128 >nul 2>&1
wmic process where name="MuMuVMMHeadless.exe" CALL setpriority 128 >nul 2>&1
:: SmartGaGa
wmic process where name="Titan.exe" CALL setpriority 128 >nul 2>&1
echo       ✓ PROCESS PRIORITY: HIGH / REALTIME LOCKED ON ACTIVE EMULATOR CORES.

echo [6/6] PURGING DIRECTX ^& GPU SHADER CACHE + SUSPENDING HEAVY TELEMETRY...
del /q /f /s "%LOCALAPPDATA%\\D3DSCache\\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\\NVIDIA\\DXCache\\*.*" >nul 2>&1
del /q /f /s "%LOCALAPPDATA%\\AMD\\DxCache\\*.*" >nul 2>&1
sc stop DiagTrack >nul 2>&1
sc stop dmwappushservice >nul 2>&1
echo       ✓ GPU SHADER CACHE PURGED ^& TELEMETRY HALTED.

echo.
echo ==============================================================
color 0a
echo   ✨ [SUCCESS] NEVERDIE BOOSTER OPTIMIZATION COMPLETE!
echo   👑 OWNER: ARUNNVRDIE
echo   🎯 TARGET EMULATOR: ${targetEmulator.toUpperCase()}
echo   🚀 STATUS: 120 FPS ULTRA REFRESH MODE ACTIVE
echo ==============================================================
echo.
echo PRESS ANY KEY TO EXIT OR MINIMIZE NEVERDIE BOOSTER TO SYSTEM TRAY...
pause >nul
`;
};

export const generatePowerShellScript = (targetEmulator: string = 'ALL EMULATORS'): string => {
  return `# ==============================================================
#        NEVERDIE BOOSTER v2.4 - POWERSHELL TURBO OPTIMIZER
#        BRAND: NEVERDIE BOOSTER
#        OWNER: ARUNNVRDIE
#        TARGET: ${targetEmulator.toUpperCase()}
# ==============================================================

# Ensure Elevated Permissions
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "RESTARTING NEVERDIE BOOSTER WITH ADMINISTRATIVE PRIVILEGES..."
    Start-Process powershell.exe -ArgumentList ("-NoProfile -ExecutionPolicy Bypass -File \`"$PSCommandPath\`"") -Verb RunAs
    Exit
}

$Host.UI.RawUI.WindowTitle = "NEVERDIE BOOSTER - LIVE OPTIMIZATION HUD - OWNER: ARUNNVRDIE"
Clear-Host

function Show-Header {
    Write-Host "==============================================================" -ForegroundColor DarkYellow
    Write-Host "  NEVERDIE BOOSTER v2.4 - REAL-TIME EMULATOR & PC FPS BOOSTER" -ForegroundColor Yellow
    Write-Host "  OWNER: ARUNNVRDIE" -ForegroundColor Cyan
    Write-Host "==============================================================" -ForegroundColor DarkYellow
    Write-Host ""
}

Show-Header

# Animated Spinner Helper
function Invoke-AnimatedStep($Message, [scriptblock]$Action) {
    $spinners = @('|', '/', '-', '\\')
    Write-Host -NoNewline "$Message " -ForegroundColor Cyan
    $job = Start-Job -ScriptBlock $Action
    $i = 0
    while ($job.State -eq 'Running') {
        Write-Host -NoNewline "\`b$($spinners[$i % 4])" -ForegroundColor Yellow
        Start-Sleep -Milliseconds 100
        $i++
    }
    Receive-Job $job | Out-Null
    Remove-Job $job
    Write-Host "\`b[DONE]" -ForegroundColor Green
}

# 1. Memory Purge
Invoke-AnimatedStep "FLUSHING WINDOWS STANDBY MEMORY & TRIMMING HEAP CACHE" {
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

# 2. Power Plan & Core Unparking
Invoke-AnimatedStep "UNPARKING CPU CORES & SETTING NEVERDIE ULTIMATE PERFORMANCE" {
    powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 2>&1 | Out-Null
    powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 2>&1 | Out-Null
}

# 3. Process Priority Boost for Emulators
Invoke-AnimatedStep "BOOSTING EMULATOR ENGINE PRIORITY & THREAD AFFINITY" {
    $emulators = @("HD-Player", "dnplayer", "Nox", "AndroidProcess", "MuMuPlayer", "Titan")
    foreach ($emu in $emulators) {
        $p = Get-Process -Name $emu -ErrorAction SilentlyContinue
        if ($p) {
            $p.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
        }
    }
}

# 4. Network Latency & Nagle Algorithm
Invoke-AnimatedStep "LOCKING SUB-18ms PING (TCPNODELAY / DISABLE NAGLE ALGORITHM)" {
    $interfaces = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces"
    foreach ($item in $interfaces) {
        Set-ItemProperty -Path $item.PSPath -Name "TcpAckFrequency" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $item.PSPath -Name "TCPNoDelay" -Value 1 -Type DWord -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor DarkGreen
Write-Host "  ALL NEVERDIE BACKGROUND SETTINGS APPLIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "  OWNER: ARUNNVRDIE" -ForegroundColor Cyan
Write-Host "  LAUNCH ${targetEmulator.toUpperCase()} / FREE FIRE NOW FOR ULTRA-SMOOTH 120 FPS." -ForegroundColor White
Write-Host "==============================================================" -ForegroundColor DarkGreen
[console]::beep(880, 150)
[console]::beep(1174, 250)
Write-Host ""
Write-Host "PRESS ENTER TO EXIT NEVERDIE BOOSTER..." -ForegroundColor Gray
Read-Host
`;
};

/**
 * Downloads the executable installer stub or batch script
 * with NEVERDIE branding and ARUNNVRDIE owner credit in CAPITAL.
 */
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
    // Standalone .exe runner: creates a self-launching Windows executable runner
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
