'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/lib/toast-context'
import type { Group, EventType } from '@/lib/types'
import { EVENT_TYPE_LABELS } from '@/lib/types'

interface Props {
  groups: Group[]
  userId: string
}

export default function EventForm({ groups, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const { showToast } = useToast()
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
      setError('グループを選んでね！')
      return
    }
    if (!formData.title.trim()) {
      setError('タイトルを入力してね！')
      return
    }
    if (!formData.start_date) {
      setError('開始日を入力してね！')
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
      setError('あれ、うまくいかなかった😢 もう一度試してみて！')
      return
    }

    showToast('イベントを投稿したよ🎉')
    router.push('/')
    router.refresh()
  }

  const inputClass = 'w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-oshi-pink'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* グループ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          グループ <span className="text-oshi-pink">*</span>
        </label>
        <select name="group_id" value={formData.group_id} onChange={handleChange} className={inputClass}>
          <option value="">選んでね</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* イベント種別 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          種別 <span className="text-oshi-pink">*</span>
        </label>
        <select name="event_type" value={formData.event_type} onChange={handleChange} className={inputClass}>
          {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
            <option key={type} value={type}>{EVENT_TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-oshi-pink">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="例: SUPER★DRAGON LIVE TOUR 2026"
          className={inputClass}
        />
      </div>

      {/* 日程 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開始日 <span className="text-oshi-pink">*</span>
          </label>
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} min={formData.start_date} className={inputClass} />
        </div>
      </div>

      {/* 会場 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">会場</label>
        <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="例: Zepp Shinjuku" className={inputClass} />
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="イベントの詳細を入力してね" className={`${inputClass} resize-none`} />
      </div>

      {/* 公式URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">公式URL</label>
        <input type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." className={inputClass} />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 min-h-[44px] rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          やめる
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 min-h-[44px] rounded-xl bg-oshi-pink text-white text-sm font-bold hover:bg-oshi-pink-dark disabled:opacity-50 transition-colors"
        >
          {loading ? '投稿中...' : '投稿する🎉'}
        </button>
      </div>
    </form>
  )
}
