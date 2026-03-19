'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  const navLinks = [
    { href: '/',       label: 'カレンダー' },
    { href: '/groups', label: 'グループ' },
    { href: '/mypage', label: 'マイページ' },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ */}
          <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-oshi-pink to-oshi-purple bg-clip-text text-transparent">
            おしろぐ
          </Link>

          {/* デスクトップナビ */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'text-oshi-pink'
                    : 'text-gray-500 hover:text-oshi-pink'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ログイン/ログアウト（デスクトップ） */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-gray-400 truncate max-w-[140px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-2 min-h-[44px] rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-2 min-h-[44px] flex items-center rounded-lg bg-oshi-pink text-white font-medium hover:bg-oshi-pink-dark transition-colors"
              >
                ログイン
              </Link>
            )}
          </div>

          {/* ハンバーガーメニュー（モバイル） */}
          <button
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <span className="block w-5 h-0.5 bg-current mb-1.5" />
            <span className="block w-5 h-0.5 bg-current mb-1.5" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-1 pt-2 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-3 text-sm rounded-lg min-h-[44px] flex items-center ${
                  pathname === href
                    ? 'text-oshi-pink bg-oshi-pink-light font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 min-h-[44px] text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  ログアウト
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-3 min-h-[44px] text-sm text-oshi-pink font-medium flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン / 新規登録
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
