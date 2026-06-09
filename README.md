# N.Flying POCA — 포카리스트 웹앱

N.Flying 포토카드 컬렉션을 탐색·검색하고, 원하는 카드를 **포토북**에 담아 PNG로 저장·공유하는 읽기 전용 웹앱입니다.

> PRD `NF POCA PRD PUBLIC.pdf` + 디자인 핸드오프(`NF POCA Hi-Fi.html`) 기준으로 구현했으며,
> **데이터 소스는 Notion API → Supabase로 변경**했습니다 (PRD 6장 "Supabase 이전 시 백엔드 레이어만 교체" 반영).

## 기술 스택

| 항목 | 사용 |
|---|---|
| 프레임워크 | React 19 + Vite |
| 상태 관리 | Zustand |
| 가상 스크롤 | virtua (`VList`) |
| 드래그 정렬 | @dnd-kit/sortable |
| 이미지 export | html2canvas (동적 import) |
| 데이터 | **Supabase** (`poca_cards` 테이블, 공개 읽기) |

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드 → dist/
```

## 환경 변수 (`.env`)

읽기 전용 공개 페이지이므로 **publishable(anon) 키만** 사용합니다. `service_role` 키는 절대 클라이언트에 두지 마세요.

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_KEY=sb_publishable_xxx
VITE_SUPABASE_TABLE=poca_cards
```

## Supabase 데이터

- 테이블: `public.poca_cards` — RLS `SELECT` 정책(`public read`, `using (true)`)으로 anon 읽기 허용
- 이미지: Storage 공개 버킷 `poca-images` (CORS 허용 → html2canvas 캡처 가능)
- 전략(PRD 3장): 전체 1회 fetch(1000행 단위 페이지네이션) → 클라이언트 메모리 저장 → 필터·검색·정렬은 모두 클라이언트 처리. 로딩 중 `N / total` 진행 표시.

### 필드 매핑 (`src/lib/supabase.js` `normalize`)

| poca_cards 컬럼 | 앱 모델 | 비고 |
|---|---|---|
| `name` | name | 포카명 |
| `members` (text[]) | members / member | 멀티 멤버, member=대표값 |
| `kind` | kind | 종류 |
| `album` \| `origin` | album | 출처/앨범 |
| `year` | year | 연도 |
| `image_url` \| `photos[0]` | image | 사진 (없으면 플레이스홀더) |
| `source` \| `origin` | source | 매체 |
| `date` | date | 발매 |
| `note` | note | 비고 |

> 필터 옵션(멤버/종류/앨범/연도)은 하드코딩이 아니라 적재된 데이터에서 **동적으로 생성**됩니다(`useStore.facets`).

## 화면 구성 (`src/screens`)

- **MainScreen** — 헤더(로고+포카 제보) · 2×2 필터 · 뷰 툴바(포토북/검색/리스트·그리드) · 결과 카운트 · 가상 스크롤 리스트/그리드 · 그리드 하단 플로팅 바
- **FilterModal** — 4탭 바텀시트(멤버/종류/앨범·콘서트/연도), 리스트형·칩형, 로컬 드래프트 후 `적용하기`
- **DetailScreen** — 히어로 이미지 + 메타데이터(멤버/출처/매체/종류/발매) + 포토북 담기 + 공유(Web Share)
- **PhotobookEditScreen** — N장 뱃지, 드래그 순서 변경, 개별/전체 제거
- **PhotobookExportScreen** — 4열 고정 프리뷰 → `html2canvas` PNG 저장(`nf_poca_YYYYMMDD_HHMMSS.png`) · 공유 · 오류 제보(mailto)

## 디자인 토큰

`src/lib/tokens.js` / `src/index.css`. 색상·타이포·radius·shadow는 핸드오프 사양을 그대로 반영.
카드 비율은 `aspect-ratio` 대신 **`height:0; padding-bottom`(`--card-ratio`) 해킹**으로 전 브라우저 호환, 이미지는 `position:absolute; top:0; left:0`, 그리드 셀엔 `min-width:0`.

## 포토북 상태

`photobook`은 카드 id 배열(순서 보존). 필터·검색·스크롤 중에도 유지되며 **새로고침 시 초기화**(PRD 4-3).
