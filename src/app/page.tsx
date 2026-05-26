import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ShopStatusBanner from '@/components/home/ShopStatusBanner';
import ConsolesSection from '@/components/home/ConsolesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import EventsPreview from '@/components/home/EventsPreview';
import StatsSection from '@/components/home/StatsSection';
import MapSection from '@/components/home/MapSection';

export const metadata: Metadata = {
  title: 'Zaib Gaming Zone | PS5 & PS4 Gaming Clifton Karachi — Book Online',
  description:
    'Visit Zaib Gaming Zone at Samwood Mall, Clifton Block 2 Karachi. Play PS5, PS4 with the latest games. Book your gaming slot online in 30-min or 1-hour sessions. Tournaments available!',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopStatusBanner />
      <ConsolesSection />
      <HowItWorksSection />
      <StatsSection />
      <EventsPreview />
      <MapSection />
    </>
  );
}
