'use client';

import { useEffect, useState } from 'react';
import {
  subscribeAllBookings, subscribeConsoles, getContactMessages,
  updateShopSettings, getShopSettings
} from '@/lib/firestore';
import type { Booking, Console } from '@/types';
import { FiCalendar, FiUsers, FiClock, FiMail, FiZap, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { GiGamepad, GiTrophy } from 'react-icons/gi';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [shopOpen, setShopOpen] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const unsub1 = subscribeAllBookings(setBookings);
    const unsub2 = subscribeConsoles(setConsoles);
    getShopSettings().then((s) => { if (s) setShopOpen(s.isOpen); });
    getContactMessages().then((msgs) => {
      setUnreadMessages(msgs.filter((m) => m.status === 'new').length);
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const toggleShop = async () => {
    setToggling(true);
    try {
      const newState = !shopOpen;
      await updateShopSettings({ isOpen: newState });
      setShopOpen(newState);
      toast.success(`Shop is now ${newState ? 'OPEN ✅' : 'CLOSED 🔒'}`);
    } catch {
      toast.error('Failed to update shop status');
    } finally {
      setToggling(false);
    }
  };

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const active = bookings.filter((b) => b.status === 'active').length;
  const today = bookings.filter((b) => {
    const d = b.createdAt?.toDate();
    return d && new Date().toDateString() === d.toDateString();
  }).length;

  const stats = [
    { label: 'Pending Bookings', value: pending, icon: FiClock, color: '#f59e0b', href: '/admin/bookings' },
    { label: "Today's Bookings", value: today, icon: FiCalendar, color: '#00d4ff', href: '/admin/bookings' },
    { label: 'Active Sessions', value: active, icon: FiZap, color: '#00ff88', href: '/admin/timers' },
    { label: 'New Messages', value: unreadMessages, icon: FiMail, color: '#7c3aed', href: '/admin/messages' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-gaming font-bold text-2xl text-white">DASHBOARD</h1>
        <div className="text-xs text-gray-500 font-gaming">{new Date().toDateString()}</div>
      </div>

      {/* Shop Toggle — BIG and prominent */}
      <div
        className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
          shopOpen
            ? 'border-neon-green bg-neon-green/5'
            : 'border-red-500/50 bg-red-500/5'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-gaming font-bold text-xl text-white mb-1 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${shopOpen ? 'bg-neon-green animate-pulse' : 'bg-red-400'}`} />
              SHOP STATUS: {shopOpen ? 'OPEN' : 'CLOSED'}
            </div>
            <p className="text-gray-400 text-sm">
              {shopOpen
                ? 'Bookings are enabled. Customers can book slots online.'
                : 'Bookings are disabled. No online bookings allowed.'}
            </p>
          </div>
          <button
            onClick={toggleShop}
            disabled={toggling}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-gaming font-bold text-lg transition-all duration-300 min-w-[180px] justify-center ${
              shopOpen
                ? 'bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30'
                : 'bg-neon-green/20 border-2 border-neon-green text-neon-green hover:bg-neon-green/30'
            }`}
          >
            {shopOpen ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
            {toggling ? 'Updating...' : shopOpen ? 'CLOSE SHOP' : 'OPEN SHOP'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
          >
            <Link href={stat.href} className="block gaming-card rounded-xl p-4 hover:border-opacity-60 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}33` }}
                >
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                {stat.value > 0 && (
                  <span
                    className="text-xs font-gaming font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${stat.color}22`, color: stat.color }}
                  >
                    {stat.value}
                  </span>
                )}
              </div>
              <div className="font-gaming font-black text-2xl text-white">{stat.value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{stat.label}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Console Status */}
      <div className="gaming-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-gaming font-bold text-white">CONSOLE STATUS</h2>
          <Link href="/admin/consoles" className="text-xs text-neon-green hover:underline font-gaming">
            Manage →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {consoles.map((con) => (
            <div
              key={con.id}
              className="rounded-xl p-4 border transition-all"
              style={{
                borderColor: con.timerActive ? '#ef444433' : con.status === 'available' ? '#00ff8833' : '#f59e0b33',
                background: con.timerActive ? 'rgba(239,68,68,0.05)' : 'rgba(0,255,136,0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-gaming font-bold text-white text-sm">{con.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded font-gaming uppercase ${
                  con.timerActive ? 'text-red-400 bg-red-500/20' :
                  con.status === 'available' ? 'text-neon-green bg-neon-green/20' :
                  'text-yellow-400 bg-yellow-500/20'
                }`}>
                  {con.timerActive ? 'IN USE' : con.status}
                </span>
              </div>
              <div className="text-gray-400 text-xs">{con.games.length} games</div>
              <Link href="/admin/timers" className="text-xs text-neon-green mt-2 block hover:underline">
                {con.timerActive ? 'View Timer →' : 'Start Timer →'}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="gaming-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-gaming font-bold text-white">RECENT BOOKINGS</h2>
          <Link href="/admin/bookings" className="text-xs text-neon-green hover:underline font-gaming">
            View All →
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-gaming text-sm">No bookings yet</div>
        ) : (
          <div className="space-y-2">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-surface border border-dark-border">
                <GiGamepad size={18} className="text-neon-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{booking.userName}</div>
                  <div className="text-gray-400 text-xs">{booking.consoleName} · {booking.duration}min</div>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded font-gaming uppercase ${
                    booking.status === 'pending' ? 'text-yellow-400 bg-yellow-500/20' :
                    booking.status === 'approved' || booking.status === 'active' ? 'text-neon-green bg-neon-green/20' :
                    'text-gray-400 bg-gray-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Start Timer', href: '/admin/timers', icon: FiClock, color: '#00ff88' },
          { label: 'Add Event', href: '/admin/events', icon: GiTrophy, color: '#7c3aed' },
          { label: 'Manage Users', href: '/admin/users', icon: FiUsers, color: '#00d4ff' },
          { label: 'Settings', href: '/admin/settings', icon: FiZap, color: '#ff00ff' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="gaming-card rounded-xl p-4 text-center hover:scale-105 transition-all group"
          >
            <action.icon size={22} className="mx-auto mb-2" style={{ color: action.color }} />
            <div className="text-xs font-gaming text-gray-300 group-hover:text-white transition-colors">{action.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
