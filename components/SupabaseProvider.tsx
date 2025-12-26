"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type AuthContextType = {
  user: import('@supabase/supabase-js').User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => {} })

export const useAuth = () => useContext(AuthContext)

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    // Redirect to homepage after logout
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
