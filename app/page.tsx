// 環境変数が必要なため静的生成を無効化
export const dynamic = 'force-dynamic'

import { createServerClient } from '@/lib/supabase-server'
import CalendarView from '@/components/CalendarView'
import type { Event, Group } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createServerClient()

  // ログインユーザーを取得
  const { data: { user } } = await supabase.auth.getUser()

  let events: Event[] = []
  let followedGroupIds: string[] = []

  if (user) {
    // ログイン済み: フォロー中グループのIDを取得
    const { data: userGroups } = await supabase
      .from('user_groups')
      .select('group_id')
      .eq('user_id', user.id)

    followedGroupIds = (userGroups ?? []).map((ug) => ug.group_id)

    if (followedGroupIds.length > 0) {
      // フォロー中グループのイベントを取得
      const { data } = await supabase
        .from('events')
        .select('*, groups(*)')
        .in('group_id', followedGroupIds)
        .order('start_date', { ascending: true })

      events = (data ?? []) as Event[]
    }
  } else {
    // 未ログイン: 全グループのイベントを取得
    const { data } = await supabase
      .from('events')
      .select('*, groups(*)')
      .order('start_date', { ascending: true })

    events = (data ?? []) as Event[]
  }

  // グループ一覧を取得（凡例表示用）
  const { data: groups } = await supabase
    .from('groups')
    .select('*')
    .order('category', { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {user && followedGroupIds.length > 0
            ? '推しのイベント'
            : '全グループのイベント'}
        </h1>
        <div className="flex items-center gap-3">
          {user && followedGroupIds.length === 0 && (
            <p className="text-sm text-gray-500 hidden sm:block">
              <a href="/groups" className="text-indigo-600 hover:underline">グループ一覧</a>からフォローするとイベントが表示されます
            </p>
          )}
          {user && (
            <a
              href="/events/new"
              className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              ＋ イベント投稿
            </a>
          )}
        </div>
      </div>

      {/* イベント種別の凡例 */}
      <div className="flex flex-wrap gap-3 text-sm">
        {[
          { label: 'ライブ・コンサート', color: '#ef4444' },
          { label: 'リリース',           color: '#3b82f6' },
          { label: 'FCイベント',         color: '#22c55e' },
          { label: 'その他',             color: '#a855f7' },
        ].map(({ label, color }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-600">{label}</span>
          </span>
        ))}
      </div>

      {/* カレンダーコンポーネント（クライアント） */}
      <CalendarView events={events} groups={(groups ?? []) as Group[]} />
    </div>
  )
}
