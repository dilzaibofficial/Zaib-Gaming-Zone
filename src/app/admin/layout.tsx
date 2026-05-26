'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { GiGamepad } from 'react-icons/gi';
import {
  FiGrid, FiCalendar, FiUsers, FiSettings, FiClock,
  FiImage, FiMail, FiLogOut, FiMenu, FiX, FiZap, FiTrendingUp
} from 'react-icons/fi';
import { logOut } from '@/lib/auth';
import toast from 'react-hot-toast';

const navItems = [
  { label: 'Dashboard',      href: '/admin',          icon: FiGrid },
  { label: 'Timers',         href: '/admin/timers',   icon: FiClock },
  { label: 'Bookings',       href: '/admin/bookings', icon: FiCalendar },
  { label: 'Consoles & Games', href: '/admin/consoles', icon: GiGamepad },
  { label: 'Events',         href: '/admin/events',   icon: FiTrendingUp },
  { label: 'Users',          href: '/admin/users',    icon: FiUsers },
  { label: 'Gallery',        href: '/admin/gallery',  icon: FiImage },
  { label: 'Messages',       href: '/admin/messages', icon: FiMail },
  { label: 'Settings',       href: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Admin access required');
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  // Show spinner only on initial load, not on every nav
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-neon-green font-gaming animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-red-400 font-gaming text-lg">Access denied.</div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-dark-border flex-shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <GiGamepad size={26} className="text-neon-green" />
          <div>
            <div className="font-gaming font-bold text-sm text-white">ZAIB GAMING</div>
            <div className="text-xs text-neon-purple font-gaming tracking-widest">ADMIN PANEL</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-dark-border flex-shrink-0">
        <Link href="/" className="admin-nav-item block mb-0.5" onClick={() => setSidebarOpen(false)}>
          <FiZap size={16} />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 flex-shrink-0 flex-col border-r border-dark-border bg-dark-card">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar — no framer-motion, just CSS transition */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden bg-dark-card border-r border-dark-border
          transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-dark-border flex items-center justify-between px-4 bg-dark-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-400 hover:text-white p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <span className="font-gaming text-sm text-gray-300 truncate">
              {navItems.find((n) => n.href === pathname)?.label ?? 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-gaming">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            ADMIN
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
