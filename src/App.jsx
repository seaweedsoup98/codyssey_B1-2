import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import EditNotePage from './pages/EditNotePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NewNotePage from './pages/NewNotePage'
import NoteDetailPage from './pages/NoteDetailPage'
import NotesPage from './pages/NotesPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notes" element={<ProtectedPage><NotesPage /></ProtectedPage>} />
        <Route path="/notes/new" element={<ProtectedPage><NewNotePage /></ProtectedPage>} />
        <Route path="/notes/:id" element={<ProtectedPage><NoteDetailPage /></ProtectedPage>} />
        <Route path="/notes/:id/edit" element={<ProtectedPage><EditNotePage /></ProtectedPage>} />
        <Route path="/profile" element={<ProtectedPage><ProfilePage /></ProtectedPage>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
