import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <section className="hero">
      <p className="eyebrow">Codyssey B1-2 · React SPA</p>
      <h1>배운 것을 짧게 기록하고 다시 찾아보세요.</h1>
      <p>
        Study Notes는 React의 라우팅, 상태, 이벤트, 비동기 렌더링과
        Supabase CRUD 흐름을 학습하기 위한 작은 기록 서비스입니다.
      </p>
      <div className="hero-actions">
        <Link className="link-button" to={user ? '/notes' : '/login'}>
          {user ? '내 기록 보기' : '로그인하고 시작하기'}
        </Link>
      </div>
    </section>
  )
}
