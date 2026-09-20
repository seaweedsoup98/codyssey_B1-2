import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import useNote from '../hooks/useNote'
import { deleteNote } from '../lib/notes'

export default function NoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { note, loading, error, refetch } = useNote(id)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (loading) return <LoadingState message="상세 기록을 불러오는 중..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  if (!note) {
    return (
      <EmptyState
        message="삭제되었거나 존재하지 않는 기록입니다."
        action={<Link className="link-button" to="/notes">목록으로</Link>}
      />
    )
  }

  async function handleDelete() {
    if (!window.confirm('이 기록을 삭제할까요?')) return

    setDeleting(true)
    setDeleteError('')

    try {
      await deleteNote(id)
      navigate('/notes', { replace: true })
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <article className="panel">
      <div className="note-card-meta">
        <span className="badge">{note.category}</span>
        <time dateTime={note.created_at}>
          {new Date(note.created_at).toLocaleString('ko-KR')}
        </time>
      </div>

      <h1>{note.title}</h1>
      <p className="note-content">{note.content}</p>

      {deleteError && (
        <div className="form-error" role="alert">
          삭제에 실패했습니다. {deleteError}
        </div>
      )}

      <div className="action-row">
        <Link className="link-button secondary" to={`/notes/${id}/edit`}>수정</Link>
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
        <Link className="text-link" to="/notes">목록으로</Link>
      </div>
    </article>
  )
}
