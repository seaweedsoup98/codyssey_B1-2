import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import TextArea from './TextArea'

const EMPTY_VALUES = {
  title: '',
  content: '',
  category: '기타',
}

export default function NoteForm({
  initialValues = EMPTY_VALUES,
  onSubmit,
  submitLabel = '저장',
}) {
  const [values, setValues] = useState({
    title: initialValues.title ?? '',
    content: initialValues.content ?? '',
    category: initialValues.category ?? '기타',
  })
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name] && value.trim()) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  function validate() {
    const nextErrors = {}

    if (!values.title.trim()) nextErrors.title = '제목을 입력하세요.'
    if (!values.content.trim()) nextErrors.content = '내용을 입력하세요.'
    if (!values.category.trim()) nextErrors.category = '분류를 입력하세요.'

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setRequestError('')

    try {
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category.trim(),
      })
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      {requestError && (
        <div className="form-error" role="alert">
          저장에 실패했습니다. {requestError}
        </div>
      )}

      <Input
        id="title"
        name="title"
        label="제목"
        value={values.title}
        onChange={handleChange}
        error={errors.title}
        disabled={submitting}
      />

      <Input
        id="category"
        name="category"
        label="분류"
        value={values.category}
        onChange={handleChange}
        error={errors.category}
        disabled={submitting}
      />

      <TextArea
        id="content"
        name="content"
        label="내용"
        rows="9"
        value={values.content}
        onChange={handleChange}
        error={errors.content}
        disabled={submitting}
      />

      <p className="character-count">내용 {values.content.length}자</p>

      <Button type="submit" disabled={submitting}>
        {submitting ? '저장 중...' : submitLabel}
      </Button>
    </form>
  )
}
