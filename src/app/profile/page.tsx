'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, getUserProfile, updateUserProfile } from '@/lib/firestore';
import type { Booking } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiClock, FiEdit2, FiSave, FiX,
  FiCalendar, FiAward, FiActivity
} from 'react-icons/fi';
import { GiGamepad, GiTrophy } from 'react-icons/gi';

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#00d4ff',
  active: '#00ff88',
  completed: '#7c3aed',
  cancelled: '#ef4444',
  rejected: '#ef4444',
};

export default function ProfilePage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'bookings' | 'events'>('bookings');

  useEffect(() => {
    if (!loading && !user) { router.push('/auth/login'); return; }
    if (user) {
      getUserBookings(user.uid).then(setBookings);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.displayName);
      setEditPhone(userProfile.phone);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { displayName: editName, phone: editPhone });
      await refreshProfile();
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-neon-green font-gaming animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !userProfile) return null;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="gaming-card rounded-2xl overflow-hidden mb-6 border border-dark-border">
          <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple" />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-neon-green/20 border-2 border-neon-green/40 flex items-center justify-center overflow-hidden">
                  {userProfile.photoURL ? (
                    <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <GiGamepad size={36} className="text-neon-green" />
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-bg ${
                  userProfile.role === 'admin' ? 'bg-neon-purple' : 'bg-neon-green'
                }`} />
              </div>

              {/* Info */}
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-2 mb-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-neon text-sm py-2"
                      placeholder="Display Name"
                    />
                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="input-neon text-sm py-2"
                      placeholder="Phone Number"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="font-gaming font-bold text-xl text-white">{userProfile.displayName}</h1>
                    <div className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                      <FiMail size={13} /> {userProfile.email}
                    </div>
                    {userProfile.phone && (
                      <div className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                        <FiPhone size={13} /> {userProfile.phone}
                      </div>
                    )}
                  </>
                )}

                {/* Reg No */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                  <span className="text-xs text-gray-400 font-gaming">REG NO:</span>
                  <span className="text-neon-green font-gaming font-bold text-sm">{userProfile.regNo}</span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="btn-neon text-xs px-3 py-2 flex items-center gap-1">
                      <FiSave size={13} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-outline-neon text-xs px-3 py-2 flex items-center gap-1">
                      <FiX size={13} /> Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-outline-neon text-xs px-3 py-2 flex items-center gap-1">
                    <FiEdit2 size={13} /> Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: GiGamepad, label: 'Total Sessions', value: userProfile.totalSessions, color: '#00ff88' },
            { icon: FiClock, label: 'Hours Played', value: `${userProfile.totalHours}h`, color: '#00d4ff' },
            { icon: GiTrophy, label: 'Events Won', value: userProfile.eventsWon, color: '#7c3aed' },
            { icon: FiAward, label: 'Tournaments', value: userProfile.eventsRegistered, color: '#ff00ff' },
          ].map((stat) => (
            <div key={stat.label} className="gaming-card rounded-xl p-4 text-center">
              <stat.icon size={22} className="mx-auto mb-2" style={{ color: stat.color }} />
              <div className="font-gaming font-black text-xl" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['bookings', 'events'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-gaming text-xs uppercase tracking-wider transition-all ${
                tab === t
                  ? 'bg-neon-green/15 border border-neon-green text-neon-green'
                  : 'border border-dark-border text-gray-400 hover:border-gray-600'
              }`}
            >
              {t === 'bookings' ? '🎮 My Bookings' : '🏆 My Events'}
            </button>
          ))}
        </div>

        {/* Bookings History */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-16 gaming-card rounded-2xl">
                <GiGamepad size={50} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-gaming">No bookings yet.</p>
                <a href="/#consoles" className="inline-block mt-4 btn-neon text-sm">Book a Session</a>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="gaming-card rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-surface flex items-center justify-center flex-shrink-0">
                    <GiGamepad size={20} className="text-neon-green" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{booking.consoleName}</div>
                    <div className="text-gray-400 text-xs flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <FiClock size={11} /> {booking.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar size={11} />
                        {booking.createdAt ? format(booking.createdAt.toDate(), 'dd MMM yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-gaming font-bold text-sm text-neon-green">Rs. {booking.amount}</span>
                    <span
                      className="text-xs px-2 py-1 rounded font-gaming uppercase tracking-wider"
                      style={{
                        color: statusColors[booking.status] || '#fff',
                        background: `${statusColors[booking.status]}22`,
                        border: `1px solid ${statusColors[booking.status]}44`,
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'events' && (
          <div className="text-center py-16 gaming-card rounded-2xl">
            <GiTrophy size={50} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-gaming">No tournament history yet.</p>
            <a href="/events" className="inline-block mt-4 btn-purple text-sm">View Tournaments</a>
          </div>
        )}
      </div>
    </div>
  );
}
                                                                                                                                                                                                                        