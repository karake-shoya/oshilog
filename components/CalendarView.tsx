'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Event as OshiEvent, Group } from '@/lib/types'
import { EVENT_TYPE_LABELS, EVENT_COLORS } from '@/lib/types'
import { useToast } from '@/lib/toast-context'
import { createClient } from '@/lib/supabase'

// react-big-calendar は SSR 非対応のため動的インポート
const Calendar = dynamic(() => import('./Calendar'), { ssr: false })

interface Props {
  events:  OshiEvent[]
  groups:  Group[]
}

export default function CalendarView({ events, groups }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<OshiEvent | null>(null)
  const { showToast } = useToast()
  const supabase = createClient()

  // 自分のカレンダーに追加
  const handleAddToMyCalendar = async () => {
    if (!selectedEvent) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showToast('ログインしてから追加してね！', 'error')
      return
    }

    const { error } = await supabase.from('user_events').upsert({
      user_id:     user.id,
      event_id:    selectedEvent.id,
      will_attend: true,
    })

    if (error) {
      showToast('あれ、うまくいかなかった😢 もう一度試してみて！', 'error')
    } else {
      showToast('推しの予定に追加したよ♪', 'success')
      setSelectedEvent(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <Calendar events={events} onSelectEvent={setSelectedEvent} />
      </div>

      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md mx-0 sm:mx-4 p-6 pb-8 sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ドラッグハンドル（モバイル） */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 sm:hidden" />

            {/* イベント種別バッジ */}
            <span
              className="inline-block px-3 py-1 rounded-full text-xs text-white font-medium mb-3"
              style={{ backgroundColor: EVENT_COLORS[selectedEvent.event_type] }}
            >
              {EVENT_TYPE_LABELS[selectedEvent.event_type]}
            </span>

            <h2 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
              {selectedEvent.title}
            </h2>

            {/* グループ名 */}
            {selectedEvent.groups && (
              <p className="text-sm font-medium mb-3" style={{ color: selectedEvent.groups.color }}>
                {selectedEvent.groups.name}
              </p>
            )}

            {/* 日程・会場 */}
            <div className="space-y-1 text-sm text-gray-500 mb-4">
              <p>
                📅 {selectedEvent.start_date}
                {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date
                  ? ` 〜 ${selectedEvent.end_date}`
                  : ''}
              </p>
              {selectedEvent.venue && (
                <p>📍 {selectedEvent.venue}</p>
              )}
            </div>

            {/* 説明 */}
            {selectedEvent.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {selectedEvent.description}
              </p>
            )}

            {/* 公式リンク */}
            {selectedEvent.url && (
              <a
                href={selectedEvent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-oshi-pink hover:underline mb-4"
              >
                公式ページを見る →
              </a>
            )}

            {/* ボタン */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleAddToMyCalendar}
                className="w-full py-3 min-h-[44px] rounded-xl bg-oshi-pink text-white text-sm font-bold hover:bg-oshi-pink-dark transition-colors"
              >
                推しの予定に追加する♪
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full py-3 min-h-[44px] rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
