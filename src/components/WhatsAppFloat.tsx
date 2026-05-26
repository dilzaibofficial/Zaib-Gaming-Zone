'use client';

import { useState } from 'react';
import { useShop } from '@/contexts/ShopContext';
import { FiX } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

export default function WhatsAppFloat() {
  const { settings } = useShop();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!settings.whatsappNumber) return null;

  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappMessage || 'Hi! I want to book a gaming session at Zaib Gaming Zone.'
  )}`;

  return (
    <div className="whatsapp-float">
      {/* Tooltip — CSS transition, no framer-motion */}
      <div className={`absolute right-16 bottom-0 gaming-card rounded-xl p-4 w-56 border border-green-500/30 transition-all duration-200 ${
        showTooltip ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}>
        <button onClick={() => setShowTooltip(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white">
          <FiX size={14} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <BsWhatsapp className="text-green-400" size={18} />
          <span className="font-gaming text-xs text-white">Chat with us!</span>
        </div>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{settings.whatsappMessage}</p>
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="block text-center text-xs font-bold py-2 px-3 rounded-lg bg-green-500 text-black hover:bg-green-400 transition-colors font-gaming">
          Open WhatsApp
        </a>
      </div>

      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative hover:scale-110 active:scale-95 transition-transform duration-150"
        style={{
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          boxShadow: '0 0 20px rgba(37,211,102,0.5)',
        }}
        aria-label="Chat on WhatsApp"
      >
        <BsWhatsapp size={28} className="text-white" />
        <span className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping" />
      </button>
    </div>
  );
}
