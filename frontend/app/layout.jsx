import "./styles/index.css";
import { Providers } from "./providers";
import ScrollToTop from "./components/common/ScrollToTop";
import WhatsAppFloating from "./components/common/WhatsAppFloating";
import ThemeAnimator from "./components/common/ThemeAnimator";

// ✅ Advanced SEO Metadata
export const metadata = {
  title: {
    default: "NEPAL'S PREMIER FREELANCING NETWORK - Think Tank Freelancing Hub",
    template: '%s | Think Tank',
  },
  description: "Join Nepal's premier freelancing and professional collaboration network. Find top remote jobs, freelance projects, and enterprise contracts in Nepal. Build your career with Think Tank Freelancing Hub.",
  keywords: ["freelancing in Nepal", "Nepal freelancers", "remote jobs Nepal", "freelance platform Nepal", "IT jobs Nepal", "content writing Nepal", "career in Nepal", "Think Tank Freelancing Hub", "outsource to Nepal"],
  authors: [{ name: 'Think Tank Freelancing Hub' }],
  creator: 'Think Tank Freelancing Hub',
  publisher: 'Think Tank Freelancing Hub',
  alternates: {
    canonical: 'https://ttfreelancinghub.com',
  },
  openGraph: {
    title: "NEPAL'S PREMIER FREELANCING NETWORK - Think Tank Freelancing Hub",
    description: "Join Nepal's premier freelancing and professional collaboration network. Find top remote jobs, freelance projects, and enterprise contracts in Nepal.",
    url: 'https://ttfreelancinghub.com',
    siteName: 'Think Tank Freelancing Hub',
    images: [
      {
        url: 'https://ttfreelancinghub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Think Tank Freelancing Hub - Nepal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NEPAL'S PREMIER FREELANCING NETWORK - Think Tank Freelancing Hub",
    description: "Find top remote jobs, freelance projects, and enterprise contracts in Nepal.",
    images: ['https://ttfreelancinghub.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['500'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>

      </head>
      <body className={`overflow-x-hidden antialiased ${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} font-body bg-bg text-ink`} suppressHydrationWarning>
        <ThemeAnimator />
        <ScrollToTop />
        <WhatsAppFloating />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}