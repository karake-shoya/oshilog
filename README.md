# Oshilog（おしろぐ）

EBiDAN系グループのファン向け推し活カレンダーWebアプリ。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + Auth + RLS)
- **カレンダー**: react-big-calendar + date-fns（日本語ロケール）

## 機能概要

- ライブ・リリース・FCイベントをカレンダーで一覧表示
- 未ログイン時: 全グループのイベントを閲覧可
- ログイン時: フォロー中グループのイベントのみ表示
- イベント種別ごとのカラー分類（ライブ/リリース/FC/その他）
- イベントクリックで詳細モーダル表示

## 対応グループ

| グループ名 | スラッグ |
|---|---|
| EBiDAN | ebidan |
| SUPER★DRAGON | super-dragon |
| ONE N' ONLY | one-n-only |
| 原因は自分にある。 | gen-jibun |
| さくらしめじ | sakura-shimeji |
| Lufthansa | lufthansa |

## セットアップ

### 1. 環境変数の設定

```bash
cp .env.local.example .env.local
# .env.local を編集して Supabase の接続情報を入力
```

### 2. Supabase マイグレーション実行

Supabase ダッシュボードの SQL エディタで以下を順に実行:

1. `supabase/migrations/001_initial_schema.sql` — テーブル・RLS作成
2. `supabase/seed.sql` — グループマスタのシードデータ投入

### 3. 開発サーバー起動

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセス

## ディレクトリ構成

```
app/
  layout.tsx          # グローバルレイアウト（NavBar）
  page.tsx            # カレンダートップページ（Server Component）
components/
  NavBar.tsx          # ナビゲーションバー（認証状態対応）
  Calendar.tsx        # react-big-calendar ラッパー
  CalendarView.tsx    # カレンダー + イベント詳細モーダル
lib/
  types.ts            # TypeScript 型定義
  supabase.ts         # Supabase クライアント（ブラウザ/SSR）
supabase/
  migrations/
    001_initial_schema.sql  # 初期スキーマ・RLS定義
  seed.sql                  # グループマスタシードデータ
```

## データベーステーブル

| テーブル | 説明 |
|---|---|
| `groups` | EBiDANグループマスタ |
| `events` | ユーザー投稿イベント |
| `user_groups` | フォロー関係 |
| `user_events` | カレンダー追加・参加予定 |
| `oshi_costs` | 推し活費用記録 |
