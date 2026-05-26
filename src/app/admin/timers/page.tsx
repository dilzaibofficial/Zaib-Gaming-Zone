'use client';

import { useEffect, useState } from 'react';
import { subscribeConsoles, startTimer, stopTimer } from '@/lib/firestore';
import { createGuestAccount } from '@/lib/auth';
import type { Console } from '@/types';
import { Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FiClock, FiStopCircle, FiPlay, FiUser } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';

function TimerDisplay({ endTime }: { endTime: Timestamp }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const end = endTime.toMillis();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('00:00'); setPercent(0); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    calc();
    const t = setInterval(calc, 500);
    return () => clearInterval(t);
  }, [endTime]);

  return (
    <div className="text-center">
      <div className="timer-display">{timeLeft}</div>
      <div className="text-xs text-gray-400 mt-1 font-gaming">REMAINING</div>
    </div>
  );
}

function ConsoleTimerCard({ con }: { con: Console }) {
  const [duration, setDuration] = useState(60);
  const [guestMode, setGuestMode] = useState(false);
  const [guestLabel, setGuestLabel] = useState('');
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [guestInfo, setGuestInfo] = useState<{ regNo: string; password: string } | null>(null);

  const handleStart = async () => {
    setStarting(true);
    try {
      let userId: string | undefined;
      if (guestMode) {
        const guest = await createGuestAccount(guestLabel || 'Walk-in Guest');
        setGuestInfo({ regNo: guest.regNo, password: guest.guestPassword });
        userId = guest.guestId;
        toast.success(`Guest created!\nReg: ${guest.regNo}\nPass: ${guest.guestPassword}`);
      }
      await startTimer(con.id, duration, userId);
      toast.success(`Timer started: ${duration} minutes!`);
      setGuestMode(false);
      setGuestLabel('');
    } catch (err) {
      toast.error('Failed to start timer');
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  const handleStop = async () => {
    if (!confirm('End this session early?')) return;
    setStopping(true);
    try {
      await stopTimer(con.id);
      toast.success('Session ended.');
      setGuestInfo(null);
    } catch {
      toast.error('Failed to stop timer');
    } finally {
      setStopping(false);
    }
  };

  const isActive = con.timerActive && con.timerEndTime;
  const colors = con.type === 'PS5' ? '#00d4ff' : con.type === 'PS4' ? '#00ff88' : '#7c3aed';

  return (
    <div
      className="gaming-card rounded-2xl overflow-hidden"
      style={{ borderColor: `${colors}33` }}
    >
      {/* Accent */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors}, transparent)` }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${colors}15`, border: `1px solid ${colors}33` }}
            >
              <GiGamepad size={22} style={{ color: colors }} />
            </div>
            <div>
              <div className="font-gaming font-bold text-white text-sm">{con.name}</div>
              <div className="text-xs" style={{ color: colors }}>{con.type}</div>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded font-gaming uppercase ${
            isActive ? 'text-red-400 bg-red-500/20 border border-red-500/30' :
            'text-neon-green bg-neon-green/20 border border-neon-green/30'
          }`}>
            {isActive ? 'IN USE' : 'FREE'}
          </span>
        </div>

        {/* Active Timer */}
        {isActive && con.timerEndTime ? (
          <div className="text-center py-4">
            <TimerDisplay endTime={con.timerEndTime} />
            <div className="text-xs text-gray-400 mt-2">
              {con.timerDuration}-minute session
            </div>
            <button
              onClick={handleStop}
              disabled={stopping}
              className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all font-gaming text-sm font-bold"
            >
              <FiStopCircle size={16} />
              {stopping ? 'Stopping...' : 'End Session Early'}
            </button>
          </div>
        ) : (
          /* Start Timer Controls */
          <div className="space-y-4">
            {/* Duration */}
            <div>
              <label className="text-xs font-gaming text-gray-400 uppercase tracking-widest mb-2 block">Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {[30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-xl border font-gaming text-sm font-bold transition-all ${
                      duration === d
                        ? 'border-neon-green bg-neon-green/10 text-neon-green'
                        : 'border-dark-border text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <FiClock className="inline mr-1.5 mb-0.5" size={13} />
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Guest mode */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setGuestMode(!guestMode)}
                  className={`w-10 h-5 rounded-full transition-all relative ${guestMode ? 'bg-neon-green' : 'bg-dark-border'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${guestMode ? 'left-5.5' : 'left-0.5'}`} style={{ left: guestMode ? 22 : 2 }} />
                </div>
                <span className="text-xs text-gray-400 font-gaming flex items-center gap-1">
                  <FiUser size={11} />
                  Anonymous / Guest Walk-In
                </span>
              </label>

              {guestMode && (
                <div
                  className="mt-2"
                >
                  <input
                    type="text"
                    placeholder="Guest label (optional, e.g. 'Table 3')"
                    value={guestLabel}
                    onChange={(e) => setGuestLabel(e.target.value)}
                    className="input-neon text-sm py-2"
                  />
                </div>
              )}
            </div>

            {/* Guest credentials display */}
            {guestInfo && (
              <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/30">
                <div className="text-xs font-gaming text-neon-green mb-2">GUEST ACCOUNT CREATED</div>
                <div className="text-sm text-white">Reg No: <strong className="text-neon-green">{guestInfo.regNo}</strong></div>
                <div className="text-sm text-white">Password: <strong className="text-neon-green">{guestInfo.password}</strong></div>
                <div className="text-xs text-gray-400 mt-1">Share these with the guest to access their account later.</div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={starting}
              className="w-full py-3 rounded-xl font-gaming font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: `linear-gradient(135deg, ${colors}, ${colors}aa)`,
                color: '#000',
                boxShadow: `0 0 20px ${colors}44`,
              }}
            >
              <FiPlay size={16} />
              {starting ? 'Starting...' : `Start ${duration}-Min Session`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TimersPage() {
  const [consoles, setConsoles] = useState<Console[]>([]);

  useEffect(() => {
    const unsub = subscribeConsoles(setConsoles);
    return () => unsub();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-gaming font-bold text-2xl text-white mb-1">SESSION TIMERS</h1>
        <p className="text-gray-400 text-sm">Start and manage gaming sessions. Create guest accounts for walk-in customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {consoles.map((con) => (
          <ConsoleTimerCard key={con.id} con={con} />
        ))}
      </div>

      {consoles.length === 0 && (
        <div className="text-center py-16 gaming-card rounded-2xl">
          <GiGamepad size={50} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-gaming">No consoles added yet.</p>
          <a href="/admin/consoles" className="inline-block mt-4 btn-neon text-sm">Add Consoles</a>
        </div>
      )}
    </div>
  );
}
