import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  limit,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Console, Booking, Event, ShopSettings, UserProfile, ContactMessage } from '@/types';

// ─── SHOP SETTINGS ───────────────────────────────────────────────────────────

export const getShopSettings = async (): Promise<ShopSettings | null> => {
  const snap = await getDoc(doc(db, 'settings', 'shop'));
  return snap.exists() ? (snap.data() as ShopSettings) : null;
};

export const updateShopSettings = async (data: Partial<ShopSettings>) => {
  await setDoc(doc(db, 'settings', 'shop'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const subscribeShopSettings = (cb: (s: ShopSettings) => void) => {
  return onSnapshot(doc(db, 'settings', 'shop'), (snap) => {
    if (snap.exists()) cb(snap.data() as ShopSettings);
  });
};

// ─── CONSOLES ────────────────────────────────────────────────────────────────

export const getConsoles = async (): Promise<Console[]> => {
  const snap = await getDocs(query(collection(db, 'consoles'), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Console));
};

export const subscribeConsoles = (cb: (consoles: Console[]) => void) => {
  return onSnapshot(
    query(collection(db, 'consoles'), orderBy('order', 'asc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Console)))
  );
};

export const addConsole = async (data: Omit<Console, 'id'>) => {
  return addDoc(collection(db, 'consoles'), { ...data, createdAt: serverTimestamp() });
};

export const updateConsole = async (id: string, data: Partial<Console>) => {
  await updateDoc(doc(db, 'consoles', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteConsole = async (id: string) => {
  await deleteDoc(doc(db, 'consoles', id));
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const createBooking = async (data: Omit<Booking, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'bookings'), { ...data, createdAt: serverTimestamp() });
};

export const getBookingsByConsole = async (consoleId: string): Promise<Booking[]> => {
  const snap = await getDocs(
    query(collection(db, 'bookings'), where('consoleId', '==', consoleId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

export const subscribeActiveBookings = (consoleId: string, cb: (bookings: Booking[]) => void) => {
  const now = Timestamp.now();
  return onSnapshot(
    query(
      collection(db, 'bookings'),
      where('consoleId', '==', consoleId),
      where('status', 'in', ['active', 'approved']),
    ),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)))
  );
};

export const subscribeAllBookings = (cb: (bookings: Booking[]) => void) => {
  return onSnapshot(
    query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)))
  );
};

export const updateBooking = async (id: string, data: Partial<Booking>) => {
  await updateDoc(doc(db, 'bookings', id), { ...data, updatedAt: serverTimestamp() });
};

/**
 * Returns all approved/active bookings for a console that have a scheduled time.
 * Used to detect conflicts before allowing a new booking.
 */
export const getApprovedBookingsForConsole = async (consoleId: string): Promise<Booking[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'bookings'),
      where('consoleId', '==', consoleId),
      where('status', 'in', ['approved', 'active']),
    )
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Booking))
    .filter((b) => b.scheduledTime != null);
};

/**
 * Check if a proposed booking conflicts with an existing approved booking.
 * Returns the conflicting booking if found, otherwise null.
 */
export const checkBookingConflict = async (
  consoleId: string,
  proposedStart: Timestamp,
  proposedDurationMins: number,
): Promise<Booking | null> => {
  const approved = await getApprovedBookingsForConsole(consoleId);
  const propStart = proposedStart.toMillis();
  const propEnd   = propStart + proposedDurationMins * 60 * 1000;

  for (const b of approved) {
    if (!b.scheduledTime) continue;
    const bStart = b.scheduledTime.toMillis();
    const bEnd   = bStart + b.duration * 60 * 1000;
    // Overlap check: A starts before B ends AND B starts before A ends
    if (propStart < bEnd && bStart < propEnd) {
      return b;
    }
  }
  return null;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const snap = await getDocs(
    query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

// ─── TIMERS ──────────────────────────────────────────────────────────────────

export const startTimer = async (consoleId: string, durationMinutes: number, userId?: string) => {
  const endTime = Timestamp.fromDate(new Date(Date.now() + durationMinutes * 60 * 1000));
  await updateDoc(doc(db, 'consoles', consoleId), {
    timerActive: true,
    timerEndTime: endTime,
    timerDuration: durationMinutes,
    timerUserId: userId || null,
    status: 'occupied',
    updatedAt: serverTimestamp(),
  });
};

export const stopTimer = async (consoleId: string) => {
  await updateDoc(doc(db, 'consoles', consoleId), {
    timerActive: false,
    timerEndTime: null,
    timerDuration: null,
    timerUserId: null,
    status: 'available',
    updatedAt: serverTimestamp(),
  });
};

// ─── EVENTS ──────────────────────────────────────────────────────────────────

export const getEvents = async (): Promise<Event[]> => {
  const snap = await getDocs(query(collection(db, 'events'), orderBy('date', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Event));
};

export const subscribeEvents = (cb: (events: Event[]) => void) => {
  return onSnapshot(
    query(collection(db, 'events'), orderBy('date', 'asc')),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Event)))
  );
};

export const addEvent = async (data: Omit<Event, 'id'>) => {
  return addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp() });
};

export const updateEvent = async (id: string, data: Partial<Event>) => {
  await updateDoc(doc(db, 'events', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteEvent = async (id: string) => {
  await deleteDoc(doc(db, 'events', id));
};

export const registerForEvent = async (
  eventId: string,
  userId: string,
  userData: { name: string; email: string; phone: string; regNo: string }
) => {
  const regRef = doc(db, 'events', eventId, 'registrations', userId);
  await setDoc(regRef, {
    userId,
    ...userData,
    status: 'pending',
    registeredAt: serverTimestamp(),
  });
  // increment count on event
  const eventRef = doc(db, 'events', eventId);
  const eventSnap = await getDoc(eventRef);
  if (eventSnap.exists()) {
    const current = eventSnap.data().registeredCount || 0;
    await updateDoc(eventRef, { registeredCount: current + 1 });
  }
};

export const getUserEventRegistrations = async (userId: string) => {
  const snap = await getDocs(
    query(collection(db, 'eventRegistrations'), where('userId', '==', userId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── USERS ───────────────────────────────────────────────────────────────────

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
};

export const searchUsers = async (field: 'email' | 'phone' | 'regNo', value: string): Promise<UserProfile[]> => {
  const snap = await getDocs(
    query(collection(db, 'users'), where(field, '==', value), limit(10))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────

export const submitContactMessage = async (data: Omit<ContactMessage, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'contact'), { ...data, status: 'new', createdAt: serverTimestamp() });
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const snap = await getDocs(query(collection(db, 'contact'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────

export const getGalleryImages = async () => {
  const snap = await getDoc(doc(db, 'settings', 'gallery'));
  return snap.exists() ? snap.data().images || [] : [];
};

export const updateGallery = async (images: string[]) => {
  await setDoc(doc(db, 'settings', 'gallery'), { images, updatedAt: serverTimestamp() }, { merge: true });
};
