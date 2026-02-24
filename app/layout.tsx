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
  title: 'Royal Asia Shipping | First Class Logistics Services',
  description:
    'Royal Asia Shipping Co. (Pvt) Ltd — Established 2004. Shipping, Air Cargo, Freight Forwarding, Chartering, Warehousing and Cargo Clearing Services from Colombo, Sri Lanka.',
  keywords: [
    'shipping company sri lanka',
    'air cargo colombo',
    'freight forwarding',
    'cargo clearing',
    'warehousing sri lanka',
    'royal asia shipping',
  ],
  openGraph: {
    title: 'Royal Asia Shipping | First Class Logistics Services',
    description:
      'Comprehensive logistics solutions. Shipping, Air Cargo, Freight Forwarding, Chartering, Warehousing and Cargo Clearing. Based in Colombo, Sri Lanka since 2004.',
    type: 'website',
    siteName: 'Royal Asia Shipping',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Royal Asia Shipping | First Class Logistics Services',
    description: 'Shipping, Air Cargo, Freight Forwarding, Chartering, Warehousing and Cargo Clearing from Colombo, Sri Lanka.',
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
