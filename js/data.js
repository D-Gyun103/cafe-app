// 메뉴/카테고리 시드 데이터 + 최초 로드 시 localStorage 초기화
// utils.js(getMenus, saveMenus)가 먼저 로드되어 있어야 함

const MENU_SEED = [
  {
    id: "menu_americano",
    category: "커피",
    name: "아메리카노",
    description: "깊고 진한 에스프레소와 물의 조화",
    price: 4000,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_americano_size",
        name: "사이즈",
        type: "single",
        required: true,
        choices: [
          { id: "choice_size_s", name: "Small", extraPrice: 0 },
          { id: "choice_size_m", name: "Medium", extraPrice: 500 },
          { id: "choice_size_l", name: "Large", extraPrice: 1000 },
        ],
      },
      {
        id: "opt_americano_temp",
        name: "ICE/HOT",
        type: "single",
        required: true,
        choices: [
          { id: "choice_temp_ice", name: "ICE", extraPrice: 0 },
          { id: "choice_temp_hot", name: "HOT", extraPrice: 0 },
        ],
      },
      {
        id: "opt_americano_shot",
        name: "샷 추가",
        type: "multi",
        required: false,
        choices: [{ id: "choice_shot_extra", name: "샷 추가", extraPrice: 500 }],
      },
    ],
  },
  {
    id: "menu_latte",
    category: "커피",
    name: "카페라떼",
    description: "부드러운 우유와 에스프레소",
    price: 4500,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_latte_size",
        name: "사이즈",
        type: "single",
        required: true,
        choices: [
          { id: "choice_size_s", name: "Small", extraPrice: 0 },
          { id: "choice_size_m", name: "Medium", extraPrice: 500 },
          { id: "choice_size_l", name: "Large", extraPrice: 1000 },
        ],
      },
      {
        id: "opt_latte_temp",
        name: "ICE/HOT",
        type: "single",
        required: true,
        choices: [
          { id: "choice_temp_ice", name: "ICE", extraPrice: 0 },
          { id: "choice_temp_hot", name: "HOT", extraPrice: 0 },
        ],
      },
      {
        id: "opt_latte_syrup",
        name: "시럽",
        type: "multi",
        required: false,
        choices: [
          { id: "choice_syrup_vanilla", name: "바닐라 시럽", extraPrice: 500 },
          { id: "choice_syrup_hazelnut", name: "헤이즐넛 시럽", extraPrice: 500 },
        ],
      },
    ],
  },
  {
    id: "menu_cappuccino",
    category: "커피",
    name: "카푸치노",
    description: "풍성한 우유 거품이 올라간 커피",
    price: 4500,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_cappuccino_size",
        name: "사이즈",
        type: "single",
        required: true,
        choices: [
          { id: "choice_size_s", name: "Small", extraPrice: 0 },
          { id: "choice_size_m", name: "Medium", extraPrice: 500 },
        ],
      },
      {
        id: "opt_cappuccino_temp",
        name: "ICE/HOT",
        type: "single",
        required: true,
        choices: [
          { id: "choice_temp_ice", name: "ICE", extraPrice: 0 },
          { id: "choice_temp_hot", name: "HOT", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu_choco_latte",
    category: "논커피",
    name: "초코라떼",
    description: "진한 초콜릿과 우유의 달콤한 만남",
    price: 5000,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_choco_temp",
        name: "ICE/HOT",
        type: "single",
        required: true,
        choices: [
          { id: "choice_temp_ice", name: "ICE", extraPrice: 0 },
          { id: "choice_temp_hot", name: "HOT", extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: "menu_grapefruit_ade",
    category: "논커피",
    name: "자몽에이드",
    description: "상큼한 자몽과 탄산의 조화",
    price: 5500,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_grapefruit_size",
        name: "사이즈",
        type: "single",
        required: true,
        choices: [
          { id: "choice_size_s", name: "Small", extraPrice: 0 },
          { id: "choice_size_l", name: "Large", extraPrice: 1000 },
        ],
      },
    ],
  },
  {
    id: "menu_tiramisu",
    category: "디저트",
    name: "티라미수",
    description: "부드러운 마스카포네 크림과 커피 시트",
    price: 6500,
    imageUrl: "",
    soldOut: false,
    options: [],
  },
  {
    id: "menu_croffle",
    category: "디저트",
    name: "크로플",
    description: "바삭한 크루아상 와플",
    price: 5500,
    imageUrl: "",
    soldOut: false,
    options: [
      {
        id: "opt_croffle_topping",
        name: "토핑 추가",
        type: "multi",
        required: false,
        choices: [
          { id: "choice_topping_icecream", name: "아이스크림", extraPrice: 1000 },
          { id: "choice_topping_syrup", name: "메이플 시럽", extraPrice: 500 },
        ],
      },
    ],
  },
];

// localStorage에 메뉴 데이터가 없을 때만 시드 데이터로 초기화
function initMenus() {
  const existing = getMenus();
  if (!existing || existing.length === 0) {
    saveMenus(MENU_SEED);
  }
}

initMenus();
