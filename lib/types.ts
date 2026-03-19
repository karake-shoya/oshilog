// ============================================================
// Oshilog 型定義
// ============================================================

/** イベント種別 */
export type EventType = 'live' | 'release' | 'fc' | 'other'

/** グループカテゴリ */
export type GroupCategory = 'main' | 'sub'

/** イベント種別ごとのカラーコード */
export const EVENT_COLORS: Record<EventType, string> = {
  live:    '#ef4444', // 赤: ライブ・コンサート
  release: '#3b82f6', // 青: CD/DVD リリース
  fc:      '#22c55e', // 緑: ファンクラブイベント
  other:   '#a855f7', // 紫: その他
}

/** イベント種別の日本語ラベル */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  live:    'ライブ・コンサート',
  release: 'リリース',
  fc:      'FCイベント',
  other:   'その他',
}

// ============================================================
// データベーステーブル型
// ============================================================

/** グループマスタ */
export interface Group {
  id:         string
  name:       string
  slug:       string
  category:   GroupCategory
  color:      string
  image_url:  string | null
  created_at: string
}

/** イベント */
export interface Event {
  id:          string
  group_id:    string
  title:       string
  description: string | null
  event_type:  EventType
  start_date:  string // ISO 8601 date string (YYYY-MM-DD)
  end_date:    string | null
  venue:       string | null
  url:         string | null
  created_by:  string | null
  created_at:  string
  updated_at:  string
  // JOIN時のみ
  groups?:     Group
}

/** ユーザーとグループのフォロー関係 */
export interface UserGroup {
  user_id:    string
  group_id:   string
  created_at: string
}

/** ユーザーのカレンダー追加・参加予定 */
export interface UserEvent {
  user_id:     string
  event_id:    string
  will_attend: boolean
  created_at:  string
}

/** 推し活費用記録 */
export interface OshiCost {
  id:         string
  user_id:    string
  event_id:   string | null
  group_id:   string | null
  amount:     number
  category:   string
  memo:       string | null
  cost_date:  string
  created_at: string
}

// ============================================================
// react-big-calendar 用イベント型
// ============================================================

/** カレンダー表示用イベント型 */
export interface CalendarEvent {
  id:        string
  title:     string
  start:     Date
  end:       Date
  resource:  Event
}
