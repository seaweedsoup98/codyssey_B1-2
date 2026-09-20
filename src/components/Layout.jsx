import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navigation from './Navigation'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <Navigation user={user} onSignOut={handleSignOut} />
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
