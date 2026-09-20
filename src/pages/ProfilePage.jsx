import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="panel narrow-panel">
      <p className="eyebrow">Global State</p>
      <h1>프로필</h1>
      <dl className="profile-list">
        <div>
          <dt>이메일</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>사용자 ID</dt>
          <dd className="mono">{user.id}</dd>
        </div>
      </dl>
    </section>
  )
}
