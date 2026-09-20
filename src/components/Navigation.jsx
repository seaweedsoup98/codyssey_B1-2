import { NavLink } from 'react-router-dom'
import Button from './Button'

export default function Navigation({ user, onSignOut }) {
  return (
    <header className="site-header">
      <nav className="navigation" aria-label="주요 메뉴">
        <NavLink className="brand" to="/">Study Notes</NavLink>

        <div className="nav-links">
          <NavLink to="/">홈</NavLink>
          {user ? (
            <>
              <NavLink to="/notes">학습 기록</NavLink>
              <NavLink to="/profile">프로필</NavLink>
              <Button variant="ghost" onClick={onSignOut}>로그아웃</Button>
            </>
          ) : (
            <NavLink to="/login">로그인</NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}
