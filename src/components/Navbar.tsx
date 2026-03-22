import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-600 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded">
          🎊 Confetti
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-paper/60 truncate max-w-[200px]">{user.email}</span>
              <Link to="/dashboard" className="min-h-[44px] flex items-center px-4 py-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <button onClick={handleLogout} className="min-h-[44px] px-4 py-2 text-sm border border-paper/20 rounded-lg hover:bg-paper/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="min-h-[44px] flex items-center px-4 py-2 text-sm hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" className="min-h-[44px] flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary">Sign up</Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-paper/10 px-4 py-4 space-y-2">
          {user ? (
            <>
              <p className="text-sm text-paper/60 truncate">{user.email}</p>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="block min-h-[44px] py-2 hover:text-primary transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary transition-colors">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-2 hover:text-primary transition-colors">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}