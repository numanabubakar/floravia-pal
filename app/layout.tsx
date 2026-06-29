import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Poppins } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Floravia Pal - Empowering Women Through Menstrual Hygiene',
  description: 'Floravia Pal provides dignified access to menstrual hygiene management kits for women and girls in Pakistan. Discover our Standard and Premium kits designed with care.',
  generator: 'v0.app',
  icons: {
    icon: '/floravia.png',
    apple: '/floravia.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#C2607A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
