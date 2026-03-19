import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import EventForm from '@/components/EventForm'
import type { Group } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function NewEventPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 未ログインはログインページへ
  if (!user) {
    redirect('/login')
  }

  // グループ一覧を取得（フォームのセレクトボックス用）
  const { data: groups } = await supabase
    .from('groups')
    .select('*')
    .order('name')

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">イベントを投稿</h1>
      <EventForm groups={(groups ?? []) as Group[]} userId={user.id} />
    </div>
  )
}
