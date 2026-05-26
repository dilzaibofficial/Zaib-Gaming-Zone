'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import NotificationToast from './NotificationToast';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NavigationProgress from './NavigationProgress';

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <NotificationProvider>
        <NavigationProgress />
        {children}
        <NotificationToast />
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <NavigationProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <NotificationToast />
    </NotificationProvider>
  );
}
