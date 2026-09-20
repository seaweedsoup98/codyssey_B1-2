import { useCallback, useEffect, useState } from 'react'
import { fetchNotes } from '../lib/notes'

export default function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      setNotes(await fetchNotes())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  return { notes, loading, error, refetch: loadNotes }
}
