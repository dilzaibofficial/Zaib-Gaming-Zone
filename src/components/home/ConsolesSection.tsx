'use client';

import { useEffect, useState } from 'react';
import { subscribeConsoles } from '@/lib/firestore';
import { useShop } from '@/contexts/ShopContext';
import type { Console } from '@/types';
import ConsoleCard from '@/components/ConsoleCard';
import { GiGamepad } from 'react-icons/gi';

const DEFAULT_CONSOLES: Console[] = [
  {
    id: 'ps5-main', name: 'PlayStation 5', type: 'PS5', order: 1, status: 'available',
    pricePerHour: 400, pricePerHalfHour: 250, timerActive: false,
    games: [
      { id: 'g1', name: 'FC 25', genre: 'Sports' },
      { id: 'g2', name: 'God of War: Ragnarök', genre: 'Action' },
      { id: 'g3', name: 'Spider-Man 2', genre: 'Action' },
      { id: 'g4', name: 'GTA V Enhanced', genre: 'Open World' },
      { id: 'g5', name: 'Mortal Kombat 1', genre: 'Fighting' },
      { id: 'g6', name: 'Call of Duty: MW3', genre: 'Shooter' },
    ],
    description: 'The ultimate next-gen console with 4K gaming at 120fps.',
  },
  {
    id: 'ps4-1', name: 'PlayStation 4 — Station 1', type: 'PS4', order: 2, status: 'available',
    pricePerHour: 200, pricePerHalfHour: 120, timerActive: false,
    games: [
      { id: 'g7', name: 'FIFA 23', genre: 'Sports' },
      { id: 'g8', name: 'GTA V', genre: 'Open World' },
      { id: 'g9', name: 'Tekken 7', genre: 'Fighting' },
      { id: 'g10', name: 'WWE 2K23', genre: 'Sports' },
      { id: 'g11', name: 'Minecraft', genre: 'Sandbox' },
    ],
    description: 'Premium PS4 gaming with a massive library of titles.',
  },
  {
    id: 'ps4-2', name: 'PlayStation 4 — Station 2', type: 'PS4', order: 3, status: 'available',
    pricePerHour: 200, pricePerHalfHour: 120, timerActive: false,
    games: [
      { id: 'g12', name: 'Mortal Kombat 11', genre: 'Fighting' },
      { id: 'g13', name: 'Rocket League', genre: 'Sports' },
      { id: 'g14', name: 'Crash Bandicoot', genre: 'Platformer' },
      { id: 'g15', name: 'NBA 2K24', genre: 'Sports' },
      { id: 'g16', name: 'Red Dead Redemption 2', genre: 'Open World' },
    ],
    description: 'Second PS4 station with a unique mix of action and sports games.',
  },
];

export default function ConsolesSection() {
  const { settings } = useShop();
  const [consoles, setConsoles] = useState<Console[]>(DEFAULT_CONSOLES);

  useEffect(() => {
    const unsub = subscribeConsoles((data) => {
      if (data.length > 0) setConsoles(data);
    });
    return () => unsub();
  }, []);

  return (
    <section id="consoles" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-tag justify-center">
            <GiGamepad /> Our Consoles
          </div>
          <h2 className="font-gaming font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            CHOOSE YOUR <span className="gradient-text">BATTLESTATION</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Pick your console, see what games are available, and book your session instantly.
          </p>
          {!settings.isOpen && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
              ⚠️ Shop is currently closed. Bookings are disabled.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consoles.map((console_) => (
            <ConsoleCard key={console_.id} console={console_} shopOpen={settings.isOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
