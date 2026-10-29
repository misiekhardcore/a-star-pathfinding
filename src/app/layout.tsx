import type { Metadata } from 'next';
import { JetBrains_Mono, Lato, Playfair_Display } from 'next/font/google';

import './globals.css';
import { ReactNode } from 'react';

import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeScript } from '@/theme/ThemeScript';

/*
 * The design system reads these variables for its type scale: Lato for body
 * copy, Playfair Display for headings, JetBrains Mono for numeric readouts.
 */
const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A* Pathfinding Visualizer',
  description:
    'An interactive visualization of the A* pathfinding algorithm. Watch as the algorithm finds the optimal path from start to end while avoiding obstacles in real-time.',
  keywords: ['A*', 'pathfinding', 'algorithm', 'visualization', 'nextjs', 'typescript', 'react'],
  authors: [{ name: 'misiekhardcore', url: 'https://github.com/misiekhardcore' }],
  creator: 'misiekhardcore',
  metadataBase: new URL('https://a-star-pathfinding.vercel.app'),
  openGraph: {
    title: 'A* Pathfinding Visualizer',
    description:
      'An interactive visualization of the A* pathfinding algorithm. Watch as the algorithm finds the optimal path from start to end while avoiding obstacles in real-time.',
    url: 'https://a-star-pathfinding.vercel.app',
    siteName: 'A* Pathfinding Visualizer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A* Pathfinding Visualizer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A* Pathfinding Visualizer',
    description:
      'An interactive visualization of the A* pathfinding algorithm. Watch as the algorithm finds the optimal path from start to end while avoiding obstacles in real-time.',
    images: ['/og-image.png'],
    creator: '@misiekhardcore',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The theme script sets `dark` and `color-scheme` on <html> before
      // hydration, which React cannot know about.
      suppressHydrationWarning
      className={`${lato.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-svh bg-background text-foreground antialiased">
        <ThemeScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
