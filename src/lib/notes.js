import { requireSupabase } from './supabase'

const TABLE = 'notes'

export async function fetchNotes() {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function fetchNote(id) {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createNote(values) {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .insert(values)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNote(id, values) {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNote(id) {
  const { error } = await requireSupabase().from(TABLE).delete().eq('id', id)

  if (error) throw error
}
