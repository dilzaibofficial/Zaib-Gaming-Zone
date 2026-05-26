'use client';

import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiCalendar } from 'react-icons/fi';
import { GiGamepad, GiTrophy } from 'react-icons/gi';
import { useShop } from '@/contexts/ShopContext';

export default function HeroSection() {
  const { settings } = useShop();
  const isOpen = settings?.isOpen ?? false;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 65%), #09090b',
      }} />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #09090b)' }} />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-gaming tracking-widest mb-8"
          style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.08)', color: '#818cf8' }}>
          <FiMapPin size={11} />
          SAMWOOD MALL · CLIFTON BLOCK 2 · KARACHI
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: isOpen ? '#22c55e' : '#ef4444' }} />
        </div>

        {/* Main heading */}
        <h1 className="font-gaming font-black leading-none mb-6">
          <span className="block text-white" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}>
            ZAIB GAMING
          </span>
          <span
            className="block"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
              background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ZONE
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-body">
          Clifton's premier PS5 &amp; PS4 gaming cafe — book a session online and walk in ready to play.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
          <a
            href="#consoles"
            className="btn-neon flex items-center gap-2 text-sm min-w-[190px] justify-center"
          >
            <GiGamepad size={16} />
            Book a Session
            <FiArrowRight size={13} />
          </a>
          <Link
            href="/events"
            className="btn-outline-neon flex items-center gap-2 text-sm min-w-[190px] justify-center"
          >
            <GiTrophy size={14} />
            View Tournaments
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: '🎮', text: 'PS5 & PS4' },
            { icon: '📅', text: 'Online Booking' },
            { icon: '🏆', text: 'Tournaments' },
            { icon: '⚡', text: 'Walk-ins Welcome' },
            { icon: '🎧', text: 'Private Rooms' },
          ].map((f) => (
            <span
              key={f.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 font-gaming tracking-wide"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
            >
              <span>{f.icon}</span>
              {f.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20">
        <span className="text-[10px] text-slate-600 font-gaming tracking-widest">SCROLL</span>
        <div className="w-px h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }} />
      </div>
    </section>
  );
}
