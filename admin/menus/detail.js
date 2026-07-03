// 관리자 - 메뉴 상세 페이지

function getMenuIdFromQuery() {
  return new URLSearchParams(window.location.search).get("id");
}

function renderOptionGroup(group) {
  const section = document.createElement("div");
  section.className = "option-group";
  section.innerHTML = `
    <h3>${group.name} ${group.required ? '<span class="required-tag">필수</span>' : ""}</h3>
    ${group.choices
      .map(
        (choice) => `
      <div class="option-choice">
        <span>${choice.name}</span>
        <span>${choice.extraPrice > 0 ? `+${formatPrice(choice.extraPrice)}` : "무료"}</span>
      </div>
    `
      )
      .join("")}
  `;
  return section;
}

function renderMenuDetail(menu) {
  const container = document.getElementById("menuDetail");
  container.innerHTML = `
    <div class="detail-thumb">☕</div>
    <span class="detail-category">${menu.category}</span>
    <h1 class="detail-name">${menu.name}</h1>
    <p class="detail-description">${menu.description ?? ""}</p>
    <p class="detail-price">${formatPrice(menu.price)}</p>
    <div class="detail-status-row">
      <span class="badge ${menu.soldOut ? "badge-sold-out" : "badge-available"}">
        ${menu.soldOut ? "품절" : "판매중"}
      </span>
      <button type="button" id="toggleSoldOutBtn" class="btn-toggle">
        ${menu.soldOut ? "판매 재개" : "품절 처리"}
      </button>
    </div>
    <div class="option-groups"></div>
  `;

  const optionGroupsContainer = container.querySelector(".option-groups");
  if (menu.options.length === 0) {
    optionGroupsContainer.innerHTML =
      '<p class="empty-state">등록된 옵션이 없습니다.</p>';
  } else {
    menu.options.forEach((group) => optionGroupsContainer.appendChild(renderOptionGroup(group)));
  }

  document.getElementById("toggleSoldOutBtn").addEventListener("click", () => {
    toggleSoldOut(menu.id);
  });
}

function toggleSoldOut(menuId) {
  const menus = getMenus();
  const updated = menus.map((menu) =>
    menu.id === menuId ? { ...menu, soldOut: !menu.soldOut } : menu
  );
  saveMenus(updated);
  const refreshed = updated.find((menu) => menu.id === menuId);
  renderMenuDetail(refreshed);
}

document.addEventListener("DOMContentLoaded", () => {
  const menuId = getMenuIdFromQuery();
  const menu = menuId ? getMenus().find((m) => m.id === menuId) : null;

  if (!menu) {
    document.getElementById("notFound").hidden = false;
    return;
  }

  renderMenuDetail(menu);
});
