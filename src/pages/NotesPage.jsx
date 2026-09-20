import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Input from '../components/Input'
import LoadingState from '../components/LoadingState'
import NoteList from '../components/NoteList'
import useNotes from '../hooks/useNotes'

export default function NotesPage() {
  const { notes, loading, error, refetch } = useNotes()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('전체')

  const categories = useMemo(
    () => ['전체', ...new Set(notes.map((note) => note.category))],
    [notes],
  )

  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return notes.filter((note) => {
      const matchesCategory = category === '전체' || note.category === category
      const matchesKeyword =
        !keyword ||
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)

      return matchesCategory && matchesKeyword
    })
  }, [notes, query, category])

  if (loading) return <LoadingState message="학습 기록을 불러오는 중..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Remote CRUD</p>
          <h1>학습 기록</h1>
          <p>검색어나 분류가 바뀌면 상태가 변하고 목록이 다시 렌더링됩니다.</p>
        </div>
        <Link className="link-button" to="/notes/new">새 기록</Link>
      </div>

      <div className="filter-bar">
        <Input
          id="search"
          label="검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="제목 또는 내용"
        />
        <label className="field" htmlFor="category-filter">
          <span>분류</span>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      {filteredNotes.length > 0 ? (
        <NoteList notes={filteredNotes} />
      ) : (
        <EmptyState
          message={
            notes.length === 0
              ? '첫 학습 기록을 작성해보세요.'
              : '현재 검색 조건에 맞는 기록이 없습니다.'
          }
          action={
            notes.length === 0 ? (
              <Link className="link-button" to="/notes/new">첫 기록 작성</Link>
            ) : null
          }
        />
      )}
    </section>
  )
}
