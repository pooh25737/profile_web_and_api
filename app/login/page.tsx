'use client'

import { useState } from 'react'
// ❌ ลบตัวนี้ออก: import { createClient } from '@supabase/supabase-js'

// ✅ ใช้อันนี้แทน: เพื่อให้มันฝัง Cookie ให้ Middleware เห็น
import { createBrowserClient } from '@supabase/ssr'

import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ✅ สร้าง Client แบบ Browser (Client Component)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Login Successful!')
      
      // *** สำคัญ: Refresh เพื่อให้ Middleware เห็น Cookie ใหม่ทันที ***
      router.refresh() 
      
      // หน่วงเวลานิดนึงเพื่อให้ Cookie ฝังลง Browser ชัวร์ๆ
      setTimeout(() => {
          router.push('/admin')
      }, 500)

    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-slate-400 text-sm">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input 
              type="email" required
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
            <input 
              type="password" required
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}