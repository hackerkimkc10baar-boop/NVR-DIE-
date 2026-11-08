import React from 'react';
import { Monitor, Rocket, Settings, Wifi } from 'lucide-react';
import { NavTab } from '../types/index.ts';
import { useBooster } from '../context/BoosterContext.tsx';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useBooster();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'performance',
      label: 'Performance',
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      id: 'booster',
      label: 'Booster',
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      id: 'network',
      label: 'Network & Ping',
      icon: <Wifi className="w-5 h-5" />,
    },
    {
      id: 'settings_exe',
      label: 'Settings & EXE',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-16 bg-[#160a14] border-r border-pink-900/40 flex flex-col items-center py-6 gap-6 select-none shrink-0 z-20">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
              isActive
                ? 'border-2 border-pink-400 text-pink-200 bg-pink-500/20 shadow-[0_0_16px_rgba(244,63,94,0.5)]'
                : 'text-pink-300/40 hover:text-pink-200 hover:bg-pink-950/40 border border-transparent'
            }`}
          >
            {item.icon}
            {isActive && (
              <span className="absolute -left-1 w-1 h-4 bg-gradient-to-b from-pink-400 to-rose-500 rounded-r-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            )}
          </button>
        );
      })}
    </aside>
  );
};
