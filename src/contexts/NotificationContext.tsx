'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeUserNotifications, type AppNotification } from '@/lib/notifications';

interface NotifContextType {
  queue: AppNotification[];
  dismiss: (id: string) => void;
}

const NotifContext = createContext<NotifContextType>({ queue: [], dismiss: () => {} });

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [queue, setQueue] = useState<AppNotification[]>([]);
  const seenIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    // Only subscribe if user is logged in OR is admin
    // Unauthenticated users skip this entirely — avoids Firestore permission-denied errors
    if (!user && !isAdmin) {
      firstLoad.current = true;
      seenIds.current = new Set();
      return;
    }

    firstLoad.current = true;

    const unsub = subscribeUserNotifications(
      user?.uid ?? null,
      isAdmin,
      (incoming) => {
        if (firstLoad.current) {
          // On first load, mark all existing as seen — don't flash old notifications
          incoming.forEach((n) => seenIds.current.add(n.id));
          firstLoad.current = false;
          return;
        }
        // Only show truly new ones
        const newOnes = incoming.filter((n) => !seenIds.current.has(n.id));
        if (newOnes.length === 0) return;
        newOnes.forEach((n) => seenIds.current.add(n.id));
        setQueue((prev) => [...prev, ...newOnes]);
      },
    );
    return () => unsub();
  }, [user?.uid, isAdmin]);

  const dismiss = (id: string) => {
    setQueue((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotifContext.Provider value={{ queue, dismiss }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotifications = () => useContext(NotifContext);
