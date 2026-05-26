import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ShopProvider } from '@/contexts/ShopContext';
import { Toaster } from 'react-hot-toast';
import SiteWrapper from '@/components/SiteWrapper';

export const metadata: Metadata = {
  title: {
    default: 'Zaib Gaming Zone | Best PS5 & PS4 Gaming in Clifton, Karachi',
    template: '%s | Zaib Gaming Zone',
  },
  description:
    "Zaib Gaming Zone — Clifton's premier gaming destination. Play PS5, PS4, and more in Karachi's most exciting gaming zone at Samwood Mall. Book your slot online now!",
  keywords: [
    'gaming zone karachi', 'clifton gaming zone', 'ps5 gaming karachi',
    'ps4 gaming karachi', 'samwood mall gaming', 'gaming zone clifton',
    'zaib gaming zone', 'online gaming karachi', 'gaming cafe karachi',
    'book gaming slot karachi', 'ps5 rental karachi', 'esports karachi',
    'gaming tournament karachi', 'block 2 clifton gaming', 'samwood gaming',
    'gaming zone near me karachi',
  ],
  authors: [{ name: 'Zaib Gaming Zone' }],
  creator: 'Zaib Gaming Zone',
  publisher: 'Zaib Gaming Zone',
  metadataBase: new URL('https://zaibgamingzone.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://zaibgamingzone.com',
    siteName: 'Zaib Gaming Zone',
    title: 'Zaib Gaming Zone | Best PS5 & PS4 Gaming in Clifton, Karachi',
    description: 'Book your PS5 or PS4 gaming session online at Zaib Gaming Zone — 1st Floor, Samwood Mall, Clifton Block 2, Karachi.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Zaib Gaming Zone — Clifton Karachi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zaib Gaming Zone | Clifton Karachi',
    description: 'Book your PS5/PS4 gaming slot online — Zaib Gaming Zone, Samwood Mall Clifton.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#00ff88',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Zaib Gaming Zone',
              image: 'https://zaibgamingzone.com/og-image.jpg',
              '@id': 'https://zaibgamingzone.com',
              url: 'https://zaibgamingzone.com',
              telephone: '+92-XXX-XXXXXXX',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '1st Floor, Samwood Shopping Mall, Clifton Block 2',
                addressLocality: 'Karachi',
                addressRegion: 'Sindh',
                postalCode: '75600',
                addressCountry: 'PK',
              },
              geo: { '@type': 'GeoCoordinates', latitude: 24.81323994714877, longitude: 67.0134512735798 },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                opens: '12:00', closes: '00:00',
              },
              sameAs: ['https://facebook.com/zaibgamingzone', 'https://instagram.com/zaibgamingzone', 'https://tiktok.com/@zaibgamingzone'],
              priceRange: '$$',
              description: "Zaib Gaming Zone — Karachi's premier PS5 and PS4 gaming destination at Samwood Mall, Clifton Block 2.",
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ShopProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#12121e',
                  color: '#fff',
                  border: '1px solid #1e1e3a',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '15px',
                },
                success: { iconTheme: { primary: '#00ff88', secondary: '#000' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <SiteWrapper>{children}</SiteWrapper>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
