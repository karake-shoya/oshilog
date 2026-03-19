import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'Oshilog（おしろぐ）',
  description: 'EBiDAN系グループのファン向け推し活カレンダー',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </main>
        <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          © 2026 Oshilog - EBiDAN系ファンのための推し活カレンダー
        </footer>
      </body>
    </html>
  )
}
