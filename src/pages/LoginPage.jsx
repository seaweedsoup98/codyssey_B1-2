import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  if (user) return <Navigate to="/notes" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        const data = await signUp(email, password)

        if (data.session) {
          navigate('/notes', { replace: true })
        } else {
          setMessage('가입 요청이 완료되었습니다. 이메일 확인 후 로그인하세요.')
          setMode('signin')
        }
      } else {
        await signIn(email, password)
        navigate(location.state?.from || '/notes', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel narrow-panel">
      <p className="eyebrow">Supabase Auth</p>
      <h1>{mode === 'signin' ? '로그인' : '회원가입'}</h1>

      {message && <div className="form-success">{message}</div>}
      {error && <div className="form-error" role="alert">{error}</div>}

      <form className="note-form" onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          label="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          disabled={submitting}
        />
        <Input
          id="password"
          type="password"
          label="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          minLength="6"
          required
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? '처리 중...' : mode === 'signin' ? '로그인' : '회원가입'}
        </Button>
      </form>

      <Button
        className="mode-button"
        variant="ghost"
        onClick={() => {
          setMode((current) => (current === 'signin' ? 'signup' : 'signin'))
          setError('')
          setMessage('')
        }}
        disabled={submitting}
      >
        {mode === 'signin' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
      </Button>
    </section>
  )
}
