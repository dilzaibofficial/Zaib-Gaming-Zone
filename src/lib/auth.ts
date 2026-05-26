import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Generate unique registration number: ZGZ-XXXX-XXXX
export const generateRegNo = (): string => {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZGZ-${part1}-${part2}`;
};

// Create user document in Firestore
export const createUserDoc = async (
  user: User,
  extraData: { phone?: string; displayName?: string; isGuest?: boolean } = {}
) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const regNo = generateRegNo();
    const guestPassword = extraData.isGuest
      ? Math.random().toString(36).substring(2, 10).toUpperCase()
      : null;

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: extraData.displayName || user.displayName || 'Player',
      phone: extraData.phone || '',
      photoURL: user.photoURL || '',
      regNo,
      role: user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user',
      isGuest: extraData.isGuest || false,
      guestPassword: guestPassword,
      totalSessions: 0,
      totalHours: 0,
      eventsWon: 0,
      eventsRegistered: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return regNo;
  }
  return snap.data()?.regNo;
};

// Email/Password Sign Up
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  phone: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await createUserDoc(cred.user, { phone, displayName: name });
  return cred.user;
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

// Google Sign In
export const signInWithGoogle = async (phone?: string) => {
  const cred = await signInWithPopup(auth, googleProvider);
  await createUserDoc(cred.user, { phone });
  return cred.user;
};

// Create Anonymous/Guest Account (admin use)
export const createGuestAccount = async (label?: string) => {
  const guestEmail = `guest_${uuidv4().substring(0, 8)}@zaiggaming.guest`;
  const guestPassword = Math.random().toString(36).substring(2, 10).toUpperCase();

  // We create a minimal Firestore doc without Firebase Auth for walk-in guests
  const guestId = `guest_${uuidv4().substring(0, 12)}`;
  const regNo = generateRegNo();

  await setDoc(doc(db, 'users', guestId), {
    uid: guestId,
    email: '',
    displayName: label || 'Guest Player',
    phone: '',
    photoURL: '',
    regNo,
    role: 'guest',
    isGuest: true,
    guestPassword,
    totalSessions: 0,
    totalHours: 0,
    eventsWon: 0,
    eventsRegistered: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { guestId, regNo, guestPassword };
};

// Sign Out
export const logOut = () => signOut(auth);

// Check if user is admin
export const isAdmin = (email: string | null) => {
  return email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
};
