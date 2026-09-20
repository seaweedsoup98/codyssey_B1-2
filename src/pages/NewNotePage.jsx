import { useNavigate } from 'react-router-dom'
import NoteForm from '../components/NoteForm'
import { createNote } from '../lib/notes'

export default function NewNotePage() {
  const navigate = useNavigate()

  async function handleCreate(values) {
    const note = await createNote(values)
    navigate(`/notes/${note.id}`)
  }

  return (
    <section className="panel">
      <p className="eyebrow">Create</p>
      <h1>새 학습 기록</h1>
      <NoteForm onSubmit={handleCreate} submitLabel="기록 저장" />
    </section>
  )
}
