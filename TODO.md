# ☕ 카페 앱 구현 To-do

[BLUEPRINT.md](BLUEPRINT.md) 기준 구현 체크리스트입니다. 코드는 아직 작성하지 않았고, 아래 순서로 진행 예정입니다.
관리자/메뉴 관리를 최우선으로 두고, 이후 고객 기능을 메뉴 조회 → 장바구니 → 주문 순으로 진행합니다.

## Phase 0. 프로젝트 스캐폴딩 (선행 작업)
- [x] Next.js(App Router) + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] Prisma 설치 및 SQLite 연결
- [x] `list.html`/`detail.html`/`create.html` 폴더명 라우팅 동작 검증
- [x] 루트(`/`) → `/my/menu/list.html` 리다이렉트 구현
- [x] Prisma 스키마 작성 (Admin, Category, MenuItem, OptionGroup, OptionChoice, Order, OrderItem)
- [x] 시드 스크립트 작성 (초기 관리자 계정 + 샘플 메뉴 데이터)

## System 1. 메뉴 관리 시스템 (관리자)
- [x] Admin 비밀번호 해시(bcrypt) 및 시드 계정 준비
- [x] `POST /api/admin/login`, `POST /api/admin/logout` 구현
- [x] 세션 발급/검증 유틸(`lib/session.ts`) 구현
- [x] `middleware.ts`: `/admin/*` 보호 로직 (로그인 페이지 제외)
- [x] `/admin/login` 페이지 구현
- [x] `GET/POST /api/admin/menus` 구현
- [x] `GET/PUT/DELETE /api/admin/menus/:id` 구현
- [x] `/admin/menus/list.html` 페이지: 목록 + 품절 토글
- [x] `/admin/menus/detail.html?id=` 페이지: 상세/수정 폼
- [x] `/admin/menus/create.html` 페이지: 등록 폼
- [x] `MenuTable`, `MenuForm` 컴포넌트 구현

## System 2. 메뉴 조회 시스템 (고객)
- [x] `GET /api/menu` 구현 (카테고리 + 메뉴 목록)
- [x] `GET /api/menu/:id` 구현 (메뉴 상세 + 옵션)
- [x] `/my/menu/list.html` 페이지: 카테고리 탭 + 메뉴 카드 그리드
- [x] `/my/menu/detail.html?id=` 페이지: 옵션 선택 UI, 가격 재계산
- [x] `MenuCard`, `OptionSelector` 컴포넌트 구현

## System 3. 장바구니 관리 시스템 (고객)
- [ ] Zustand `cartStore` 구현 (localStorage persist)
- [ ] `/my/cart` 페이지: 항목 목록/수량 조절/삭제, 합계 표시
- [ ] `CartSummary` 컴포넌트 구현

## System 4. 주문 관리 시스템 (고객 주문 + 관리자 관리)
- [ ] `POST /api/orders` 구현 (주문 생성, 주문번호 채번 로직)
- [ ] `/my/checkout` 페이지: 주문자 정보 입력 폼(이름/연락처/픽업시간/요청사항)
- [ ] `/my/checkout/complete.html?orderId=` 페이지: 주문 요약 표시
- [ ] `GET /api/orders/lookup` 구현 (주문번호+연락처 조회)
- [ ] `/my/orders/list.html` 페이지: 조회 폼 + 결과
- [ ] `/my/orders/detail.html?orderNo=&phone=` 페이지: 상태 타임라인
- [ ] `OrderStatusTimeline` 컴포넌트 구현
- [ ] `GET /api/admin/orders` 구현
- [ ] `PATCH /api/admin/orders/:id` 구현 (상태 변경/취소)
- [ ] `/admin/orders/list.html` 페이지: 목록 + 상태 필터
- [ ] `/admin/orders/detail.html?id=` 페이지: 상세 + 상태 변경 액션
- [ ] `OrderTable`, `OrderStatusBadge` 컴포넌트 구현

## Phase 마지막. 다듬기 & QA
- [ ] 반응형 레이아웃 점검 (모바일/데스크톱)
- [ ] 로딩/에러/빈 상태 UI 처리
- [ ] 전체 사용자 흐름 수동 QA (고객 주문 플로우, 관리자 관리 플로우)
- [ ] 기본 접근성/SEO 체크
