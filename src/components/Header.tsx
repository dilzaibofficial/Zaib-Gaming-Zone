'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useShop } from '@/contexts/ShopContext';
import { logOut } from '@/lib/auth';
import toast from 'react-hot-toast';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiSettings,
  FiZap, FiShield
} from 'react-icons/fi';
import { GiGamepad } from 'react-icons/gi';

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Consoles', href: '/#consoles' },
  { label: 'Events',   href: '/events' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

export default function Header() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { user, userProfile, isAdmin } = useAuth();
  const { settings } = useShop();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await logOut();
    toast.success('Signed out successfully');
    router.push('/');
    setDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-dark-bg/95 backdrop-blur-md border-b border-dark-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Announcement bar */}
      {settings.announcement && (
        <div className="bg-neon-green/10 border-b border-neon-green/20 py-1.5 text-center text-xs text-neon-green font-gaming tracking-wider">
          <FiZap className="inline mr-1" size={11} />
          {settings.announcement}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <GiGamepad size={30} className="text-neon-green" />
            <div>
              <span className="font-gaming font-bold text-lg text-white tracking-wider">ZAIB</span>
              <span className="font-gaming font-bold text-lg text-neon-green ml-1.5 tracking-wider">GAMING</span>
              <div className="text-[9px] text-gray-500 font-gaming tracking-[0.3em] -mt-0.5 uppercase">Zone</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 font-semibold text-sm tracking-wide rounded transition-colors duration-150 font-body ${
                  pathname === link.href
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Shop status */}
            <div className={`flex items-center gap-1.5 text-xs font-gaming px-3 py-1 rounded-full border ${
              settings.isOpen
                ? 'border-neon-green/30 bg-neon-green/10 text-neon-green'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}>
              <span className={`status-dot ${settings.isOpen ? 'online' : 'offline'}`} />
              {settings.isOpen ? 'OPEN' : 'CLOSED'}
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dark-border hover:border-neon-green/40 transition-colors duration-150 bg-dark-card"
                >
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <FiUser className="text-neon-green" size={15} />
                  )}
                  <span className="text-sm text-white font-semibold max-w-[100px] truncate">
                    {userProfile?.displayName || user.email}
                  </span>
                  {isAdmin && <FiShield size={12} className="text-neon-purple" />}
                </button>

                {/* Dropdown — CSS only, no framer-motion */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 gaming-card rounded-lg overflow-hidden z-50 border border-dark-border shadow-xl">
                    <div className="px-4 py-3 border-b border-dark-border">
                      <div className="text-xs text-gray-500">Reg No</div>
                      <div className="text-neon-green font-gaming text-xs">{userProfile?.regNo || '—'}</div>
                    </div>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <FiUser size={14} /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-neon-purple hover:bg-neon-purple/10 transition-colors">
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"  className="btn-outline-neon text-xs px-4 py-2">Login</Link>
                <Link href="/auth/signup" className="btn-neon text-xs px-4 py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — CSS transition, no framer-motion */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } bg-dark-bg/98 backdrop-blur-md border-b border-dark-border`}>
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                pathname === link.href
                  ? 'text-neon-green bg-neon-green/10'
                  : 'text-gray-300 hover:text-neon-green hover:bg-neon-green/5'
              }`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-dark-border flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="btn-outline-neon text-center text-sm">My Profile</Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="btn-purple text-center text-sm">Admin Panel</Link>
                )}
                <button onClick={handleSignOut} className="text-red-400 text-sm py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login"  onClick={() => setMenuOpen(false)} className="btn-outline-neon text-center text-sm">Login</Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="btn-neon text-center text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
