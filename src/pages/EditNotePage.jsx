import { Link, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import NoteForm from '../components/NoteForm'
import useNote from '../hooks/useNote'
import { updateNote } from '../lib/notes'

export default function EditNotePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { note, loading, error, refetch } = useNote(id)

  if (loading) return <LoadingState message="수정할 기록을 불러오는 중..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  if (!note) {
    return (
      <EmptyState
        message="수정할 기록을 찾을 수 없습니다."
        action={<Link className="link-button" to="/notes">목록으로</Link>}
      />
    )
  }

  async function handleUpdate(values) {
    await updateNote(id, values)
    navigate(\`/notes/\${id}\`)
  }

  return (
    <section className="panel">
      <p className="eyebrow">Update</p>
      <h1>학습 기록 수정</h1>
      <NoteForm initialValues={note} onSubmit={handleUpdate} submitLabel="수정 저장" />
    </section>
  )
}
