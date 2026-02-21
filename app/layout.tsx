import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LenisProvider } from '@/providers/LenisProvider'
import Navbar from '@/components/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Port Authority | Elite Private Aviation',
  description:
    'Port Authority delivers elite private aviation across 92 countries and 500+ verified private terminals. Zero queues. Absolute discretion. On your terms.',
  keywords: [
    'private aviation',
    'private jet charter',
    'elite aviation',
    'luxury travel',
    'business jet',
    'private terminal',
  ],
  openGraph: {
    title: 'Port Authority | The Sky Is Where You Belong',
    description:
      'Elite private aviation. Uncompromising access. Designed for those who demand more.',
    type: 'website',
    siteName: 'Port Authority',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Port Authority | Elite Private Aviation',
    description: 'Elite private aviation. On your terms.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
