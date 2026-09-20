# 구현 검증 기록

## 정적 검증

| 확인 항목 | 결과 |
|---|---|
| React Route 5개 이상 | PASS — 7개 + Not Found |
| 목록 / 상세 Route | PASS |
| 등록 / 조회 / 수정 / 삭제 코드 | PASS |
| controlled form | PASS |
| 필수값 검증 | PASS |
| 제출 중 UI | PASS |
| 공통 loading/error/empty | PASS |
| `pages/components/hooks/lib` 역할 분리 | PASS |
| Custom Hook | PASS — `useNotes`, `useNote` |
| 재사용 컴포넌트 8개 이상 | PASS |
| 상태→렌더링 변화 3개 이상 | PASS |
| Context 보너스 | PASS |
| 메모이제이션 보너스 | PASS — `useMemo` |
| Auth + 보호 Route 보너스 | PASS |
| `.env` ignore | PASS |
| 실제 secret commit | PASS — 없음 |
| JS/JSX syntax parsing | PASS |
| 상대 import 대상 존재 여부 | PASS |

## 실제 실행 검증 상태

작업 환경에서 npm registry 다운로드가 시간 제한 내 완료되지 않아 여기서는 `npm install` / production build 성공을 주장하지 않습니다.

Vercel 배포에서는 아래 항목을 최종 확인해야 합니다.

- Vercel build 성공
- 홈 / 로그인 / 회원가입
- 보호 Route redirect
- 빈 목록 상태
- 등록
- 목록 조회
- 상세 조회
- 수정
- 삭제
- 검색 / 분류 필터
- 잘못된 URL의 Not Found
- 상세 URL 직접 접근 및 새로고침
- 요청 실패 시 error UI

Supabase SQL과 Vercel 환경변수를 설정한 뒤 실제 배포 결과를 기준으로 최종 검증합니다.
