'use client'

import { useMemo } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { CalendarEvent, Event as OshiEvent } from '@/lib/types'
import { EVENT_COLORS } from '@/lib/types'

// date-fns ロケール設定
const locales = { ja }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ja }),
  getDay,
  locales,
})

// カレンダーの日本語メッセージ
const messages = {
  allDay:     '終日',
  previous:   '前',
  next:       '次',
  today:      '今日',
  month:      '月',
  week:       '週',
  day:        '日',
  agenda:     'アジェンダ',
  date:       '日付',
  time:       '時間',
  event:      'イベント',
  noEventsInRange: 'この期間にイベントはありません',
}

interface Props {
  events: OshiEvent[]
  onSelectEvent?: (event: OshiEvent) => void
}

export default function Calendar({ events, onSelectEvent }: Props) {
  // OshiEvent を react-big-calendar のイベント形式に変換
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map((ev) => {
      const start = new Date(ev.start_date)
      // end_date がない場合は start_date と同日
      const end = ev.end_date ? new Date(ev.end_date) : new Date(ev.start_date)
      // 終日イベントとして扱うため end を次の日の始まりにする
      end.setDate(end.getDate() + 1)

      return {
        id:       ev.id,
        title:    ev.title,
        start,
        end,
        resource: ev,
      }
    })
  }, [events])

  // イベントのスタイルをevent_typeに応じて設定
  const eventStyleGetter = (event: CalendarEvent) => {
    const color = EVENT_COLORS[event.resource.event_type]
    return {
      style: {
        backgroundColor: color,
        borderColor:     color,
        color:           '#fff',
        borderRadius:    '4px',
        border:          'none',
        padding:         '2px 4px',
        fontSize:        '0.8rem',
      },
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    onSelectEvent?.(event.resource)
  }

  return (
    <div className="h-[450px] sm:h-[560px] md:h-[680px] min-w-0 overflow-hidden">
      <BigCalendar
        localizer={localizer}
        events={calendarEvents}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        messages={messages}
        culture="ja"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        popup
        style={{ height: '100%' }}
      />
    </div>
  )
}
