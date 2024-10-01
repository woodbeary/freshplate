import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreshPlate - Personalized Meal Plans Delivered',
  description: 'Custom meal plans inspired by your favorite restaurants, tailored to your health goals and delivered to your door.',
  keywords: 'meal planning, personalized meals, healthy eating, food delivery',
  openGraph: {
    title: 'FreshPlate - Personalized Meal Plans Delivered',
    description: 'Custom meal plans inspired by your favorite restaurants, tailored to your health goals and delivered to your door.',
    images: ['/og-image.jpg'], // Make sure to add this image to your public folder
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
