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
    <html lang="en" className="touch-none">
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" 
        />
        <meta name="google" content="notranslate" />
        <meta 
          name="Impact-Site-Verification" 
          content="fc179931-ca7a-4260-abc1-32fb29242a64" 
        />
      </head>
      <body className={`${inter.className} touch-none`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
