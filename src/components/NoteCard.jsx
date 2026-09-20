import { Link } from 'react-router-dom'

export default function NoteCard({ note }) {
  return (
    <article className="note-card">
      <div className="note-card-meta">
        <span className="badge">{note.category}</span>
        <time dateTime={note.created_at}>
          {new Date(note.created_at).toLocaleDateString('ko-KR')}
        </time>
      </div>
      <h2>{note.title}</h2>
      <p>{note.content.slice(0, 120)}</p>
      <Link to={\`/notes/\${note.id}\`}>자세히 보기 →</Link>
    </article>
  )
}
