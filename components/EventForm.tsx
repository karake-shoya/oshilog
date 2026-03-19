'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Group, EventType } from '@/lib/types'
import { EVENT_TYPE_LABELS } from '@/lib/types'

interface Props {
  groups: Group[]
  userId: string
}

export default function EventForm({ groups, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    group_id:    '',
    title:       '',
    description: '',
    event_type:  'live' as EventType,
    start_date:  '',
    end_date:    '',
    venue:       '',
    url:         '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.group_id) {
      setError('グループを選択してください')
      return
    }
    if (!formData.title.trim()) {
      setError('タイトルを入力してください')
      return
    }
    if (!formData.start_date) {
      setError('開始日を入力してください')
      return
    }

    setLoading(true)

    const { error: insertError } = await supabase.from('events').insert({
      group_id:    formData.group_id,
      title:       formData.title.trim(),
      description: formData.description.trim() || null,
      event_type:  formData.event_type,
      start_date:  formData.start_date,
      end_date:    formData.end_date || null,
      venue:       formData.venue.trim() || null,
      url:         formData.url.trim() || null,
      created_by:  userId,
    })

    setLoading(false)

    if (insertError) {
      setError(`投稿に失敗しました: ${insertError.message}`)
      return
    }

    // 投稿成功 → カレンダーへ戻る
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* グループ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          グループ <span className="text-red-500">*</span>
        </label>
        <select
          name="group_id"
          value={formData.group_id}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">選択してください</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* イベント種別 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          種別 <span className="text-red-500">*</span>
        </label>
        <select
          name="event_type"
          value={formData.event_type}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
            <option key={type} value={type}>{EVENT_TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="例: SUPER★DRAGON LIVE TOUR 2026"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 日程 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開始日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            min={formData.start_date}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 会場 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">会場</label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="例: Zepp Shinjuku"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="イベントの詳細を入力"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* 公式URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">公式URL</label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </form>
  )
}
