'use client';

import { useEffect, useState } from 'react';
import { subscribeAllBookings, updateBooking } from '@/lib/firestore';
import { createNotification } from '@/lib/notifications';
import type { Booking } from '@/types';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiClock, FiUser, FiFilter } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  approved: '#00d4ff',
  active: '#00ff88',
  completed: '#7c3aed',
  cancelled: '#ef4444',
  rejected: '#ef4444',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeAllBookings(setBookings);
    return () => unsub();
  }, []);

  const handleApprove = async (booking: Booking) => {
    setLoading(booking.id);
    try {
      await updateBooking(booking.id, { status: 'approved', approvedAt: Timestamp.now() });
      // Notify user
      if (booking.userId && !booking.isGuest) {
        await createNotification({
          type:         'booking_confirmed',
          title:        'Booking Confirmed! ✅',
          message:      `Your session on ${booking.consoleName} has been approved. See you soon!`,
          forAdmin:     false,
          targetUserId: booking.userId,
        });
      }
      toast.success('Booking approved!');
    } catch {
      toast.error('Failed to approve');
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (booking: Booking) => {
    if (!confirm('Reject this booking?')) return;
    setLoading(booking.id);
    try {
      await updateBooking(booking.id, { status: 'rejected' });
      if (booking.userId && !booking.isGuest) {
        await createNotification({
          type:         'booking_rejected',
          title:        'Booking Not Approved',
          message:      `Your booking for ${booking.consoleName} was not approved. Please contact us for details.`,
          forAdmin:     false,
          targetUserId: booking.userId,
        });
      }
      toast.success('Booking rejected.');
    } catch {
      toast.error('Failed to reject');
    } finally {
      setLoading(null);
    }
  };

  const handleComplete = async (booking: Booking) => {
    setLoading(booking.id);
    try {
      await updateBooking(booking.id, { status: 'completed', endedAt: Timestamp.now() });
      toast.success('Booking marked as completed.');
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-gaming font-bold text-2xl text-white">BOOKINGS</h1>
        <div className="text-sm text-gray-400 font-gaming">
          {bookings.filter((b) => b.status === 'pending').length} pending
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-gaming uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === f
                ? 'bg-neon-green/15 border border-neon-green text-neon-green'
                : 'border border-dark-border text-gray-400 hover:border-gray-500'
            }`}
          >
            <FiFilter size={10} />
            {f} ({f === 'all' ? bookings.length : bookings.filter((b) => b.status === f).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 gaming-card rounded-2xl">
          <GiGamepad size={50} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-gaming">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="gaming-card rounded-xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Console Icon */}
                  <div className="w-10 h-10 rounded-lg bg-neon-green/15 border border-neon-green/30 flex items-center justify-center flex-shrink-0">
                    <GiGamepad size={20} className="text-neon-green" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-gaming font-bold text-white text-sm">{booking.consoleName}</span>
                      <span className="text-xs text-neon-green font-gaming">{booking.duration}min</span>
                      {booking.isGuest && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-gaming">GUEST</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiUser size={11} /> {booking.userName}
                      </span>
                      <span>{booking.userEmail}</span>
                      <span>{booking.userPhone}</span>
                      {booking.userRegNo && <span className="text-neon-green font-gaming">{booking.userRegNo}</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <FiClock size={10} />
                        {booking.createdAt ? format(booking.createdAt.toDate(), 'dd MMM yyyy HH:mm') : 'N/A'}
                      </span>
                      <span className="font-gaming text-neon-green">Rs. {booking.amount}</span>
                    </div>
                    {booking.notes && (
                      <div className="text-xs text-gray-400 mt-1 italic">Note: {booking.notes}</div>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2 py-1 rounded font-gaming uppercase"
                      style={{
                        color: statusColors[booking.status] || '#fff',
                        background: `${statusColors[booking.status]}22`,
                        border: `1px solid ${statusColors[booking.status]}44`,
                      }}
                    >
                      {booking.status}
                    </span>

                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking)}
                          disabled={loading === booking.id}
                          className="w-8 h-8 rounded-lg bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green hover:bg-neon-green/30 transition-all"
                          title="Approve"
                        >
                          <FiCheck size={15} />
                        </button>
                        <button
                          onClick={() => handleReject(booking)}
                          disabled={loading === booking.id}
                          className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all"
                          title="Reject"
                        >
                          <FiX size={15} />
                        </button>
                      </>
                    )}

                    {booking.status === 'approved' && (
                      <button
                        onClick={() => handleComplete(booking)}
                        disabled={loading === booking.id}
                        className="px-3 py-1 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-xs font-gaming hover:bg-neon-purple/30 transition-all"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
