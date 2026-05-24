import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getProfile } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(u) {
    if (!u) { setProfile(null); return }
    try { setProfile(await getProfile(u.id)) } catch { setProfile(null) }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      loadProfile(u).finally(() => setLoading(false))
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      loadProfile(u)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile: () => user && loadProfile(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
