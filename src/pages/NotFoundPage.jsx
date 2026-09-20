import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="state-box">
      <p className="eyebrow">404</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소를 확인하거나 홈으로 돌아가세요.</p>
      <Link className="link-button" to="/">홈으로</Link>
    </section>
  )
}
