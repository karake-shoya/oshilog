# Oshilog（おしろぐ）

EBiDAN系グループのファン向け推し活カレンダーWebアプリ。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| スタイル | Tailwind CSS v4（CSS変数でカスタムテーマ定義） |
| バックエンド | Supabase (PostgreSQL + Auth + RLS) |
| カレンダー | react-big-calendar + date-fns（日本語ロケール） |
| 認証 | Supabase Auth（メール/パスワード + Google OAuth） |

## 実装済み機能

| 機能 | 説明 |
|---|---|
| カレンダー表示 | 月/週/日ビュー切り替え、イベント種別ごとのカラー表示 |
| 未ログイン閲覧 | 全グループのイベントを閲覧可能 |
| ログイン時フィルタ | フォロー中グループのイベントのみ表示 |
| イベント詳細モーダル | タイトル・日程・会場・説明・公式URLを表示 |
| 推しの予定に追加 | `user_events` テーブルに参加予定を記録 |
| イベント投稿 | グループ/種別/日程/会場/URL を入力して投稿（要ログイン） |
| ログイン/新規登録 | メール+パスワード、Googleログイン対応 |
| トースト通知 | 操作フィードバックを画面下部にポップアップ表示 |

## 対応グループ

| グループ名 | slug | カテゴリ |
|---|---|---|
| EBiDAN | ebidan | main |
| SUPER★DRAGON | super-dragon | sub |
| ONE N' ONLY | one-n-only | sub |
| 原因は自分にある。 | gen-jibun | sub |
| さくらしめじ | sakura-shimeji | sub |
| Lufthansa | lufthansa | sub |

## セットアップ

### 1. 環境変数の設定

```bash
cp .env.local.example .env.local
# .env.local を編集して Supabase の接続情報を入力
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Supabase マイグレーション実行

Supabase ダッシュボード → SQL エディタで順に実行:

```
supabase/migrations/001_initial_schema.sql  # テーブル・RLS・トリガー作成
supabase/seed.sql                           # グループマスタ6件投入
```

### 3. Google OAuth 設定（任意）

1. Google Cloud Console → 認証情報 → OAuth クライアントID 作成
2. リダイレクトURI: `https://<your-project>.supabase.co/auth/v1/callback`
3. Supabase ダッシュボード → Authentication → Providers → Google を有効化

### 4. 開発サーバー起動

```bash
npm install
npm run dev
# http://localhost:3000
```

## ディレクトリ構成

```
app/
  layout.tsx              # グローバルレイアウト（Noto Sans JP + NavBar + ToastProvider）
  page.tsx                # カレンダートップ（Server Component、force-dynamic）
  globals.css             # Tailwind v4 テーマ定義（oshi-pink/oshi-purple）
  login/page.tsx          # ログイン・新規登録ページ
  events/new/page.tsx     # イベント投稿ページ（要ログイン）
  auth/callback/route.ts  # Google OAuth コールバック処理

components/
  NavBar.tsx              # ナビゲーションバー（ハンバーガーメニュー対応）
  Calendar.tsx            # react-big-calendar ラッパー（SSR非対応のため動的インポート）
  CalendarView.tsx        # カレンダー表示 + イベント詳細モーダル
  EventForm.tsx           # イベント投稿フォーム
  LoginForm.tsx           # ログイン/新規登録フォーム（Google OAuth含む）

lib/
  types.ts                # TypeScript 型定義（Group, Event, UserEvent 等）
  supabase.ts             # ブラウザ用 Supabase クライアント（Client Component で使用）
  supabase-server.ts      # サーバー用 Supabase クライアント（Server Component で使用）
  toast-context.tsx       # トースト通知 Context + useToast() フック

supabase/
  migrations/
    001_initial_schema.sql  # テーブル定義・RLSポリシー・トリガー
  seed.sql                  # グループマスタシードデータ
```

## データベーステーブル

| テーブル | 説明 | RLS |
|---|---|---|
| `groups` | グループマスタ（6件） | 全員READ可、変更不可 |
| `events` | ユーザー投稿イベント | 全員READ可、ログインユーザーがINSERT、本人がUPDATE/DELETE |
| `user_groups` | グループフォロー関係 | 本人のみ全操作 |
| `user_events` | カレンダー追加・参加予定 | 本人のみ全操作 |
| `oshi_costs` | 推し活費用記録（将来実装） | 本人のみ全操作 |

## カラーテーマ

| 変数名 | カラーコード | 用途 |
|---|---|---|
| `oshi-pink` | `#E91E63` | メインアクション・ボタン |
| `oshi-pink-dark` | `#C2185B` | ホバー状態 |
| `oshi-pink-light` | `#FCE4EC` | 背景アクセント |
| `oshi-purple` | `#9C27B0` | グラデーション（ロゴ） |

## イベント種別カラー

| 種別 | 日本語 | カラー |
|---|---|---|
| `live` | ライブ・コンサート | `#ef4444`（赤） |
| `release` | リリース | `#3b82f6`（青） |
| `fc` | FCイベント | `#22c55e`（緑） |
| `other` | その他 | `#a855f7`（紫） |

## 未実装ページ（ナビに存在）

- `/groups` — グループ一覧・フォロー管理
- `/mypage` — マイページ・推し活費用管理
