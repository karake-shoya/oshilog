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
    // 初回ロード時にセッション取得
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // 認証状態の変化を監視
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
    { href: '/',        label: 'カレンダー' },
    { href: '/groups',  label: 'グループ一覧' },
    { href: '/mypage',  label: 'マイページ' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ */}
          <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
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
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
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
                <span className="text-sm text-gray-500 truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                ログイン
              </Link>
            )}
          </div>

          {/* ハンバーガーメニュー（モバイル） */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
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
                className={`block px-2 py-2 text-sm rounded-md ${
                  pathname === href
                    ? 'text-indigo-600 bg-indigo-50'
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
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  ログアウト
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-2 py-2 text-sm text-indigo-600 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
