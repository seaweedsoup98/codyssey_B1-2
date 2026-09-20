import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  isSupabaseConfigured,
  requireSupabase,
  supabase,
} from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await requireSupabase().auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }, [])

  const signUp = useCallback(async (email, password) => {
    const { data, error } = await requireSupabase().auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await requireSupabase().auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.')
  }

  return context
}
