import { Timestamp } from 'firebase/firestore';

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  photoURL: string;
  regNo: string;
  role: 'admin' | 'user' | 'guest';
  isGuest: boolean;
  guestPassword?: string | null;
  totalSessions: number;
  totalHours: number;
  eventsWon: number;
  eventsRegistered: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── CONSOLE ──────────────────────────────────────────────────────────────────

export interface ConsoleGame {
  id: string;
  name: string;
  genre?: string;
  coverUrl?: string;
}

export interface Console {
  id: string;
  name: string;             // e.g. "PS5", "PS4 #1", "PS4 #2"
  type: 'PS5' | 'PS4' | 'VR' | 'PC' | 'Other';
  order: number;
  status: 'available' | 'occupied' | 'maintenance';
  games: ConsoleGame[];
  pricePerHour: number;
  pricePerHalfHour: number;
  timerActive: boolean;
  timerEndTime?: Timestamp | null;
  timerDuration?: number | null;
  timerUserId?: string | null;
  imageUrl?: string;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ─── BOOKING ──────────────────────────────────────────────────────────────────

export type BookingDuration = 30 | 60 | 90 | 120 | 150 | 180 | 240;
export type BookingStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected';

export interface Booking {
  id: string;
  consoleId: string;
  consoleName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRegNo: string;
  duration: BookingDuration;       // 30 or 60 mins
  scheduledTime?: Timestamp | null; // for future bookings
  isImmediate: boolean;            // walk-in
  status: BookingStatus;
  amount: number;
  isGuest: boolean;
  notes?: string;
  approvedAt?: Timestamp | null;
  startedAt?: Timestamp | null;
  endedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventRule {
  id: string;
  rule: string;
}

export interface EventPrize {
  position: string;
  prize: string;
}

export interface Event {
  id: string;
  title: string;
  game: string;
  description: string;
  date: Timestamp;
  time: string;
  entryFee: number;
  maxParticipants: number;
  registeredCount: number;
  rules: EventRule[];
  prizes: EventPrize[];
  status: EventStatus;
  imageUrl?: string;
  consoleType?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EventRegistration {
  id?: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  regNo: string;
  status: 'pending' | 'confirmed' | 'winner' | 'rejected';
  registeredAt: Timestamp;
}

// ─── SHOP SETTINGS ────────────────────────────────────────────────────────────

export interface ShopSettings {
  isOpen: boolean;
  shopName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  mapEmbedUrl: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  openHours: string;
  announcement?: string;
  updatedAt?: Timestamp;
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt?: Timestamp;
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
