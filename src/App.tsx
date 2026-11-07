import React from 'react';
import { BoosterProvider, useBooster } from './context/BoosterContext.tsx';
import { WindowHeader } from './components/WindowHeader.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LoginView } from './components/LoginView.tsx';
import { PerformanceView } from './components/PerformanceView.tsx';
import { BoosterView } from './components/BoosterView.tsx';
import { SettingsExeView } from './components/SettingsExeView.tsx';
import { MouseAnimation } from './components/MouseAnimation.tsx';
import { FloatingHudOverlay } from './components/FloatingHudOverlay.tsx';
import { CherryBlossom } from './components/CherryBlossom.tsx';

const MainLayout: React.FC = () => {
  const { isLoggedIn, activeTab } = useBooster();

  return (
    <div className="min-h-screen w-full bg-[#0d040c] flex items-center justify-center p-2 sm:p-4 text-pink-50 select-none relative overflow-hidden font-sans">
      {/* Background Cherry Blossom ambience glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Desktop Window Frame in Cherry Blossom Aesthetic */}
      <div className="w-full max-w-5xl h-[780px] max-h-[92vh] bg-[#140813] border border-pink-900/60 rounded-2xl shadow-[0_25px_70px_rgba(20,5,18,0.95)] flex flex-col overflow-hidden relative z-10">
        {/* Falling Cherry Blossom (Sakura) Petals Animation */}
        <CherryBlossom />

        {/* Window Title Bar */}
        <WindowHeader />

        {/* Window Content */}
        {!isLoggedIn ? (
          <LoginView />
        ) : (
          <div className="flex-1 flex overflow-hidden relative">
            {/* 3-Icon Vertical Sidebar matching screenshots in Cherry Blossom theme */}
            <Sidebar />

            {/* Active View */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#120811] relative">
              {activeTab === 'performance' && <PerformanceView />}
              {activeTab === 'booster' && <BoosterView />}
              {activeTab === 'settings_exe' && <SettingsExeView />}
            </main>
          </div>
        )}
      </div>

      {/* Interactive Draggable In-Game Floating HUD in Cherry Blossom theme */}
      <FloatingHudOverlay />

      {/* Custom Gaming Particle Mouse Cursor Trail in Cherry Blossom sparks */}
      <MouseAnimation />
    </div>
  );
};

export default function App() {
  return (
    <BoosterProvider>
      <MainLayout />
    </BoosterProvider>
  );
}
