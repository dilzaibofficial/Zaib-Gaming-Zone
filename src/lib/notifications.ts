import {
  collection, addDoc, query, orderBy, limit,
  onSnapshot, Timestamp, where,
} from 'firebase/firestore';
import { db } from './firebase';

export type NotifType =
  | 'booking_new'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'booking_completed'
  | 'event_new'
  | 'general';

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  targetUserId?: string | null; // null = show to admin + everyone
  forAdmin: boolean;
  createdAt: Timestamp;
}

// Create a notification in Firestore
export async function createNotification(data: Omit<AppNotification, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'notifications'), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

// Subscribe to notifications for a specific user (+ global ones)
// Shows last 10 notifications from the past 10 minutes
export function subscribeUserNotifications(
  userId: string | null,
  isAdmin: boolean,
  callback: (notifs: AppNotification[]) => void,
) {
  const tenMinutesAgo = Timestamp.fromMillis(Date.now() - 10 * 60 * 1000);

  let q;
  if (isAdmin) {
    // Admin sees all notifications
    q = query(
      collection(db, 'notifications'),
      where('createdAt', '>=', tenMinutesAgo),
      orderBy('createdAt', 'desc'),
      limit(10),
    );
  } else if (userId) {
    // User sees their own + event notifications
    q = query(
      collection(db, 'notifications'),
      where('createdAt', '>=', tenMinutesAgo),
      where('targetUserId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(8),
    );
  } else {
    // Not logged in — only global/event notifications
    q = query(
      collection(db, 'notifications'),
      where('createdAt', '>=', tenMinutesAgo),
      where('type', '==', 'event_new'),
      orderBy('createdAt', 'desc'),
      limit(5),
    );
  }

  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AppNotification[];
    callback(notifs);
  });
}
