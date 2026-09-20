# B1-2 평가 대비 가이드

이 문서는 기능 설명보다 **왜 이렇게 구현했고 React 내부 흐름이 어떻게 이어지는지**를 설명하기 위한 복습 자료입니다.

## 1. 요구사항 ↔ 코드 위치

| 평가 항목 | 코드 위치 | 핵심 설명 |
|---|---|---|
| 5개 이상 Route | \`src/App.jsx\` | 7개 named route + \`*\` |
| 목록 / 상세 | \`NotesPage\`, \`NoteDetailPage\` | 목록은 전체 조회, 상세는 \`id\` 기반 단건 조회 |
| CRUD | \`src/lib/notes.js\` | Supabase API를 React 코드와 분리 |
| 폼 상태 | \`NoteForm.jsx\` | controlled input |
| 유효성 검증 | \`NoteForm.jsx\` | title/content/category 공백 검사 |
| 제출 중 상태 | \`NoteForm.jsx\` | \`submitting\`으로 입력·버튼 비활성화 |
| 로딩 상태 | \`LoadingState.jsx\` | 공통 spinner UI |
| 에러 상태 | \`ErrorState.jsx\` | 오류 메시지 + retry |
| 빈 상태 | \`EmptyState.jsx\` | 데이터 없음과 검색 결과 없음 처리 |
| Custom Hook | \`useNotes.js\`, \`useNote.js\` | \`useEffect\` + 비동기 조회 |
| Context | \`AuthContext.jsx\` | 로그인 사용자를 전역 공유 |
| 보호 Route | \`ProtectedRoute.jsx\` | user가 없으면 \`/login\` |
| 메모이제이션 | \`NotesPage.jsx\` | 필터 결과를 \`useMemo\`로 계산 |
| Not Found | \`NotFoundPage.jsx\` | \`*\` route |
| SPA 배포 | \`vercel.json\` | history fallback |

## 2. 컴포넌트는 왜 나눴는가?

기준은 **재사용성과 책임**입니다.

- \`LoadingState\`, \`ErrorState\`, \`EmptyState\`
  - 여러 핵심 화면에서 동일한 비동기 상태를 표현합니다.
  - 페이지마다 같은 JSX를 반복하지 않습니다.
- \`Input\`, \`TextArea\`, \`Button\`
  - label, error, variant 같은 prop에 따라 표시와 동작이 달라집니다.
- \`NoteCard\`, \`NoteList\`
  - 개별 데이터 표현과 목록 반복 렌더링의 책임을 분리합니다.
- \`NoteForm\`
  - 등록과 수정에서 동일한 controlled form을 재사용합니다.
- \`ProtectedRoute\`
  - 인증 여부 판단을 각 페이지에 반복하지 않습니다.

페이지 컴포넌트는 Route 수준 흐름을 담당하고, UI 컴포넌트는 특정 Route를 몰라도 동작하도록 분리했습니다.

## 3. props와 state 차이

### props

부모가 자식에게 전달하는 입력값입니다.

\`\`\`text
NotesPage
  ↓ notes prop
NoteList
  ↓ note prop
NoteCard
\`\`\`

\`NoteCard\`는 note를 직접 변경하지 않고 전달받아 표시합니다.

### state

컴포넌트가 현재 UI 상태를 기억하기 위한 값입니다.

- \`NotesPage\`: \`query\`, \`category\`
- \`NoteForm\`: \`values\`, \`errors\`, \`submitting\`, \`requestError\`
- \`AuthContext\`: \`user\`, \`loading\`

state를 변경하면 React가 해당 컴포넌트의 렌더링을 다시 계산합니다.

## 4. 상태를 어디에 두었는가?

**그 상태가 필요한 가장 가까운 공통 위치**에 둡니다.

- 검색어는 \`NotesPage\`에서만 필요 → \`NotesPage\`
- 폼 입력값은 \`NoteForm\` 내부에서만 필요 → \`NoteForm\`
- 로그인 사용자는 Navigation, ProtectedRoute, Profile 등 여러 위치에서 필요 → \`AuthContext\`

무조건 전역 상태로 만들지 않는 이유는 상태의 영향 범위를 작게 유지하기 위해서입니다.

## 5. controlled input

\`NoteForm\`의 input 값은 DOM 자체가 아니라 React state가 기준입니다.

\`\`\`text
사용자 입력
→ onChange
→ setValues()
→ values 변경
→ re-render
→ input value와 글자 수 표시 변경
\`\`\`

따라서 검증, 제출 데이터, UI 표시가 하나의 state를 기준으로 일관되게 동작합니다.

## 6. useEffect는 왜 사용하는가?

\`useNotes\`:

\`\`\`text
컴포넌트 mount
→ useEffect 실행
→ loadNotes()
→ Supabase 요청
→ notes / error / loading 변경
→ UI re-render
\`\`\`

\`useNote(id)\`에서는 \`loadNote\`가 \`id\`에 의존합니다. Route의 \`id\`가 달라지면 callback이 새로 만들어지고 effect가 다시 실행되어 다른 상세 데이터를 가져옵니다.

### dependency array

effect가 사용하는 외부 값이 바뀌었을 때 다시 실행할 조건입니다.

의존성을 누락하면 이전 값을 참조하는 stale closure 문제가 생길 수 있고, 매 렌더마다 달라지는 값을 무심코 넣으면 불필요한 반복 요청이 발생할 수 있습니다.

## 7. 비동기 요청을 UI로 표현하는 방법

조회 Hook은 데이터뿐 아니라 \`loading\`, \`error\`를 함께 관리합니다.

\`\`\`text
loading = true
error = ""
        ↓
Supabase request
   ↙         ↘
성공          실패
data 변경     error 변경
   ↘         ↙
loading = false
\`\`\`

화면에서는 다음처럼 분기합니다.

\`\`\`text
loading → LoadingState
error   → ErrorState
data=[] → EmptyState
data    → 실제 콘텐츠
\`\`\`

loading은 아직 결과를 모르는 상태이고, empty는 요청이 정상적으로 끝났지만 결과가 없는 상태라는 점이 중요합니다.

## 8. 상태 변경 → 렌더링 변화 3곳

### ① 검색 / 분류

\`\`\`text
Input 또는 select 변경
→ query/category state 변경
→ filteredNotes 재계산
→ NoteList 변경
\`\`\`

### ② 폼 입력

\`\`\`text
입력
→ values 변경
→ input value + 글자 수 변경
→ validation 결과에 따라 error UI 변경
\`\`\`

### ③ 로그인

\`\`\`text
signIn
→ Supabase session 변경
→ AuthContext의 user 변경
→ Navigation 변경
→ ProtectedRoute 접근 허용
\`\`\`

추가로 원격 요청의 loading/error 변화도 화면 상태를 변경합니다.

## 9. Custom Hook으로 분리한 이유

\`useNotes\`와 \`useNote\`는 다음 책임을 묶습니다.

- 데이터를 요청하는 시점
- loading state
- error state
- 성공 데이터 state
- retry 함수

페이지는 결과를 받아 **어떤 화면을 보여줄지**만 결정합니다.

## 10. lib과 Hook의 차이

\`src/lib/notes.js\`

- React를 모릅니다.
- Supabase에 어떤 query를 보낼지만 담당합니다.
- 일반 async 함수입니다.

\`src/hooks/useNotes.js\`

- React state를 가집니다.
- \`useEffect\`로 요청 시점을 결정합니다.
- lib 함수를 호출한 뒤 결과를 React UI 상태로 변환합니다.

\`\`\`text
Page → Hook → lib → Supabase
         ↓
       state
         ↓
       Page
\`\`\`

## 11. 등록 기능 전체 흐름

\`\`\`text
/notes/new route
→ NewNotePage
→ NoteForm
→ 입력 이벤트
→ values state
→ submit
→ validation
→ submitting=true
→ createNote(values)
→ Supabase INSERT
→ 성공
→ navigate(/notes/:id)
→ NoteDetailPage
→ useNote(id)
→ Supabase SELECT
→ 상세 렌더링
\`\`\`

이 흐름 하나로 라우팅, 컴포넌트, 상태, 이벤트, 비동기 처리, 렌더링을 모두 설명할 수 있습니다.

## 12. useMemo는 무엇을 최적화하는가?

\`NotesPage\`의 \`filteredNotes\`는 \`notes\`, \`query\`, \`category\`가 같다면 이전 계산 결과를 재사용합니다.

현재 데이터 규모에서는 성능 차이가 매우 작습니다. \`useMemo\` 자체에도 비용이 있으므로 모든 계산에 사용하는 것은 적절하지 않습니다. 이 프로젝트에서는 메모이제이션의 의존성과 적용 방식을 명확하게 보여주기 위해 필터 계산에 한정했습니다.

## 13. Context를 사용한 이유

로그인 사용자 정보는 Navigation, ProtectedRoute, LoginPage, HomePage, ProfilePage에서 동시에 필요합니다.

이를 계속 props로 전달하면 prop drilling이 발생합니다. \`AuthContext\`를 사용하면 필요한 컴포넌트가 \`useAuth()\`로 같은 상태를 읽습니다.

반면 검색어나 폼 입력값은 여러 화면이 공유하지 않으므로 전역으로 만들지 않았습니다.

## 14. Supabase와 RLS

브라우저는 Publishable key로 Supabase에 접근합니다. 실제 데이터 권한은 \`supabase-schema.sql\`의 RLS policy가 제한합니다.

\`\`\`text
로그인 사용자 auth.uid()
        =
notes.user_id
\`\`\`

일치하는 데이터만 읽고, 쓰고, 수정하고, 삭제할 수 있습니다.

Database password나 server-side secret은 React에 넣지 않습니다.

## 15. SPA와 Vercel rewrite

React Router의 \`/notes/123\`은 서버에 실제 파일이 있는 경로가 아닙니다.

사용자가 해당 주소를 직접 입력하거나 새로고침하면 서버가 \`/notes/123\` 파일을 찾으려 할 수 있습니다. \`vercel.json\`은 요청을 \`index.html\`로 보내고 React Router가 URL을 해석하게 합니다.

## 16. 예상 질문

**Q. 왜 Redux를 사용하지 않았나?**  
공유 상태가 로그인 사용자 정도이므로 Context로 충분합니다. 더 큰 상태 관리 도구는 현재 요구사항보다 복잡합니다.

**Q. 왜 Supabase 호출을 페이지에서 직접 하지 않았나?**  
데이터 접근(\`lib\`)과 React 상태 관리(\`hooks\`)를 분리하면 책임과 데이터 흐름을 명확하게 설명할 수 있습니다.

**Q. loading과 empty는 무엇이 다른가?**  
loading은 아직 결과를 모르는 상태이고, empty는 요청이 성공했지만 데이터가 0개인 정상 결과입니다.

**Q. \`useEffect\` callback을 async로 직접 만들지 않은 이유는?**  
effect callback은 cleanup 함수 또는 \`undefined\`를 반환하는 구조이므로 별도 async 함수 \`loadNotes\`를 호출하도록 만들었습니다.

**Q. 왜 핵심 데이터를 하나만 사용했나?**  
미션 원문이 복잡한 백엔드보다 React의 컴포넌트·상태·이벤트·비동기 렌더링 학습을 우선하기 때문입니다.
