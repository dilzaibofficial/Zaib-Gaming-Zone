'use client';

import Link from 'next/link';
import { useShop } from '@/contexts/ShopContext';
import { GiGamepad } from 'react-icons/gi';
import {
  FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin
} from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

export default function Footer() {
  const { settings } = useShop();
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: FiFacebook, href: settings.facebook, label: 'Facebook', color: '#1877f2' },
    { icon: FiInstagram, href: settings.instagram, label: 'Instagram', color: '#e4405f' },
    { icon: SiTiktok, href: settings.tiktok, label: 'TikTok', color: '#ff0050' },
    { icon: FiYoutube, href: settings.youtube, label: 'YouTube', color: '#ff0000' },
  ];

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-20">
      {/* Top glowing line */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-green to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <GiGamepad size={36} className="text-neon-green" />
              <div>
                <div className="font-gaming font-bold text-xl text-white tracking-wider">
                  ZAIB <span className="neon-text-green">GAMING</span>
                </div>
                <div className="text-[9px] text-gray-500 font-gaming tracking-[0.3em]">ZONE</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Clifton's premier gaming destination. Experience PS5, PS4, and future VR gaming
              at Samwood Mall, Karachi.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                href && href !== '#' ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-dark-border flex items-center justify-center text-gray-400 hover:border-neon-green/50 hover:text-neon-green transition-all duration-200 hover:scale-110"
                  >
                    <Icon size={16} />
                  </a>
                ) : null
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-gaming text-sm text-white uppercase tracking-widest mb-4 neon-text-green">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Consoles & Games', href: '/#consoles' },
                { label: 'Book a Slot', href: '/#consoles' },
                { label: 'Events & Tournaments', href: '/events' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-green text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neon-green opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gaming */}
          <div>
            <h3 className="font-gaming text-sm text-white uppercase tracking-widest mb-4 neon-text-blue">
              Gaming
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'PS5 Console', href: '/#consoles' },
                { label: 'PS4 Console #1', href: '/#consoles' },
                { label: 'PS4 Console #2', href: '/#consoles' },
                { label: 'Upcoming: VR Gaming', href: '/#consoles' },
                { label: 'Tournaments', href: '/events' },
                { label: 'My Profile', href: '/profile' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-blue text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-gaming text-sm text-white uppercase tracking-widest mb-4 neon-text-purple">
              Find Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="text-neon-green mt-0.5 flex-shrink-0" size={15} />
                <span>{settings.address}</span>
              </li>
              {settings.phone && (
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <FiPhone className="text-neon-green flex-shrink-0" size={15} />
                  <a href={`tel:${settings.phone}`} className="hover:text-neon-green transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <FiMail className="text-neon-green flex-shrink-0" size={15} />
                  <a href={`mailto:${settings.email}`} className="hover:text-neon-green transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              <li className="mt-3 pt-3 border-t border-dark-border">
                <div className="text-xs text-gray-500 mb-1 font-gaming uppercase tracking-wider">Open Hours</div>
                <div className="text-sm text-gray-300">{settings.openHours}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {year} Zaib Gaming Zone. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Clifton Block 2, Karachi •
            <span className="neon-text-green ml-1">Level up your game 🎮</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
