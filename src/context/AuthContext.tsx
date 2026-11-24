import { useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AuthContext, type UserProfile } from './auth-context-def'

async function fetchMemberProfile(user: User): Promise<UserProfile> {
  const fallbackEmail = user.email || ''

  try {
    // Ambil data resmi dari tabel couple_members yang terproteksi
    const { data: member, error } = await supabase
      .from('couple_members')
      .select('role, display_name')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!error && member) {
      return {
        id: user.id,
        email: fallbackEmail,
        name: member.display_name,
        role: member.role as 'navy' | 'ifa',
        isMember: true,
      }
    }
  } catch {
    // Abaikan jika offline / koneksi gagal
  }

  // Jika belum didaftarkan di couple_members, tandai sebagai guest (bukan member resmi)
  return {
    id: user.id,
    email: fallbackEmail,
    name: 'Akun Belum Terdaftar',
    role: 'guest',
    isMember: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(!isSupabaseConfigured ? false : true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let isMounted = true

    const syncSession = async (currentUser: User | null) => {
      if (!isMounted) return
      setUser(currentUser)
      if (currentUser) {
        const userProfile = await fetchMemberProfile(currentUser)
        if (isMounted) setProfile(userProfile)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session?.user || null)
    }).catch(() => {
      if (isMounted) setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session?.user || null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum dikonfigurasi. Atur kredensial di file .env.local.') }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setProfile(null)
  }

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
