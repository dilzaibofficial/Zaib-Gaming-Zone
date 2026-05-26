'use client';

import { useEffect, useState } from 'react';
import { getShopSettings, updateShopSettings } from '@/lib/firestore';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { ShopSettings, HeroSlide } from '@/types';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  FiSave, FiMapPin, FiPhone, FiMail, FiClock, FiGlobe,
  FiImage, FiX, FiPlus, FiEdit2
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { FiFacebook, FiInstagram, FiYoutube } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { GiGamepad } from 'react-icons/gi';

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────

const defaultSettings: Partial<ShopSettings> = {
  shopName: 'Zaib Gaming Zone',
  address: '1st Floor, Samwood Shopping Mall, Clifton Block 2, Karachi',
  phone: '',
  email: '',
  whatsappNumber: '',
  whatsappMessage: 'Hi! I want to book a gaming session at Zaib Gaming Zone.',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.480395756738!2d67.0134512735798!3d24.81323994714877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d9a0525bc67%3A0xeedb471d7536b94b!2sSamwood%20Shopping%20Mall!5e0!3m2!1sen!2s!4v1779756056360!5m2!1sen!2s',
  facebook: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  openHours: 'Mon–Sun: 12:00 PM – 12:00 AM',
  announcement: '',
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 's1',
    imageUrl: '',
    title: 'ZAIB GAMING ZONE',
    subtitle: "Clifton's Most Electrifying PS5 & PS4 Gaming Experience — Book Your Slot Now!",
    ctaLabel: 'Book a Session',
    ctaHref: '#consoles',
  },
  {
    id: 's2',
    imageUrl: '',
    title: 'NEXT-GEN GAMING',
    subtitle: 'PlayStation 5 with 4K Graphics • Dual PS4 Stations • 20+ Game Titles Available',
    ctaLabel: 'View Consoles',
    ctaHref: '#consoles',
  },
  {
    id: 's3',
    imageUrl: '',
    title: 'JOIN TOURNAMENTS',
    subtitle: "Compete in Epic Gaming Tournaments • Win Prizes • Prove You're the Best in Karachi!",
    ctaLabel: 'View Events',
    ctaHref: '/events',
  },
];

// ─── SLIDE EDITOR ─────────────────────────────────────────────────────────────

function SlideEditor({
  slide,
  index,
  onChange,
}: {
  slide: HeroSlide;
  index: number;
  onChange: (updated: HeroSlide) => void;
}) {
  const colors = ['#00d4ff', '#00ff88', '#7c3aed'];
  const color = colors[index] || '#00ff88';

  return (
    <div
      className="gaming-card rounded-2xl p-5 space-y-4"
      style={{ borderColor: `${color}33` }}
    >
      {/* Slide header */}
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-gaming font-bold text-xs"
          style={{ background: `${color}20`, color, border: `1px solid ${color}44` }}
        >
          {index + 1}
        </div>
        <span className="font-gaming font-bold text-white text-sm">SLIDE {index + 1}</span>
        <span className="text-gray-500 text-xs ml-1">
          {index === 0 ? '(First slide — most important)' : index === 1 ? '(Second slide)' : '(Third slide)'}
        </span>
      </div>

      {/* Image upload */}
      <div>
        <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-2 block flex items-center gap-1.5">
          <FiImage size={11} /> Background Image (Cloudinary)
        </label>
        <CloudinaryUpload
          folder="zaib-gaming/hero"
          label="Upload Slide Image (1920×1080 HD recommended)"
          currentUrl={slide.imageUrl}
          aspectHint="Best size: 1920×1080px landscape"
          onUpload={(res) => onChange({ ...slide, imageUrl: res.url })}
          onRemove={() => onChange({ ...slide, imageUrl: '' })}
        />
      </div>

      {/* Title */}
      <div>
        <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
          Slide Title
        </label>
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
          className="input-neon text-sm py-2.5 font-gaming"
          placeholder="e.g. ZAIB GAMING ZONE"
          maxLength={30}
        />
        <div className="text-xs text-gray-500 mt-0.5 text-right">{slide.title.length}/30</div>
      </div>

      {/* Subtitle */}
      <div>
        <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
          Subtitle / Description
        </label>
        <textarea
          value={slide.subtitle}
          onChange={(e) => onChange({ ...slide, subtitle: e.target.value })}
          className="input-neon text-sm resize-none"
          rows={2}
          placeholder="e.g. Clifton's best gaming zone..."
          maxLength={120}
        />
        <div className="text-xs text-gray-500 mt-0.5 text-right">{slide.subtitle.length}/120</div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
            Button Label
          </label>
          <input
            type="text"
            value={slide.ctaLabel || ''}
            onChange={(e) => onChange({ ...slide, ctaLabel: e.target.value })}
            className="input-neon text-sm py-2"
            placeholder="Book a Session"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
            Button Link
          </label>
          <input
            type="text"
            value={slide.ctaHref || ''}
            onChange={(e) => onChange({ ...slide, ctaHref: e.target.value })}
            className="input-neon text-sm py-2"
            placeholder="#consoles or /events"
          />
        </div>
      </div>

      {/* Live preview badge */}
      {slide.imageUrl && (
        <div className="flex items-center gap-2 text-xs text-neon-green">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          Image uploaded to Cloudinary — slide is live
        </div>
      )}
    </div>
  );
}

// ─── MAIN SETTINGS PAGE ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<ShopSettings>>(defaultSettings);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [saving, setSaving] = useState(false);
  const [savingSlides, setSavingSlides] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slidesSaved, setSlidesSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'hero' | 'social' | 'map'>('shop');

  useEffect(() => {
    // Load shop settings
    getShopSettings().then((s) => {
      if (s) setSettings({ ...defaultSettings, ...s });
    });
    // Load hero slides
    getDoc(doc(db, 'settings', 'hero')).then((snap) => {
      if (snap.exists() && snap.data().slides?.length > 0) {
        setSlides(snap.data().slides);
      }
    });
  }, []);

  // Save shop settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateShopSettings(settings as ShopSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Save hero slides
  const handleSaveSlides = async () => {
    setSavingSlides(true);
    try {
      await setDoc(doc(db, 'settings', 'hero'), {
        slides,
        updatedAt: serverTimestamp(),
      });
      setSlidesSaved(true);
      setTimeout(() => setSlidesSaved(false), 3000);
      toast.success('Hero slides saved! They\'re live on the website.');
    } catch {
      toast.error('Failed to save slides');
    } finally {
      setSavingSlides(false);
    }
  };

  const updateSlide = (idx: number, updated: HeroSlide) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? updated : s)));
  };

  const tabs = [
    { id: 'hero', label: '🖼️ Hero Slides' },
    { id: 'shop', label: '🏪 Shop Info' },
    { id: 'social', label: '📱 Social & WhatsApp' },
    { id: 'map', label: '📍 Map & Address' },
  ] as const;

  const Field = ({
    label, icon: Icon, field, type = 'text', placeholder = '', textarea = false,
  }: {
    label: string; icon: any; field: keyof typeof settings;
    type?: string; placeholder?: string; textarea?: boolean;
  }) => (
    <div>
      <label className="flex items-center gap-2 text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5">
        <Icon size={12} /> {label}
      </label>
      {textarea ? (
        <textarea
          value={(settings[field] as string) || ''}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          className="input-neon resize-none text-sm" rows={3} placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={(settings[field] as string) || ''}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          className="input-neon text-sm py-2.5" placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-gaming font-bold text-2xl text-white">SETTINGS</h1>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-dark-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-gaming uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-neon-green/15 border border-neon-green text-neon-green'
                : 'border border-dark-border text-gray-400 hover:border-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── HERO SLIDES TAB ── */}
      {activeTab === 'hero' && (
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-gaming font-bold text-neon-green text-sm uppercase tracking-widest">
                Hero Slider Images
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Upload 3 background images for the homepage hero slider. Images are stored on Cloudinary.
              </p>
            </div>
            <button
              onClick={handleSaveSlides}
              disabled={savingSlides}
              className="btn-neon text-xs flex items-center gap-1.5 px-4 py-2 flex-shrink-0"
            >
              <FiSave size={13} />
              {savingSlides ? 'Saving...' : slidesSaved ? '✓ Saved!' : 'Save Slides'}
            </button>
          </div>

          {/* Cloudinary setup hint */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400 leading-relaxed">
            <strong>⚠️ Cloudinary Setup Required:</strong> Before uploading, fill in your Cloudinary credentials in <code className="bg-black/30 px-1 rounded">.env.local</code>:
            <br />
            <code className="text-white text-xs">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and{' '}
            <code className="text-white text-xs">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>
            <br />
            <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 underline mt-1 inline-block">
              → Get free Cloudinary account
            </a>
          </div>

          <div className="space-y-5">
            {slides.map((slide, i) => (
              <SlideEditor
                key={slide.id}
                slide={slide}
                index={i}
                onChange={(updated) => updateSlide(i, updated)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSlides}
              disabled={savingSlides}
              className="btn-neon flex items-center gap-2 px-8"
            >
              <FiSave size={16} />
              {savingSlides ? 'Saving...' : slidesSaved ? '✓ Slides Saved!' : 'Save Hero Slides'}
            </button>
            {slidesSaved && (
              <span className="text-neon-green text-sm font-gaming animate-pulse">
                Changes are live on the website!
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── SHOP INFO TAB ── */}
      {activeTab === 'shop' && (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="gaming-card rounded-2xl p-6 space-y-4">
            <h2 className="font-gaming font-bold text-neon-green text-sm uppercase tracking-widest mb-2">
              Shop Information
            </h2>
            <Field label="Shop Name" icon={FiGlobe} field="shopName" placeholder="Zaib Gaming Zone" />
            <Field label="Address" icon={FiMapPin} field="address" placeholder="1st Floor, Samwood Mall..." textarea />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone Number" icon={FiPhone} field="phone" type="tel" placeholder="+92 XXX XXXXXXX" />
              <Field label="Email" icon={FiMail} field="email" type="email" placeholder="info@zaibgamingzone.com" />
            </div>
            <Field label="Opening Hours" icon={FiClock} field="openHours" placeholder="Mon–Sun: 12:00 PM – 12:00 AM" />
            <div>
              <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
                Announcement Banner (leave blank to hide)
              </label>
              <input
                type="text"
                value={settings.announcement || ''}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                className="input-neon text-sm py-2.5"
                placeholder="🎮 Weekend Tournament this Saturday! Register Now!"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-neon flex items-center gap-2 px-8">
              <FiSave size={16} />
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Shop Info'}
            </button>
            {saved && <span className="text-neon-green text-sm font-gaming animate-pulse">Saved!</span>}
          </div>
        </form>
      )}

      {/* ── SOCIAL & WHATSAPP TAB ── */}
      {activeTab === 'social' && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* WhatsApp */}
          <div className="gaming-card rounded-2xl p-6 space-y-4">
            <h2 className="font-gaming font-bold text-green-400 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              <BsWhatsapp /> WhatsApp Settings
            </h2>
            <div>
              <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
                WhatsApp Number (with country code, no +)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="input-neon text-sm py-2.5"
                placeholder="923001234567"
              />
            </div>
            <Field
              label="Default WhatsApp Message"
              icon={BsWhatsapp}
              field="whatsappMessage"
              placeholder="Hi! I want to book a gaming session..."
              textarea
            />
          </div>

          {/* Social Media */}
          <div className="gaming-card rounded-2xl p-6 space-y-4">
            <h2 className="font-gaming font-bold text-neon-blue text-sm uppercase tracking-widest mb-2">
              Social Media Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: FiFacebook, field: 'facebook' as const, placeholder: 'https://facebook.com/...', label: 'Facebook' },
                { icon: FiInstagram, field: 'instagram' as const, placeholder: 'https://instagram.com/...', label: 'Instagram' },
                { icon: SiTiktok, field: 'tiktok' as const, placeholder: 'https://tiktok.com/@...', label: 'TikTok' },
                { icon: FiYoutube, field: 'youtube' as const, placeholder: 'https://youtube.com/@...', label: 'YouTube' },
              ].map(({ icon: Icon, field, placeholder, label }) => (
                <div key={field}>
                  <label className="flex items-center gap-2 text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5">
                    <Icon size={12} /> {label}
                  </label>
                  <input
                    type="url"
                    value={(settings[field] as string) || ''}
                    onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                    className="input-neon text-sm py-2.5"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-neon flex items-center gap-2 px-8">
              <FiSave size={16} />
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Social Settings'}
            </button>
            {saved && <span className="text-neon-green text-sm font-gaming animate-pulse">Saved!</span>}
          </div>
        </form>
      )}

      {/* ── MAP TAB ── */}
      {activeTab === 'map' && (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="gaming-card rounded-2xl p-6 space-y-4">
            <h2 className="font-gaming font-bold text-neon-purple text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              <FiMapPin /> Google Maps Embed
            </h2>
            <div>
              <label className="text-xs text-gray-400 font-gaming uppercase tracking-widest mb-1.5 block">
                Embed URL — Google Maps → Share → Embed a map → copy the src="..." value
              </label>
              <textarea
                value={settings.mapEmbedUrl || ''}
                onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                className="input-neon text-sm resize-none"
                rows={4}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
            {settings.mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden border border-dark-border">
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Map Preview"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-neon flex items-center gap-2 px-8">
              <FiSave size={16} />
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Map Settings'}
            </button>
            {saved && <span className="text-neon-green text-sm font-gaming animate-pulse">Saved!</span>}
          </div>
        </form>
      )}
    </div>
  );
}
