// 공통 유틸리티: localStorage 접근, 포맷팅, 가격 계산

const STORAGE_KEYS = {
  MENUS: "cafe:menus",
  BASKET: "cafe:basket",
  ORDERS: "cafe:orders",
};

const ORDER_STATUS = {
  RECEIVED: "RECEIVED",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const ORDER_STATUS_LABEL = {
  RECEIVED: "접수",
  PREPARING: "제조중",
  READY: "픽업대기",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateOrderNo() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}

function formatPrice(amount) {
  return `${Number(amount).toLocaleString("ko-KR")}원`;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`localStorage 읽기 실패: ${key}`, err);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getMenus() {
  return readStorage(STORAGE_KEYS.MENUS, []);
}

function saveMenus(menus) {
  writeStorage(STORAGE_KEYS.MENUS, menus);
}

function getBasket() {
  return readStorage(STORAGE_KEYS.BASKET, []);
}

function saveBasket(basket) {
  writeStorage(STORAGE_KEYS.BASKET, basket);
}

function getOrders() {
  return readStorage(STORAGE_KEYS.ORDERS, []);
}

function saveOrders(orders) {
  writeStorage(STORAGE_KEYS.ORDERS, orders);
}

// 옵션별 추가 금액을 합산한 단가 계산
function calculateUnitPrice(basePrice, selectedOptions) {
  const extra = selectedOptions.reduce((sum, opt) => sum + opt.extraPrice, 0);
  return basePrice + extra;
}

// 장바구니 전체 합계
function calculateBasketTotal(basket) {
  return basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
