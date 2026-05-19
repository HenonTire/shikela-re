import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { inter } from "@/lib/fonts"
import './globals.css'

export const metadata: Metadata = {
  title: 'Shikela - Ethiopian Commerce Platform',
  description: 'Create and manage your online store with Shikela, the Ethiopian e-commerce platform designed for merchants',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
