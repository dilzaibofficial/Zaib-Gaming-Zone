'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createBooking, getApprovedBookingsForConsole } from '@/lib/firestore';
import { createNotification } from '@/lib/notifications';
import { Timestamp } from 'firebase/firestore';
import type { Booking, Console } from '@/types';
import toast from 'react-hot-toast';
import { FiX, FiClock, FiUser, FiCheck, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';
import Link from 'next/link';

interface Props {
  console: Console;
  onClose: () => void;
}

const DURATIONS = [
  { value: 30,  label: '30 min' },
  { value: 60,  label: '1 hr'   },
  { value: 90,  label: '1.5 hr' },
  { value: 120, label: '2 hrs'  },
  { value: 150, label: '2.5 hr' },
  { value: 180, label: '3 hrs'  },
  { value: 240, label: '4 hrs'  },
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const totalMins = 12 * 60 + i * 30;
  if (totalMins >= 24 * 60) return null;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return {
    value: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
    label: `${h12}:${String(m).padStart(2,'0')} ${ampm}`,
  };
}).filter(Boolean) as { value: string; label: string }[];

function calcPrice(con: Console, durationMins: number) {
  return Math.round((durationMins / 30) * con.pricePerHalfHour);
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={accent ? 'font-gaming font-bold text-indigo-400' : 'text-white font-medium'}>{value}</span>
    </div>
  );
}

export default function BookingModal({ console: con, onClose }: Props) {
  const { user, userProfile } = useAuth();
  const [duration, setDuration]     = useState(60);
  const [timeSlot, setTimeSlot]     = useState('');
  const [bookDate, setBookDate]     = useState('');
  const [guestName,  setGuestName]  = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [approvedBookings, setApprovedBookings] = useState<Booking[]>([]);
  const [conflictError, setConflictError] = useState('');

  const price = calcPrice(con, duration);
  const today = new Date().toISOString().split('T')[0];

  // Load approved bookings to detect conflicts
  useEffect(() => {
    getApprovedBookingsForConsole(con.id).then(setApprovedBookings);
  }, [con.id]);

  // Build set of booked slot values for current date + duration
  const bookedSlots = new Set<string>();
  if (bookDate) {
    approvedBookings.forEach((b) => {
      if (!b.scheduledTime) return;
      const bStart = b.scheduledTime.toMillis();
      const bEnd   = bStart + b.duration * 60 * 1000;
      // Mark any TIME_SLOT that overlaps with [bStart, bEnd)
      TIME_SLOTS.forEach((slot) => {
        const slotDate = new Date(`${bookDate}T${slot.value}:00`);
        if (isNaN(slotDate.getTime())) return;
        const slotStart = slotDate.getTime();
        const slotEnd   = slotStart + duration * 60 * 1000;
        if (slotStart < bEnd && bStart < slotEnd) {
          bookedSlots.add(slot.value);
        }
      });
    });
  }

  // Clear conflict error when user changes slot
  useEffect(() => { setConflictError(''); }, [timeSlot, bookDate, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && (!guestName || !guestPhone)) {
      toast.error('Please enter your name and phone number');
      return;
    }
    setLoading(true);
    setConflictError('');
    try {
      let scheduledTime: Timestamp | null = null;
      if (bookDate && timeSlot) {
        const dt = new Date(`${bookDate}T${timeSlot}:00`);
        if (!isNaN(dt.getTime())) scheduledTime = Timestamp.fromDate(dt);
      }

      // Conflict check for scheduled bookings
      if (scheduledTime) {
        const propStart = scheduledTime.toMillis();
        const propEnd   = propStart + duration * 60 * 1000;
        const conflict  = approvedBookings.find((b) => {
          if (!b.scheduledTime) return false;
          const bStart = b.scheduledTime.toMillis();
          const bEnd   = bStart + b.duration * 60 * 1000;
          return propStart < bEnd && bStart < propEnd;
        });
        if (conflict) {
          setConflictError(`This time slot is already booked. Please choose a different time.`);
          setLoading(false);
          return;
        }
      }

      const userName  = user ? (userProfile?.displayName || user.displayName || user.email || 'User') : guestName;
      const userEmail = user ? (user.email || '') : guestEmail;
      const userPhone = user ? (userProfile?.phone || '') : guestPhone;
      const userRegNo = user ? (userProfile?.regNo || '') : 'GUEST';

      await createBooking({
        consoleId:   con.id,
        consoleName: con.name,
        userId:      user?.uid || `guest_${Date.now()}`,
        userName,
        userEmail,
        userPhone,
        userRegNo,
        duration:    duration as any,
        scheduledTime,
        isImmediate: !scheduledTime,
        status:      'pending',
        amount:      price,
        isGuest:     !user,
        notes,
      });

      // Real-time notification to admin
      await createNotification({
        type:         'booking_new',
        title:        `New booking — ${con.name}`,
        message:      `${userName} · ${DURATIONS.find(d => d.value === duration)?.label} · Rs. ${price}${scheduledTime ? ` · ${bookDate} ${timeSlot}` : ' · Walk-in'}`,
        forAdmin:     true,
        targetUserId: null,
      });

      setSuccess(true);
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="gaming-card rounded-2xl w-full max-w-md relative overflow-hidden"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 flex-shrink-0" />

        {/* Header */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
              <GiGamepad size={18} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-white text-sm tracking-wide">BOOK A SESSION</h3>
              <p className="text-gray-400 text-xs">{con.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <FiX size={16} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-500/12 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
              <FiCheck size={26} className="text-green-400" />
            </div>
            <h4 className="font-gaming font-bold text-white text-lg mb-2">REQUEST SENT!</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Admin will call you for payment confirmation, then approve your booking. Real-time notification coming your way!
            </p>
            <div className="card-flat rounded-xl p-4 mb-5 space-y-2.5 text-left">
              <Row label="Console"  value={con.name} />
              <Row label="Duration" value={DURATIONS.find(d => d.value === duration)?.label ?? `${duration} min`} accent />
              {bookDate && timeSlot && <Row label="Scheduled" value={`${bookDate} at ${timeSlot}`} />}
              <Row label="Amount"   value={`Rs. ${price}`} accent />
            </div>
            <button onClick={onClose} className="btn-neon w-full">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Duration selector */}
            <div>
              <label className="text-xs font-gaming text-gray-400 uppercase tracking-widest mb-2.5 block">Duration</label>
              <div className="grid grid-cols-4 gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className="py-2.5 px-1 rounded-xl text-center transition-all duration-150"
                    style={{
                      border:     duration === d.value ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      background: duration === d.value ? 'rgba(99,102,241,0.12)' : 'transparent',
                    }}
                  >
                    <div className={`text-xs font-gaming font-bold leading-tight ${duration === d.value ? 'text-indigo-300' : 'text-gray-400'}`}>
                      {d.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">Rs.{calcPrice(con, d.value)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule (optional) */}
            <div>
              <label className="text-xs font-gaming text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <FiCalendar size={10} />
                Schedule &nbsp;<span className="normal-case font-body text-gray-600 tracking-normal">(optional — leave blank for walk-in)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" min={today} value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)} className="input-neon text-sm py-2.5" />
                <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
                  className="input-neon text-sm py-2.5" disabled={!bookDate}>
                  <option value="">Pick time…</option>
                  {TIME_SLOTS.map((s) => {
                    const isBooked = bookedSlots.has(s.value);
                    return (
                      <option key={s.value} value={s.value} disabled={isBooked}>
                        {s.label}{isBooked ? ' — Booked' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* User */}
            {user ? (
              <div className="card-flat rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center">
                  <FiUser size={15} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{userProfile?.displayName || user.email}</div>
                  {userProfile?.regNo && <div className="text-indigo-400 text-xs font-gaming">{userProfile.regNo}</div>}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-gaming text-gray-400 uppercase tracking-widest">Guest Info</label>
                  <Link href="/auth/login" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Login →
                  </Link>
                </div>
                <input type="text" placeholder="Your Name *" value={guestName}
                  onChange={(e) => setGuestName(e.target.value)} className="input-neon" required />
                <div className="grid grid-cols-2 gap-2">
                  <input type="tel" placeholder="Phone *" value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)} className="input-neon" required />
                  <input type="email" placeholder="Email" value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)} className="input-neon" />
                </div>
              </div>
            )}

            {/* Notes */}
            <textarea placeholder="Special requests (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)} className="input-neon resize-none text-sm" rows={2} />

            {/* Summary */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Total Amount</span>
                <span className="font-gaming font-black text-white text-2xl">Rs. {price}</span>
              </div>
              <p className="text-xs text-gray-500">Pay to admin after confirmation call.</p>
            </div>

            {conflictError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                <FiAlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                {conflictError}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2">
              {loading
                ? <span className="animate-pulse font-gaming tracking-wider">Sending…</span>
                : <><FiClock size={14} /> Send Booking Request</>
              }
            </button>

            <p className="text-xs text-gray-600 text-center">
              Admin approves after payment — slot not confirmed until then.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
