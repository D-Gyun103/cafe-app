# ☕ 카페 앱 청사진 (Blueprint)

## 1. 개요
- **목적**: 고객이 웹에서 메뉴를 보고 주문/픽업하고, 관리자는 메뉴와 주문을 관리하는 웹앱
- **역할(Role)**: 별도의 익명 랜딩(인덱스) 페이지는 두지 않습니다. 루트(`/`)는 바로 고객 메뉴 목록(`/my/menu/list.html`)으로 리다이렉트되며,
  이 문서 이후 모든 구성(화면/폴더/API)은 아래 2개 역할 기준으로 나눕니다.
  | 역할 | 설명 | 인증 |
  |---|---|---|
  | **고객 (Customer)** | 메뉴 ~조회~주문까지 진행하는 사용자, `/my` 하위 경로 사용 | 없음 (비회원) |
  | **관리자 (Admin)** | 메뉴/주문을 관리하는 운영자, `/admin` 하위 경로 ₩사용 | 간단한 로그인 (ID/PW) |
- **URL 컨벤션**: 목록/상세/등록이 필요한 리소스(관리자 메뉴·주문, 고객 주문)는 전통적인 다중 페이지 방식으로
  `list.html` / `detail.html` / `create.html` 파일명을 그대로 URL에 노출합니다. 상세·수정 대상은 쿼리스트링(`?id=`)으로 지정합니다.
  > 예: `/admin/menus/list.html`, `/admin/menus/detail.html?id=12`

## 2. 핵심 기능 (MVP)
### 고객 (`/my`)
1. **메뉴 조회**: 카테고리별 메뉴 목록, 이미지, 가격, 설명 (앱의 실질적인 홈)
2. **메뉴 상세/옵션 선택**: 사이즈, 샷 추가, 시럽, ICE/HOT, 수량
3. **장바구니**: 담은 메뉴 목록, 수량 조절, 옵션별 가격 재계산, 합계 표시
4. **결제(주문 생성)**: 이름, 연락처, 픽업 예정 시간, 요청사항 입력 후 주문 생성 + 완료 화면
5. **주문 내역 조회**: 주문 번호 + 연락처로 주문 상태(접수/제조중/픽업대기/완료) 확인

### 관리자 (`/admin`)
6. **관리자 로그인**: ID/PW 로그인, 세션 쿠키 발급
7. **메뉴 관리**: 카테고리/메뉴/옵션 목록·상세·등록(CRUD), 품절(판매중지) 토글
8. **주문 관리**: 주문 목록·상세 확인, 주문 상태 변경(접수→제조중→픽업대기→완료), 주문 취소

## 3. 사용자 흐름
**고객 흐름**
```
/ (→ /my/menu/list.html 리다이렉트) → /my/menu/detail.html?id= (옵션 선택) → /my/cart
   → /my/checkout (주문자 정보 입력) → /my/checkout/complete.html?orderId=
   → (선택) /my/orders/list.html → /my/orders/detail.html?orderNo=&phone=
```

**관리자 흐름**
```
/admin/login → /admin/menus/list.html → /admin/menus/detail.html?id= / /admin/menus/create.html
             → /admin/orders/list.html → /admin/orders/detail.html?id= (상태 변경)
```

## 4. 화면 구성 (역할별)
| 역할 | 경로 | 화면 | 설명 |
|---|---|---|---|
| 공통 | `/` | 루트 리다이렉트 | `/my/menu/list.html`로 리다이렉트 (별도 화면 없음) |
| 고객 | `/my/menu/list.html` | 메뉴 조회 | 카테고리 탭 + 메뉴 카드 그리드 (사실상 홈) |
| 고객 | `/my/menu/detail.html?id=` | 메뉴 상세 | 옵션 선택 후 장바구니 담기 |
| 고객 | `/my/cart` | 장바구니 | 담은 항목 확인/수정 |
| 고객 | `/my/checkout` | 결제 | 이름/연락처/픽업시간/요청사항 → 주문 생성 |
| 고객 | `/my/checkout/complete.html?orderId=` | 주문 완료 | 주문 요약 + 주문 번호 |
| 고객 | `/my/orders/list.html` | 주문 내역 조회 | 주문번호+연락처 입력 폼 및 조회 결과 |
| 고객 | `/my/orders/detail.html?orderNo=&phone=` | 주문 상세 상태 | 단일 주문의 상태 타임라인 |
| 관리자 | `/admin/login` | 관리자 로그인 | ID/PW 입력 |
| 관리자 | `/admin/menus/list.html` | 메뉴 관리(목록) | 카테고리/메뉴 목록, 품절 토글 |
| 관리자 | `/admin/menus/detail.html?id=` | 메뉴 관리(상세/수정) | 메뉴+옵션 상세 조회 및 수정 |
| 관리자 | `/admin/menus/create.html` | 메뉴 관리(등록) | 신규 메뉴/옵션 등록 |
| 관리자 | `/admin/orders/list.html` | 주문 관리(목록) | 전체 주문 목록, 상태 필터 |
| 관리자 | `/admin/orders/detail.html?id=` | 주문 관리(상세) | 주문 상세, 상태 변경, 취소 |

## 5. 기술 스택 (추천)
- **프레임워크**: Next.js (App Router) + TypeScript
  - App Router는 폴더명을 URL 세그먼트로 그대로 사용하므로 `list.html`, `detail.html`, `create.html`이라는 이름의 폴더를 만들면
    (예: `app/admin/menus/list.html/page.tsx`) 실제 URL도 `.html`이 붙은 형태로 노출됩니다. 특수 라우팅 문법(`[]`, `()`, `@`)과 충돌하지 않아 문제없이 동작합니다.
  - 루트(`/`)는 `app/page.tsx`에서 `redirect('/my/menu/list.html')` 처리
- **스타일링**: Tailwind CSS
- **상태 관리**: 장바구니는 클라이언트 상태(Zustand) + localStorage 유지
- **DB**: SQLite + Prisma ORM (로컬 개발 간편, 추후 Postgres 전환 용이)
- **API**: Next.js Route Handlers (`/app/api/*`)로 역할별 REST API 구성. 페이지(`list.html` 등)는 서버 컴포넌트에서 직접 데이터를 조회하고,
  등록/수정/상태 변경 같은 액션은 Route Handler 또는 Server Action 호출
- **관리자 인증**: bcrypt로 비밀번호 해시 저장, 로그인 성공 시 서명된 세션 쿠키(iron-session 또는 자체 JWT) 발급,
  `middleware.ts`에서 `/admin/*`(로그인 페이지 제외) 접근 시 쿠키 검증 후 미인증 시 `/admin/login`으로 리다이렉트
- **이미지**: `/public` 정적 이미지로 시작, 추후 이미지 스토리지 연동 가능
- **배포(추후)**: Vercel 또는 Node 서버 호스팅

## 6. 데이터 모델 (초안)
```
Admin (id, username, passwordHash, createdAt)

Category (id, name, sortOrder)
MenuItem (id, categoryId, name, description, basePrice, imageUrl, isAvailable)
OptionGroup (id, menuItemId, name, type[single|multi], required)
OptionChoice (id, optionGroupId, name, extraPrice)

Order (id, orderNo, customerName, phone, pickupTime, note, status, totalPrice, createdAt)
OrderItem (id, orderId, menuItemId, quantity, unitPrice, selectedOptions(JSON))
```
- `status`: `RECEIVED` → `PREPARING` → `READY` → `COMPLETED` (+ `CANCELLED`)

## 7. API 설계 (역할별, 초안)
| 역할 | Method | 경로 | 설명 |
|---|---|---|---|
| 공개 | GET | `/api/menu` | 카테고리 + 메뉴 목록 조회 |
| 공개 | GET | `/api/menu/:id` | 메뉴 상세(옵션 포함) 조회 |
| 고객 | POST | `/api/orders` | 주문 생성 (결제 단계) |
| 고객 | GET | `/api/orders/lookup?orderNo=&phone=` | 주문 상태 조회 |
| 관리자 | POST | `/api/admin/login` | 로그인, 세션 쿠키 발급 |
| 관리자 | POST | `/api/admin/logout` | 로그아웃, 세션 쿠키 삭제 |
| 관리자 | GET/POST | `/api/admin/menus` | 메뉴 목록 조회 / 신규 등록 |
| 관리자 | GET/PUT/DELETE | `/api/admin/menus/:id` | 메뉴 상세 조회 / 수정 / 삭제 |
| 관리자 | GET | `/api/admin/orders` | 전체 주문 목록 조회 |
| 관리자 | PATCH | `/api/admin/orders/:id` | 주문 상태 변경/취소 |

> `/api/admin/*`는 모두 `middleware.ts`에서 세션 쿠키 검증을 거칩니다.

## 8. 폴더 구조 (역할별, Clean URL + list/detail/create 컨벤션)
```
cafe-app/
  middleware.ts                              # /admin/* 접근 시 관리자 세션 검증

  app/
    page.tsx                                 # "/" → redirect('/my/menu/list.html')

    my/
      menu/
        list.html/page.tsx                   # 메뉴 조회 - 고객              →  /my/menu/list.html
        detail.html/page.tsx                 # 메뉴 상세(옵션 선택, ?id=)   →  /my/menu/detail.html
      cart/
        page.tsx                             # 장바구니 - 고객               →  /my/cart
      checkout/
        page.tsx                             # 결제(주문자 정보 입력)       →  /my/checkout
        complete.html/page.tsx               # 주문 완료(?orderId=)         →  /my/checkout/complete.html
      orders/
        list.html/page.tsx                   # 주문 내역 조회 폼/결과       →  /my/orders/list.html
        detail.html/page.tsx                 # 주문 상세 상태(?orderNo=&phone=) → /my/orders/detail.html

    admin/
      login/page.tsx                         # 관리자 로그인                →  /admin/login
      menus/
        list.html/page.tsx                   # 메뉴 관리(목록)              →  /admin/menus/list.html
        detail.html/page.tsx                 # 메뉴 관리(상세/수정, ?id=)   →  /admin/menus/detail.html
        create.html/page.tsx                 # 메뉴 관리(등록)              →  /admin/menus/create.html
      orders/
        list.html/page.tsx                   # 주문 관리(목록)              →  /admin/orders/list.html
        detail.html/page.tsx                 # 주문 관리(상세, ?id=)        →  /admin/orders/detail.html

    api/
      menu/route.ts
      menu/[id]/route.ts
      orders/route.ts
      orders/lookup/route.ts
      admin/
        login/route.ts
        logout/route.ts
        menus/route.ts
        menus/[id]/route.ts
        orders/route.ts
        orders/[id]/route.ts

  components/
    customer/                                # /my 전용 컴포넌트
      MenuCard.tsx
      OptionSelector.tsx
      CartSummary.tsx
      OrderStatusTimeline.tsx
    admin/                                   # /admin 전용 컴포넌트
      MenuTable.tsx
      MenuForm.tsx
      OrderTable.tsx
      OrderStatusBadge.tsx
    shared/                                  # 역할 무관 공통 컴포넌트
      Header.tsx
      Button.tsx

  lib/
    prisma.ts
    session.ts                               # 관리자 세션 발급/검증 유틸
    cartStore.ts                             # zustand (고객 전용)

  prisma/
    schema.prisma
    seed.ts                                  # 초기 관리자 계정 + 메뉴 시드

  public/images/...
```

## 9. 향후 확장 (2차 범위)
- 고객 회원가입/로그인, 포인트·쿠폰 적립 (도입 시 `/my/orders`가 실제 "내 주문 목록"으로 전환)
- 브랜드 소개/매장 정보(위치·영업시간) 페이지가 필요해지면 `/my/about` 등으로 추가
- 실제 결제 수단 연동(토스페이먼츠 등) — 현재는 "결제 화면"이 주문 접수까지만 처리
- 관리자 역할 세분화(매니저/스태프), 관리자 다중 계정
- 실시간 주문 알림(웹소켓/푸시), 매출 통계 대시보드
- 다국어 지원

## 10. 개발 단계 제안
관리자 메뉴 관리를 최우선으로 구현하고, 이후 고객 기능을 메뉴 조회 → 장바구니 → 주문 순으로 진행합니다. 상세 체크리스트는 [TODO.md](TODO.md) 참고.
1. **Step 0**: 프로젝트 스캐폴딩 (Next.js + Tailwind + Prisma 세팅, `list.html`/`detail.html`/`create.html` 라우팅 동작 검증, 루트 리다이렉트, 시드 데이터)
2. **System 1**: 관리자 - 로그인/세션(middleware) + `/admin/menus/list.html`, `detail.html`, `create.html` (메뉴 관리 시스템)
3. **System 2**: 고객 - `/my/menu/list.html`, `/my/menu/detail.html` + 옵션 선택 UI (메뉴 조회 시스템)
4. **System 3**: 고객 - `/my/cart` (Zustand + localStorage) (장바구니 관리 시스템)
5. **System 4**: 고객 `/my/checkout` + `complete.html` + `/my/orders/list.html`, `detail.html` / 관리자 `/admin/orders/list.html`, `detail.html` (주문 관리 시스템)
6. **Step 마지막**: UI 다듬기(반응형, 로딩/에러 상태) 및 전체 QA

---
*이 문서는 초안입니다. 검토 후 수정사항을 반영하고 Step 1부터 구현을 시작하겠습니다.*
