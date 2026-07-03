// 관리자 - 메뉴 목록 페이지

function groupByCategory(menus) {
  const groups = new Map();
  menus.forEach((menu) => {
    if (!groups.has(menu.category)) groups.set(menu.category, []);
    groups.get(menu.category).push(menu);
  });
  return groups;
}

function renderMenuCard(menu) {
  const card = document.createElement("div");
  card.className = `menu-card${menu.soldOut ? " sold-out" : ""}`;
  card.innerHTML = `
    <div class="menu-thumb">☕</div>
    <div class="menu-info">
      <h3>${menu.name}</h3>
      <p>${menu.description ?? ""}</p>
      <p class="menu-price">${formatPrice(menu.price)}</p>
    </div>
    <div class="menu-actions">
      <span class="badge ${menu.soldOut ? "badge-sold-out" : "badge-available"}">
        ${menu.soldOut ? "품절" : "판매중"}
      </span>
      <div class="menu-action-buttons">
        <button type="button" class="btn-outline" data-action="toggle-sold-out" data-id="${menu.id}">
          ${menu.soldOut ? "판매 재개" : "품절 처리"}
        </button>
        <a href="detail.html?id=${menu.id}" class="btn-outline">상세</a>
      </div>
    </div>
  `;
  return card;
}

function renderMenuList() {
  const container = document.getElementById("menuGroups");
  const emptyState = document.getElementById("emptyState");
  const menus = getMenus();

  container.innerHTML = "";

  if (menus.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  const groups = groupByCategory(menus);
  groups.forEach((menuItems, category) => {
    const section = document.createElement("section");
    section.className = "menu-category";

    const heading = document.createElement("h2");
    heading.textContent = category;
    section.appendChild(heading);

    menuItems.forEach((menu) => section.appendChild(renderMenuCard(menu)));
    container.appendChild(section);
  });
}

function toggleSoldOut(menuId) {
  const menus = getMenus();
  const updated = menus.map((menu) =>
    menu.id === menuId ? { ...menu, soldOut: !menu.soldOut } : menu
  );
  saveMenus(updated);
  renderMenuList();
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenuList();

  document.getElementById("menuGroups").addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="toggle-sold-out"]');
    if (!button) return;
    toggleSoldOut(button.dataset.id);
  });
});
