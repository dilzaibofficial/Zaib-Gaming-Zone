'use client';

import { useEffect, useState } from 'react';
import { getGalleryImages } from '@/lib/firestore';
import { GiGamepad, GiTrophy } from 'react-icons/gi';
import { FiMapPin, FiZap, FiStar } from 'react-icons/fi';

const features = [
  { icon: GiGamepad, title: 'PS5 Gaming', desc: 'Next-gen 4K gaming experience with the PlayStation 5.', color: '#00d4ff' },
  { icon: GiGamepad, title: 'Dual PS4 Stations', desc: 'Two dedicated PS4 stations with unique game libraries.', color: '#00ff88' },
  { icon: GiTrophy, title: 'Tournaments', desc: 'Regular gaming tournaments with cash and prize winners.', color: '#7c3aed' },
  { icon: FiZap, title: 'Online Booking', desc: 'Book your session online — no waiting, no hassle.', color: '#ff00ff' },
  { icon: FiStar, title: 'Coming Soon: VR', desc: 'Virtual Reality gaming is coming to Zaib Gaming Zone!', color: '#f59e0b' },
  { icon: FiMapPin, title: 'Prime Location', desc: 'Conveniently located at Samwood Mall, Clifton Block 2.', color: '#00d4ff' },
];

export default function AboutPage() {
  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    getGalleryImages().then(setGallery);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 text-center gaming-grid relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,136,0.15) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="section-tag justify-center"><FiStar /> About Us</div>
          <h1 className="font-gaming font-black text-4xl sm:text-5xl text-white mb-6">
            ABOUT <span className="gradient-text">ZAIB GAMING ZONE</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Zaib Gaming Zone is Clifton's most electrifying gaming destination, proudly located
            at <strong className="text-neon-green">Samwood Shopping Mall, Block 2, Karachi</strong>.
            We bring the ultimate console gaming experience to every gamer in the city — from
            casual fun with friends to fierce competitive tournaments.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
            >
              <div className="section-tag"><GiGamepad /> Our Story</div>
              <h2 className="font-gaming font-bold text-3xl text-white mb-6">
                WHERE GAMERS <span className="gradient-text">COME ALIVE</span>
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Zaib Gaming Zone was born from a simple passion — making world-class gaming
                  accessible to everyone in Karachi. We started with a PS5 and a dream,
                  and now we're home to multiple high-performance gaming stations.
                </p>
                <p>
                  Whether you're a hardcore gamer looking to master the latest titles, or
                  a family looking for fun weekend entertainment, we have something for everyone.
                  Our cozy, vibrant setup at Samwood Mall makes us the go-to gaming spot
                  in Clifton.
                </p>
                <p>
                  With real-time online booking, transparent pricing, and an ever-growing
                  game library, we're committed to giving you the best gaming experience
                  in all of Karachi.
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: '1', sub: 'PS5 Console' },
                { label: '2', sub: 'PS4 Stations' },
                { label: '20+', sub: 'Game Titles' },
                { label: '∞', sub: 'Fun Guaranteed' },
              ].map((item) => (
                <div key={item.label} className="gaming-card rounded-2xl p-6 text-center">
                  <div className="font-gaming font-black text-4xl gradient-text mb-2">{item.label}</div>
                  <div className="text-gray-400 text-sm font-semibold">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-dark-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center mb-12"
          >
            <h2 className="font-gaming font-bold text-3xl text-white">
              WHY CHOOSE <span className="gradient-text">US</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="gaming-card rounded-2xl p-6"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}33` }}
                >
                  <feat.icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 className="font-gaming font-bold text-white text-sm mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center mb-10"
            >
              <div className="section-tag justify-center"><FiStar /> Gallery</div>
              <h2 className="font-gaming font-bold text-3xl text-white">
                INSIDE THE <span className="gradient-text">ZONE</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-dark-border hover:border-neon-green/50 transition-all"
                  onClick={() => setSelectedImg(img)}
                >
                  <img
                    src={img}
                    alt={`Gaming Zone Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-gaming text-xs">
                      VIEW
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <img src={selectedImg} alt="Gallery" className="max-w-3xl max-h-[80vh] rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
}
