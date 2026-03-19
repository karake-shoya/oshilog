-- ============================================================
-- Oshilog シードデータ（EBiDAN系グループ）
-- ============================================================

INSERT INTO groups (name, slug, category, color) VALUES
  ('EBiDAN',              'ebidan',         'main', '#ef4444'),
  ('SUPER★DRAGON',        'super-dragon',   'sub',  '#f97316'),
  ('ONE N'' ONLY',         'one-n-only',     'sub',  '#eab308'),
  ('原因は自分にある。',   'gen-jibun',      'sub',  '#22c55e'),
  ('さくらしめじ',         'sakura-shimeji', 'sub',  '#3b82f6'),
  ('Lufthansa',            'lufthansa',      'sub',  '#a855f7')
ON CONFLICT (slug) DO NOTHING;
