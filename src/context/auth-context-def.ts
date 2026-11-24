import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  name: string // 'Navy' | 'Ifa' | 'Pengguna'
  role: 'navy' | 'ifa' | 'guest'
  isMember: boolean
}

export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isConfigured: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
