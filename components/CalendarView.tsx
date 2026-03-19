'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Event as OshiEvent, Group } from '@/lib/types'
import { EVENT_TYPE_LABELS, EVENT_COLORS } from '@/lib/types'

// react-big-calendar は SSR 非対応のため動的インポート
const Calendar = dynamic(() => import('./Calendar'), { ssr: false })

interface Props {
  events:  OshiEvent[]
  groups:  Group[]
}

export default function CalendarView({ events, groups }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<OshiEvent | null>(null)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <Calendar events={events} onSelectEvent={setSelectedEvent} />
      </div>

      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* イベント種別バッジ */}
            <span
              className="inline-block px-2 py-0.5 rounded text-xs text-white font-medium mb-3"
              style={{ backgroundColor: EVENT_COLORS[selectedEvent.event_type] }}
            >
              {EVENT_TYPE_LABELS[selectedEvent.event_type]}
            </span>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {selectedEvent.title}
            </h2>

            {/* グループ名 */}
            {selectedEvent.groups && (
              <p className="text-sm text-indigo-600 font-medium mb-3">
                {selectedEvent.groups.name}
              </p>
            )}

            {/* 日程 */}
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium">日程: </span>
                {selectedEvent.start_date}
                {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date
                  ? ` 〜 ${selectedEvent.end_date}`
                  : ''}
              </p>
              {selectedEvent.venue && (
                <p>
                  <span className="font-medium">会場: </span>
                  {selectedEvent.venue}
                </p>
              )}
            </div>

            {/* 説明 */}
            {selectedEvent.description && (
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {selectedEvent.description}
              </p>
            )}

            {/* 公式リンク */}
            {selectedEvent.url && (
              <a
                href={selectedEvent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-indigo-600 hover:underline mb-4"
              >
                公式ページを見る →
              </a>
            )}

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-2 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  )
}
