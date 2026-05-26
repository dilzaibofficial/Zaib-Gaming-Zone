'use client';

import { useShop } from '@/contexts/ShopContext';
import { FiZap, FiClock } from 'react-icons/fi';

export default function ShopStatusBanner() {
  const { settings } = useShop();

  return (
    <div className={`py-3 text-center text-sm font-gaming tracking-wider border-y ${
      settings.isOpen
        ? 'bg-neon-green/5 border-neon-green/20 text-neon-green'
        : 'bg-red-500/5 border-red-500/20 text-red-400'
    }`}>
      <div className="flex items-center justify-center gap-3">
        {settings.isOpen ? (
          <>
            <span className="w-2 h-2 rounded-full bg-neon-green inline-block animate-pulse" />
            <FiZap size={14} />
            <span>GAMING ZONE IS OPEN — Book your slot now!</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <FiClock size={11} /> {settings.openHours}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            <span>GAMING ZONE IS CLOSED — Check back during open hours</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <FiClock size={11} /> {settings.openHours}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
