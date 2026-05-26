'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/lib/firestore';
import { useShop } from '@/contexts/ShopContext';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

export default function ContactPage() {
  const { settings } = useShop();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      await submitContactMessage({ ...form, status: 'pending' });
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon. 🎮');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  };

  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="py-16 text-center gaming-grid relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.15) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="section-tag justify-center"><FiMail /> Contact</div>
          <h1 className="font-gaming font-black text-4xl sm:text-5xl text-white mb-4">
            GET IN <span className="gradient-text">TOUCH</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have questions about bookings, events, or anything else?<br />We're here to help!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="font-gaming font-bold text-xl text-white mb-6">CONTACT INFO</h2>

              <div className="space-y-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 gaming-card rounded-xl p-4 hover:border-green-500/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <BsWhatsapp size={18} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs font-gaming text-green-400 uppercase tracking-widest mb-0.5">WhatsApp</div>
                    <div className="text-white font-semibold text-sm">+{settings.whatsappNumber}</div>
                    <div className="text-gray-500 text-xs mt-0.5 group-hover:text-green-400 transition-colors">
                      Click to chat instantly →
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4 gaming-card rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-neon-green/15 border border-neon-green/30 flex items-center justify-center flex-shrink-0">
                    <FiMapPin size={18} className="text-neon-green" />
                  </div>
                  <div>
                    <div className="text-xs font-gaming text-neon-green uppercase tracking-widest mb-0.5">Location</div>
                    <div className="text-white font-semibold text-sm leading-relaxed">{settings.address}</div>
                  </div>
                </div>

                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-start gap-4 gaming-card rounded-xl p-4 hover:border-neon-blue/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center flex-shrink-0">
                      <FiPhone size={18} className="text-neon-blue" />
                    </div>
                    <div>
                      <div className="text-xs font-gaming text-neon-blue uppercase tracking-widest mb-0.5">Phone</div>
                      <div className="text-white font-semibold text-sm">{settings.phone}</div>
                    </div>
                  </a>
                )}

                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-4 gaming-card rounded-xl p-4 hover:border-neon-purple/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/30 flex items-center justify-center flex-shrink-0">
                      <FiMail size={18} className="text-neon-purple" />
                    </div>
                    <div>
                      <div className="text-xs font-gaming text-neon-purple uppercase tracking-widest mb-0.5">Email</div>
                      <div className="text-white font-semibold text-sm">{settings.email}</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-dark-border">
                <div className="text-xs font-gaming text-gray-400 uppercase tracking-widest mb-2">Open Hours</div>
                <div className="text-white font-semibold">{settings.openHours}</div>
                <div className={`flex items-center gap-2 mt-2 text-sm font-gaming ${settings.isOpen ? 'text-neon-green' : 'text-red-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${settings.isOpen ? 'bg-neon-green animate-pulse' : 'bg-red-400'}`} />
                  Currently {settings.isOpen ? 'Open' : 'Closed'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="gaming-card rounded-2xl overflow-hidden border border-dark-border">
              <div className="h-1 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple" />
              <div className="p-8">
                <h2 className="font-gaming font-bold text-xl text-white mb-6 flex items-center gap-2">
                  <FiMessageSquare className="text-neon-green" />
                  SEND A MESSAGE
                </h2>

                {sent ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">🎮</div>
                    <h3 className="font-gaming font-bold text-white text-xl mb-2">Message Sent!</h3>
                    <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSent(false)} className="btn-outline-neon mt-6 text-sm">
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type="text"
                          placeholder="Your Name *"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="input-neon pl-10"
                          required
                        />
                      </div>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="input-neon pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="tel"
                        placeholder="Phone Number (optional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-neon pl-10"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-neon"
                    />
                    <textarea
                      placeholder="Your message... *"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-neon resize-none"
                      rows={5}
                      required
                    />
                    <button type="submit" disabled={loading} className="btn-neon w-full flex items-center justify-center gap-2">
                      <FiSend size={15} />
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}