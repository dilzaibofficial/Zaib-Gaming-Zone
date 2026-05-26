'use client';

import { useState, useEffect } from 'react';
import type { Console } from '@/types';
import BookingModal from './BookingModal';
import { FiClock, FiZap } from 'react-icons/fi';
import { GiGamepad, GiJoystick } from 'react-icons/gi';
import { MdVideogameAsset } from 'react-icons/md';
import { Timestamp } from 'firebase/firestore';

interface Props {
  console: Console;
  shopOpen: boolean;
}

function CountdownTimer({ endTime }: { endTime: Timestamp }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const diff = endTime.toMillis() - Date.now();
      if (diff <= 0) { setTimeLeft('00:00'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  return (
    <div className="text-center py-3">
      <div className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1">Time Remaining</div>
      <div className="timer-display text-3xl">{timeLeft}</div>
    </div>
  );
}

const consoleColors: Record<string, { primary: string; glow: string; accent: string }> = {
  PS5:   { primary: '#818cf8', glow: 'rgba(129,140,248,0.2)', accent: '#818cf8' },
  PS4:   { primary: '#6366f1', glow: 'rgba(99,102,241,0.2)',  accent: '#6366f1' },
  VR:    { primary: '#7c3aed', glow: 'rgba(124,58,237,0.2)',  accent: '#a855f7' },
  PC:    { primary: '#a78bfa', glow: 'rgba(167,139,250,0.2)', accent: '#a78bfa' },
  Other: { primary: '#f59e0b', glow: 'rgba(245,158,11,0.2)',  accent: '#f59e0b' },
};

export default function ConsoleCard({ console: con, shopOpen }: Props) {
  const [showBooking, setShowBooking] = useState(false);
  const [showGames,   setShowGames]   = useState(false);
  const colors     = consoleColors[con.type] || consoleColors.Other;
  const isAvailable = con.status === 'available' && !con.timerActive;
  const isOccupied  = con.status === 'occupied'  || con.timerActive;

  return (
    <>
      <div
        className="gaming-card rounded-2xl overflow-hidden h-full flex flex-col"
        style={{ borderColor: isOccupied ? '#ef444433' : `${colors.primary}22` }}
      >
        {/* Header */}
        <div className="relative p-5 pb-4"
          style={{ background: `linear-gradient(135deg, ${colors.glow}, transparent)` }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${colors.primary}22`, border: `1px solid ${colors.primary}44` }}>
                {con.type === 'PS5'
                  ? <GiGamepad size={24} style={{ color: colors.primary }} />
                  : <GiJoystick size={24} style={{ color: colors.primary }} />}
              </div>
              <div>
                <div className="text-xs font-gaming tracking-widest mb-0.5" style={{ color: colors.primary }}>
                  {con.type}
                </div>
                <h3 className="font-gaming font-bold text-white text-sm leading-tight">{con.name}</h3>
              </div>
            </div>
            {isOccupied ? (
              <span className="badge-occupied flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> IN USE
              </span>
            ) : isAvailable ? (
              <span className="badge-available flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> AVAILABLE
              </span>
            ) : (
              <span className="badge-pending">MAINTENANCE</span>
            )}
          </div>
          {con.description && (
            <p className="text-gray-400 text-xs leading-relaxed">{con.description}</p>
          )}
        </div>

        {/* Timer */}
        {con.timerActive && con.timerEndTime && (
          <div className="px-5 py-2 bg-red-500/5 border-y border-red-500/20">
            <CountdownTimer endTime={con.timerEndTime} />
          </div>
        )}

        {/* Pricing */}
        <div className="px-5 py-3 border-y border-dark-border">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-300">
              <FiClock size={12} style={{ color: colors.primary }} />
              <span className="font-semibold">30 min</span>
            </span>
            <span className="font-gaming font-bold" style={{ color: colors.primary }}>Rs. {con.pricePerHalfHour}</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <FiClock size={12} style={{ color: colors.primary }} />
              <span className="font-semibold">1 hour</span>
            </span>
            <span className="font-gaming font-bold" style={{ color: colors.primary }}>Rs. {con.pricePerHour}</span>
          </div>
        </div>

        {/* Games */}
        <div className="px-5 py-3 flex-1">
          <button onClick={() => setShowGames(!showGames)}
            className="flex items-center justify-between w-full text-xs text-gray-400 hover:text-white transition-colors mb-2">
            <span className="flex items-center gap-1.5 font-gaming uppercase tracking-widest">
              <MdVideogameAsset size={14} style={{ color: colors.primary }} />
              {con.games.length} Games Available
            </span>
            <span>{showGames ? '▲' : '▼'}</span>
          </button>

          {showGames ? (
            <div className="grid grid-cols-2 gap-1 mt-2">
              {con.games.map((game) => (
                <div key={game.id} className="text-xs px-2 py-1.5 rounded flex items-center gap-1.5 text-gray-300"
                  style={{ background: `${colors.primary}0f` }}>
                  <FiZap size={10} style={{ color: colors.primary }} />
                  <span className="truncate">{game.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {con.games.slice(0, 3).map((game) => (
                <span key={game.id} className="text-xs px-2 py-0.5 rounded text-gray-300"
                  style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}22` }}>
                  {game.name}
                </span>
              ))}
              {con.games.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: colors.primary }} onClick={() => setShowGames(true)}>
                  +{con.games.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Book Button */}
        <div className="px-5 pb-5">
          <button
            onClick={() => setShowBooking(true)}
            disabled={!isAvailable || !shopOpen}
            className={`w-full py-3 rounded-xl font-gaming font-bold text-sm tracking-wider transition-all duration-150 ${
              isAvailable && shopOpen
                ? 'hover:brightness-110 hover:shadow-lg active:scale-[0.98]'
                : 'opacity-40 cursor-not-allowed'
            }`}
            style={
              isAvailable && shopOpen
                ? { background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}bb)`, color: '#fff',
                    boxShadow: `0 4px 20px ${colors.glow}` }
                : { background: '#1a1a2e', color: '#4a4a6a', border: '1px solid #1e1e3a' }
            }
          >
            {!shopOpen ? '🔒 SHOP CLOSED'
              : isOccupied ? '⏳ CURRENTLY IN USE'
              : con.status === 'maintenance' ? '🔧 MAINTENANCE'
              : '⚡ BOOK THIS STATION'}
          </button>
        </div>
      </div>

      {showBooking && (
        <BookingModal console={con} onClose={() => setShowBooking(false)} />
      )}
    </>
  );
}
