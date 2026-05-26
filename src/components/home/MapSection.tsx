'use client';

import { useShop } from '@/contexts/ShopContext';
import { FiMapPin, FiClock, FiPhone, FiNavigation } from 'react-icons/fi';

export default function MapSection() {
  const { settings } = useShop();

  return (
    <section className="py-20" id="location">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-tag justify-center"><FiMapPin /> Find Us</div>
          <h2 className="font-gaming font-bold text-3xl sm:text-4xl text-white mb-4">
            OUR <span className="gradient-text">LOCATION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="gaming-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-neon-green" size={18} />
                </div>
                <div>
                  <div className="font-gaming text-xs text-neon-green uppercase tracking-widest mb-1">Address</div>
                  <p className="text-white font-semibold text-sm leading-relaxed">{settings.address}</p>
                </div>
              </div>
            </div>

            <div className="gaming-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-neon-blue" size={18} />
                </div>
                <div>
                  <div className="font-gaming text-xs text-neon-blue uppercase tracking-widest mb-1">Open Hours</div>
                  <p className="text-white font-semibold text-sm">{settings.openHours}</p>
                  <div className={`mt-2 flex items-center gap-1.5 text-xs font-gaming ${settings.isOpen ? 'text-neon-green' : 'text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${settings.isOpen ? 'bg-neon-green animate-pulse' : 'bg-red-400'}`} />
                    Currently {settings.isOpen ? 'OPEN' : 'CLOSED'}
                  </div>
                </div>
              </div>
            </div>

            {settings.phone && (
              <div className="gaming-card rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/15 border border-neon-purple/30 flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-neon-purple" size={18} />
                  </div>
                  <div>
                    <div className="font-gaming text-xs text-neon-purple uppercase tracking-widest mb-1">Contact</div>
                    <a href={`tel:${settings.phone}`} className="text-white font-semibold text-sm hover:text-neon-purple transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            <a href={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-neon flex items-center justify-center gap-2 w-full">
              <FiNavigation size={16} /> Get Directions
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-dark-border">
            <iframe
              src={settings.mapEmbedUrl}
              width="100%" height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zaib Gaming Zone Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
