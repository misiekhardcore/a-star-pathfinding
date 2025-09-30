import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.scss';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
