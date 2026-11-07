import React from 'react';
import { Volume2, VolumeX, Minus, Square, X, Zap, Crown, Flower2 } from 'lucide-react';
import { useBooster } from '../context/BoosterContext.tsx';

interface WindowHeaderProps {
  onCloseClick?: () => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({ onCloseClick }) => {
  const { isMuted, toggleMute, stats, isLoggedIn, logout } = useBooster();

  return (
    <header className="h-11 bg-[#160a14] border-b border-pink-900/40 px-4 flex items-center justify-between select-none shrink-0 z-30">
      {/* Brand title: NEVERDIE BOOSTER - CHERRY BLOSSOM THEME */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-sm bg-gradient-to-tr from-pink-600 via-rose-400 to-pink-300 shadow-[0_0_12px_rgba(244,63,94,0.7)] flex items-center justify-center">
          <Flower2 className="w-2.5 h-2.5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-pink-100 uppercase drop-shadow-[0_0_8px_rgba(255,183,197,0.3)]">
            NEVERDIE BOOSTER
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
            <Crown className="w-2.5 h-2.5 text-pink-300" />
            OWNER: ARUNNVRDIE
          </span>
        </div>

        {stats.autoConfigOptimized && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-400/40 uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.3)]">
            <Zap className="w-3 h-3 fill-pink-300 text-pink-300" />
            100% FOCUS TO FREE FIRE
          </span>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 text-pink-300/70">
        {/* Sound toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'UNMUTE SOUND EFFECTS' : 'MUTE SOUND EFFECTS'}
          className="p-1.5 rounded-lg hover:bg-pink-950/60 hover:text-pink-200 transition-colors cursor-pointer"
          aria-label="TOGGLE MUTE"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {isLoggedIn && (
          <button
            onClick={logout}
            title="SWITCH USER / LOGOUT"
            className="text-[10px] font-bold px-2 py-1 rounded-md text-pink-300/70 hover:text-pink-200 hover:bg-pink-950/50 transition-colors uppercase cursor-pointer"
          >
            LOGOUT
          </button>
        )}

        {/* Window controls */}
        <div className="flex items-center ml-1 border-l border-pink-900/40 pl-2 gap-1">
          <button
            className="p-1.5 rounded hover:bg-pink-950/60 hover:text-pink-200 transition-colors cursor-pointer"
            title="MINIMIZE"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-pink-950/60 hover:text-pink-200 transition-colors cursor-pointer"
            title="MAXIMIZE"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={onCloseClick}
            className="p-1.5 rounded hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            title="CLOSE"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
