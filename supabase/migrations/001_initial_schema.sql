-- ============================================================
-- Oshilog 初期スキーマ定義
-- ============================================================

-- グループマスタ
CREATE TABLE IF NOT EXISTS groups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  category   TEXT NOT NULL CHECK (category IN ('main', 'sub')),
  color      TEXT NOT NULL DEFAULT '#6366f1',
  image_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- イベント
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  event_type  TEXT NOT NULL CHECK (event_type IN ('live', 'release', 'fc', 'other')),
  start_date  DATE NOT NULL,
  end_date    DATE,
  venue       TEXT,
  url         TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ユーザーとグループのフォロー関係
CREATE TABLE IF NOT EXISTS user_groups (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id   UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, group_id)
);

-- ユーザーのカレンダー追加・参加予定
CREATE TABLE IF NOT EXISTS user_events (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  will_attend BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- 推し活費用記録
CREATE TABLE IF NOT EXISTS oshi_costs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id    UUID REFERENCES events(id) ON DELETE SET NULL,
  group_id    UUID REFERENCES groups(id) ON DELETE SET NULL,
  amount      INTEGER NOT NULL CHECK (amount >= 0),
  category    TEXT NOT NULL DEFAULT 'other',
  memo        TEXT,
  cost_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- groups: 全員読み取り可、変更不可（管理者のみ）
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "groups_select_all" ON groups FOR SELECT USING (TRUE);

-- events: 未ログインでも閲覧可、ログインユーザーはCRUD可
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_all" ON events FOR SELECT USING (TRUE);
CREATE POLICY "events_insert_auth" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "events_update_own" ON events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "events_delete_own" ON events FOR DELETE USING (auth.uid() = created_by);

-- user_groups: 本人のみ全操作可
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_groups_all_own" ON user_groups
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_events: 本人のみ全操作可
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_events_all_own" ON user_events
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- oshi_costs: 本人のみ全操作可
ALTER TABLE oshi_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oshi_costs_all_own" ON oshi_costs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
