import React, { useState } from 'react';
import { useBooster } from '../context/BoosterContext.tsx';
import { KeyRound, User, ArrowRight, ShieldCheck, Sparkles, Crown, Flower2 } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export const LoginView: React.FC = () => {
  const { login } = useBooster();
  const [usernameInput, setUsernameInput] = useState('ARUNNVRDIE');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(usernameInput.trim().toUpperCase() || 'ARUNNVRDIE');
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#120811] min-h-[500px] relative z-20">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Login Card (Cherry Blossom Theme) */}
        <div className="bg-[#1b0d19] border border-pink-900/50 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500/30 via-pink-400 to-pink-500/30 shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
          
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Flower2 className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-300">
                NEVERDIE BOOSTER · OWNER: ARUNNVRDIE
              </span>
            </div>

            {/* WELCOME BACK Title in Radiant Sakura Pink */}
            <h1 className="text-2xl font-black tracking-wide text-[#ff75a0] mb-1 uppercase drop-shadow-[0_0_12px_rgba(255,117,160,0.4)]">
              WELCOME BACK
            </h1>
            <p className="text-sm text-pink-200/60 mb-8 font-normal">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* USERNAME */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider text-pink-300/80 uppercase">
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                    placeholder="ENTER USERNAME"
                    className="w-full bg-[#251222] border border-pink-900/60 focus:border-pink-400 rounded-xl px-4 py-3 text-sm text-pink-100 placeholder-pink-400/40 outline-none transition-all focus:ring-1 focus:ring-pink-500/40 uppercase font-bold"
                    required
                  />
                  <User className="absolute right-3.5 top-3.5 w-4 h-4 text-pink-400/60 pointer-events-none" />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-wider text-pink-300/80 uppercase">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="ENTER PASSWORD"
                    className="w-full bg-[#251222] border border-pink-900/60 focus:border-pink-400 rounded-xl px-4 py-3 text-sm text-pink-100 placeholder-pink-400/40 outline-none transition-all focus:ring-1 focus:ring-pink-500/40"
                    required
                  />
                  <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-pink-400/60 pointer-events-none" />
                </div>
              </div>

              {/* Remember & Options */}
              <div className="flex items-center justify-between text-xs text-pink-300/70 pt-1">
                <label className="flex items-center gap-2 cursor-pointer hover:text-pink-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-pink-950 border-pink-800 text-pink-500 focus:ring-pink-500/50"
                  />
                  <span className="uppercase text-[11px] font-bold">SAVE SESSION</span>
                </label>
                <span className="text-pink-400 hover:text-pink-300 cursor-pointer uppercase text-[11px] font-bold">
                  HARDWARE ID LINKED
                </span>
              </div>

              {/* Glowing Cherry Blossom Gradient LOGIN Button */}
              <button
                type="submit"
                onClick={() => sound.playClick()}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 hover:from-pink-400 hover:to-rose-400 active:scale-[0.99] text-white font-black tracking-wider text-sm py-3.5 px-6 rounded-xl transition-all duration-150 shadow-[0_4px_22px_rgba(244,63,94,0.45)] uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-8 border-t border-pink-950 mt-8 flex items-center justify-between text-[11px] text-pink-300/60">
            <span className="flex items-center gap-1.5 uppercase font-bold text-pink-300">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              NEVERDIE ANTICHEAT SAFE
            </span>
            <span className="font-mono text-pink-300 uppercase font-black">ARUNNVRDIE EDITION</span>
          </div>
        </div>

        {/* Right Artwork Card with Cherry Blossom Filter and Free Fire Art */}
        <div className="bg-[#1b0d19] border border-pink-900/50 rounded-2xl overflow-hidden relative flex flex-col justify-between p-6 shadow-2xl group min-h-[420px]">
          {/* Background image styled with rose cherry blossom lighting */}
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('/assets/aistudio/Screenshot_57_b94aaee9.png')`,
              backgroundPosition: 'right 20% center',
              backgroundSize: '185% auto'
            }}
          />
          {/* Gradient scrim with cherry blossom pink tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#160a14] via-[#160a14]/65 to-pink-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b0d19]/80 via-transparent to-transparent" />

          {/* Top badge */}
          <div className="relative z-10 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full bg-pink-950/80 backdrop-blur-md text-pink-200 border border-pink-500/40 uppercase tracking-wider shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              FREE FIRE · MAX 120 FPS READY
            </span>
          </div>

          {/* Bottom game info and direct auto-login CTA */}
          <div className="relative z-10 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-pink-400 font-extrabold mb-1">
                NEVERDIE SAKURA ENGINE
              </p>
              <h2 className="text-xl font-black text-white uppercase drop-shadow-md">
                GARENA FREE FIRE & BLUESTACKS
              </h2>
              <p className="text-xs text-pink-200/80 mt-1 uppercase font-semibold">
                ALL SYSTEM HARDWARE & BACKGROUND PROCESSES DEDICATED 100% TO FREE FIRE.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playBoostStart();
                login('ARUNNVRDIE');
              }}
              className="w-full bg-[#200e1e]/90 hover:bg-[#2c1329] backdrop-blur-md border border-pink-500/50 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg uppercase tracking-wider"
            >
              <span>INSTANT LOGIN AS ARUNNVRDIE</span>
              <ArrowRight className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
