import { useCallback, useEffect, useState } from 'react'
import { fetchNote } from '../lib/notes'

export default function useNote(id) {
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNote = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      setNote(await fetchNote(id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadNote()
  }, [loadNote])

  return { note, loading, error, refetch: loadNote }
}
