'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeShopSettings } from '@/lib/firestore';
import type { ShopSettings } from '@/types';

const defaultSettings: ShopSettings = {
  isOpen: false,
  shopName: 'Zaib Gaming Zone',
  address: '1st Floor, Samwood Shopping Mall, Clifton Block 2, Karachi',
  phone: '+92-XXX-XXXXXXX',
  email: 'info@zaibgamingzone.com',
  whatsappNumber: '923001234567',
  whatsappMessage: 'Hi! I want to book a gaming session at Zaib Gaming Zone.',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.480395756738!2d67.0134512735798!3d24.81323994714877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d9a0525bc67%3A0xeedb471d7536b94b!2sSamwood%20Shopping%20Mall!5e0!3m2!1sen!2s!4v1779756056360!5m2!1sen!2s',
  facebook: 'https://facebook.com/zaibgamingzone',
  instagram: 'https://instagram.com/zaibgamingzone',
  tiktok: 'https://tiktok.com/@zaibgamingzone',
  youtube: 'https://youtube.com/@zaibgamingzone',
  openHours: 'Mon–Sun: 12:00 PM – 12:00 AM',
  announcement: '',
};

interface ShopContextType {
  settings: ShopSettings;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType>({
  settings: defaultSettings,
  loading: true,
});

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeShopSettings((s) => {
      setSettings({ ...defaultSettings, ...s });
      setLoading(false);
    });
    // fallback if no settings doc yet
    const timer = setTimeout(() => setLoading(false), 300);
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return (
    <ShopContext.Provider value={{ settings, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
