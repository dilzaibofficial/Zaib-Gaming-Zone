'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import type { AppNotification } from '@/lib/notifications';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiCalendar, FiZap } from 'react-icons/fi';

const TYPE_CONFIG = {
  booking_new:       { icon: FiCalendar,    color: '#f59e0b', label: 'New Booking' },
  booking_confirmed: { icon: FiCheck,       color: '#22c55e', label: 'Confirmed'   },
  booking_rejected:  { icon: FiAlertCircle, color: '#ef4444', label: 'Rejected'    },
  booking_completed: { icon: FiCheck,       color: '#6366f1', label: 'Completed'   },
  event_new:         { icon: FiZap,         color: '#a78bfa', label: 'New Event'   },
  general:           { icon: FiInfo,        color: '#6366f1', label: 'Notice'      },
};

function Toast({ notif, onDone }: { notif: AppNotification; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.general;
  const Icon = cfg.icon;

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 20);
    // Start leaving after 3 s
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(onDone, 300);
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(onDone, 300);
  };

  return (
    <div
      className="notif-toast rounded-2xl p-4 w-80 pointer-events-auto"
      style={{
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible && !leaving ? 1 : 0,
      }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
        <div
          className="h-full rounded-b-2xl"
          style={{
            background: cfg.color,
            animation: leaving ? 'none' : 'progressBar 3.2s linear forwards',
          }}
        />
      </div>

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}
        >
          <Icon size={16} style={{ color: cfg.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span
              className="text-xs font-gaming font-bold uppercase tracking-wider"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-white transition-colors ml-2 flex-shrink-0"
            >
              <FiX size={13} />
            </button>
          </div>
          <p className="text-white text-sm font-semibold leading-snug">{notif.title}</p>
          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function NotificationToast() {
  const { queue, dismiss } = useNotifications();

  return (
    <div
      className="fixed top-20 right-4 z-[200] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      {queue.map((notif) => (
        <Toast key={notif.id} notif={notif} onDone={() => dismiss(notif.id)} />
      ))}
    </div>
  );
}
