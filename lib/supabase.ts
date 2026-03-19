import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** ブラウザ用 Supabase クライアント（クライアントコンポーネントで使用） */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
