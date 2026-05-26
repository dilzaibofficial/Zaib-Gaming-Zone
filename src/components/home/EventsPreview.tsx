'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { subscribeEvents } from '@/lib/firestore';
import type { Event } from '@/types';
import { GiTrophy } from 'react-icons/gi';
import { FiCalendar, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

export default function EventsPreview() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const unsub = subscribeEvents((data) => {
      setEvents(data.filter((e) => e.status === 'upcoming').slice(0, 3));
    });
    return () => unsub();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-tag justify-center"><GiTrophy /> Upcoming Events</div>
          <h2 className="font-gaming font-bold text-3xl sm:text-4xl text-white mb-4">
            JOIN THE <span className="gradient-text-purple">TOURNAMENT</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Compete, win prizes, and prove you're the best gamer in Karachi!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {events.map((event) => (
            <div key={event.id} className="gaming-card rounded-2xl overflow-hidden group">
              {event.imageUrl && (
                <div className="relative h-36 overflow-hidden">
                  <img src={event.imageUrl} alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-gaming px-2 py-1 rounded bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                    {event.game}
                  </span>
                  <span className="badge-available">OPEN</span>
                </div>
                <h3 className="font-gaming font-bold text-white text-sm mb-3 leading-tight">{event.title}</h3>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={12} className="text-neon-green" />
                    {event.date ? format(event.date.toDate(), 'dd MMM yyyy') : 'TBD'} at {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers size={12} className="text-neon-blue" />
                    {event.registeredCount}/{event.maxParticipants} registered
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDollarSign size={12} className="text-neon-purple" />
                    Entry: Rs. {event.entryFee === 0 ? 'FREE' : event.entryFee}
                  </div>
                </div>
                <Link href="/events"
                  className="mt-4 flex items-center gap-1.5 text-neon-green text-xs font-gaming font-bold hover:gap-3 transition-all duration-150">
                  Register Now <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/events" className="btn-purple inline-flex items-center gap-2">
            <GiTrophy size={16} /> View All Tournaments <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
