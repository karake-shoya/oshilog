import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import LoginForm from '@/components/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // すでにログイン済みならトップへ
  if (user) redirect('/')

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-1">おしろぐ</h1>
          <p className="text-sm text-gray-500">EBiDAN系ファンの推し活カレンダー</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
