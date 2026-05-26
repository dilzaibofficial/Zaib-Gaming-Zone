'use client';

import { useEffect, useState } from 'react';
import { subscribeEvents, registerForEvent } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import type { Event } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  FiCalendar, FiUsers, FiDollarSign, FiAward, FiChevronDown, FiChevronUp, FiArrowRight
} from 'react-icons/fi';
import { GiTrophy, GiSwordman } from 'react-icons/gi';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  upcoming: '#00ff88',
  ongoing: '#00d4ff',
  completed: '#7c3aed',
  cancelled: '#ef4444',
};

function EventCard({ event }: { event: Event }) {
  const { user, userProfile } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const color = statusColors[event.status] || '#00ff88';

  const handleRegister = async () => {
    if (!user || !userProfile) {
      toast.error('Please login to register for events');
      return;
    }
    if (event.registeredCount >= event.maxParticipants) {
      toast.error('Event is full!');
      return;
    }
    setRegistering(true);
    try {
      await registerForEvent(event.id, user.uid, {
        name: userProfile.displayName,
        email: userProfile.email,
        phone: userProfile.phone,
        regNo: userProfile.regNo,
      });
      setRegistered(true);
      toast.success('Registered! Admin will confirm your spot. 🏆');
    } catch (err: any) {
      if (err.code === 'permission-denied' || err.message?.includes('already')) {
        toast.error('You are already registered for this event!');
        setRegistered(true);
      } else {
        toast.error('Registration failed. Try again.');
      }
    } finally {
      setRegistering(false);
    }
  };

  const spotsLeft = event.maxParticipants - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div
      className="gaming-card rounded-2xl overflow-hidden"
      style={{ borderColor: `${color}22` }}
    >
      {/* Header image */}
      {event.imageUrl && (
        <div className="relative h-44 overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #12121e, transparent)' }} />
          <div
            className="absolute top-3 right-3 text-xs font-gaming px-2 py-1 rounded uppercase tracking-wider"
            style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
          >
            {event.status}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {!event.imageUrl && (
              <div
                className="text-xs font-gaming px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-2"
                style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
              >
                {event.status}
              </div>
            )}
            <h3 className="font-gaming font-bold text-white text-base leading-tight">{event.title}</h3>
            <div className="text-sm mt-1" style={{ color }}>{event.game}</div>
          </div>
          {event.consoleType && (
            <div className="text-xs text-gray-400 border border-dark-border rounded px-2 py-1 shrink-0">
              {event.consoleType}
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{event.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center py-2 rounded-lg bg-dark-surface">
            <FiCalendar size={14} className="mx-auto mb-1" style={{ color }} />
            <div className="text-xs text-gray-300 font-semibold">
              {event.date ? format(event.date.toDate(), 'dd MMM') : 'TBD'}
            </div>
            <div className="text-xs text-gray-500">{event.time}</div>
          </div>
          <div className="text-center py-2 rounded-lg bg-dark-surface">
            <FiUsers size={14} className="mx-auto mb-1 text-neon-blue" />
            <div className="text-xs text-gray-300 font-semibold">
              {event.registeredCount}/{event.maxParticipants}
            </div>
            <div className="text-xs text-gray-500">Players</div>
          </div>
          <div className="text-center py-2 rounded-lg bg-dark-surface">
            <FiDollarSign size={14} className="mx-auto mb-1 text-neon-purple" />
            <div className="text-xs text-gray-300 font-semibold">
              {event.entryFee === 0 ? 'FREE' : `Rs. ${event.entryFee}`}
            </div>
            <div className="text-xs text-gray-500">Entry</div>
          </div>
        </div>

        {/* Prizes */}
        {event.prizes && event.prizes.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-dark-surface border border-dark-border">
            <div className="text-xs font-gaming text-neon-green uppercase tracking-widest mb-2 flex items-center gap-1">
              <FiAward size={12} /> Prizes
            </div>
            <div className="space-y-1">
              {event.prizes.map((prize, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{prize.position}</span>
                  <span className="text-white font-semibold">{prize.prize}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules (expandable) */}
        {event.rules && event.rules.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs font-gaming text-gray-400 hover:text-white transition-colors w-full"
            >
              <GiSwordman size={13} />
              Tournament Rules
              {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
            </button>
            {expanded && (
              <ul
                className="mt-2 space-y-1"
              >
                {event.rules.map((rule, i) => (
                  <li key={rule.id || i} className="text-xs text-gray-400 flex items-start gap-2">
                    <span className="text-neon-green mt-0.5 flex-shrink-0">•</span>
                    {rule.rule}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Register Button */}
        {event.status === 'upcoming' && (
          <div>
            {isFull ? (
              <div className="text-center py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-gaming">
                EVENT FULL
              </div>
            ) : registered ? (
              <div className="text-center py-3 rounded-xl border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-gaming flex items-center justify-center gap-2">
                ✓ REGISTERED — PENDING APPROVAL
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="btn-purple w-full flex items-center justify-center gap-2"
              >
                {registering ? 'Registering...' : (
                  <>
                    <GiTrophy size={16} />
                    Register for Tournament
                    {!user && <span className="text-xs opacity-80">(Login required)</span>}
                  </>
                )}
              </button>
            )}
            {spotsLeft > 0 && spotsLeft <= 5 && !isFull && (
              <p className="text-center text-xs text-orange-400 mt-2 font-gaming">
                ⚠️ Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="py-16 text-center gaming-grid relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="section-tag justify-center">
            <GiTrophy /> Tournaments & Events
          </div>
          <h1 className="font-gaming font-black text-4xl sm:text-5xl text-white mb-4">
            COMPETE &amp; <span className="gradient-text-purple">WIN</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Join tournaments, compete against Karachi's best gamers, and win epic prizes!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-gaming uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-neon-green/15 border border-neon-green text-neon-green'
                  : 'border border-dark-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <GiTrophy size={60} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-gaming">No events found.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming tournaments!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
