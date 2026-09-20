# Study Notes — Codyssey B1-2

React에서 **라우팅 → 컴포넌트 → 상태 → 이벤트 → 비동기 요청 → 렌더링**이 연결되는 흐름을 직접 확인하기 위한 SPA 프로젝트입니다.

핵심 데이터는 \`note\` 하나로 제한하고, Supabase 원격 데이터 기준 CRUD와 인증을 구현했습니다.

## 주요 기능

- React Router 기반 SPA
- 학습 기록 목록 / 상세 / 등록 / 수정 / 삭제
- 검색어·분류 필터
- controlled form + 필수값 검증
- 로딩 / 에러 / 빈 상태 공통 UI
- Supabase 원격 CRUD
- Supabase Auth 로그인·회원가입
- 보호 라우트
- Auth Context 전역 상태
- \`useMemo\`를 이용한 필터 결과 메모이제이션
- 잘못된 주소의 Not Found 처리
- Vercel SPA rewrite 설정

## Route

| 경로 | 화면 | 접근 |
|---|---|---|
| \`/\` | 홈 | 공개 |
| \`/login\` | 로그인 / 회원가입 | 공개 |
| \`/notes\` | 기록 목록 | 로그인 필요 |
| \`/notes/new\` | 기록 등록 | 로그인 필요 |
| \`/notes/:id\` | 기록 상세 | 로그인 필요 |
| \`/notes/:id/edit\` | 기록 수정 | 로그인 필요 |
| \`/profile\` | 사용자 정보 | 로그인 필요 |
| \`*\` | Not Found | 공개 |

## 기술 스택

- React 18
- Vite
- JavaScript
- React Router
- Supabase Database / Auth
- CSS
- Vercel

## 프로젝트 구조

\`\`\`text
src/
├── components/       # 재사용 UI 컴포넌트
├── context/          # 전역 인증 상태
├── hooks/            # 비동기 데이터 조회 흐름
├── lib/              # Supabase client와 데이터 API
├── pages/            # 라우트 단위 화면
├── App.jsx           # Route 정의
├── main.jsx          # React 진입점
└── styles.css
\`\`\`

### 역할 분리 기준

- \`pages\`: URL 하나에 대응하는 화면과 페이지 수준 흐름
- \`components\`: 여러 화면에서 재사용하거나 독립적으로 설명 가능한 UI
- \`hooks\`: React state/effect와 원격 조회 흐름
- \`lib\`: React와 무관한 Supabase 접근 코드
- \`context\`: 여러 라우트에서 공유하는 로그인 사용자 상태

## 데이터 흐름

\`\`\`mermaid
flowchart LR
    A[사용자 이벤트] --> B[React state 변경]
    B --> C[컴포넌트 re-render]
    A --> D[Supabase 요청]
    D --> E[loading / success / error]
    E --> B
\`\`\`

등록을 예로 들면:

\`\`\`text
/notes/new
→ NewNotePage
→ NoteForm의 controlled state
→ submit event
→ createNote()
→ Supabase insert
→ 성공 시 /notes/:id 로 이동
→ useNote(id)가 상세 데이터 조회
→ 상세 화면 렌더링
\`\`\`

## 실행

Node.js 18 이상을 권장합니다.

\`\`\`bash
npm install
npm run dev
\`\`\`

프로덕션 빌드:

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Supabase 설정

### 1. Database

Supabase Dashboard의 **SQL Editor**에서 [\`supabase-schema.sql\`](./supabase-schema.sql)을 실행합니다.

이 SQL은 다음을 만듭니다.

- \`notes\` 테이블
- 사용자별 데이터 소유를 위한 \`user_id\`
- Row Level Security
- 자신의 note만 CRUD할 수 있는 정책
- 수정 시 \`updated_at\`을 갱신하는 trigger

### 2. Frontend 환경변수

실제 값을 repository에 저장하지 않습니다.

Vercel Project → **Settings → Environment Variables**에 다음 두 값만 등록합니다.

\`\`\`text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
\`\`\`

- \`VITE_SUPABASE_URL\`: Supabase Project URL
- \`VITE_SUPABASE_PUBLISHABLE_KEY\`: 브라우저용 Publishable key

Supabase Dashboard의 **Connect** 또는 **Settings → API Keys**에서 확인할 수 있습니다.

> **Database password는 이 React 앱에서 사용하지 않습니다.**
>
> Secret key, \`service_role\`, Database password처럼 서버 전용 권한이 있는 값은 \`VITE_\` 환경변수에 넣으면 안 됩니다. Vite의 \`VITE_\` 변수는 브라우저 코드에서 읽을 수 있기 때문입니다.

로컬에 실제 \`.env\`를 두지 않아도 됩니다. 제출용 기능 검증은 Vercel 환경변수만으로 진행할 수 있습니다. \`.env.example\`에는 변수 이름과 예시만 있고 실제 key는 없습니다.

### 3. Auth URL

이메일 확인 기능을 사용할 경우 Supabase Dashboard의 **Authentication → URL Configuration**에서:

- **Site URL**: 실제 Vercel Production URL
- 필요한 경우 Redirect URLs에도 Production URL 추가

를 설정합니다.

## Vercel

Repository가 Vercel에 연결되어 있다면 main branch에 push/merge된 뒤 자동 배포됩니다.

환경변수를 추가하거나 변경한 뒤에는 **Redeploy**하여 새 빌드에 반영합니다.

\`vercel.json\`은 \`/notes/123\` 같은 SPA 경로를 직접 열거나 새로고침해도 \`index.html\`로 진입하도록 설정합니다.

## 미션 요구사항 대응

- 5개 이상 Route: 7개 + Not Found
- 목록/상세 Route: \`/notes\`, \`/notes/:id\`
- CRUD: \`src/lib/notes.js\`
- Custom Hook: \`useNotes\`, \`useNote\`
- 재사용 컴포넌트: 10개 이상
- 공통 상태 UI: \`LoadingState\`, \`ErrorState\`, \`EmptyState\`
- controlled form: \`NoteForm\`
- 전역 상태 보너스: \`AuthContext\`
- 성능 최적화 보너스: \`NotesPage\`의 \`useMemo\`
- 인증 보너스: Supabase Auth + \`ProtectedRoute\`

평가 전에는 [\`report/evaluation-guide.md\`](./report/evaluation-guide.md)를 읽으면 구현 이유와 React 동작 흐름을 빠르게 복습할 수 있습니다.
