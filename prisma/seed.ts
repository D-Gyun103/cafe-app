import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin1234";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.admin.upsert({
    where: { username: ADMIN_USERNAME },
    update: {},
    create: { username: ADMIN_USERNAME, passwordHash },
  });

  const coffee = await prisma.category.upsert({
    where: { id: "cat-coffee" },
    update: {},
    create: { id: "cat-coffee", name: "커피", sortOrder: 1 },
  });
  const nonCoffee = await prisma.category.upsert({
    where: { id: "cat-non-coffee" },
    update: {},
    create: { id: "cat-non-coffee", name: "논커피", sortOrder: 2 },
  });

  const americano = await prisma.menuItem.upsert({
    where: { id: "menu-americano" },
    update: {},
    create: {
      id: "menu-americano",
      categoryId: coffee.id,
      name: "아메리카노",
      description: "깔끔한 에스프레소와 물의 조화",
      basePrice: 4000,
      isAvailable: true,
    },
  });

  await prisma.optionGroup.upsert({
    where: { id: "opt-americano-size" },
    update: {},
    create: {
      id: "opt-americano-size",
      menuItemId: americano.id,
      name: "사이즈",
      type: "single",
      required: true,
      choices: {
        create: [
          { name: "Small", extraPrice: 0 },
          { name: "Medium", extraPrice: 500 },
          { name: "Large", extraPrice: 1000 },
        ],
      },
    },
  });

  await prisma.optionGroup.upsert({
    where: { id: "opt-americano-temp" },
    update: {},
    create: {
      id: "opt-americano-temp",
      menuItemId: americano.id,
      name: "온도",
      type: "single",
      required: true,
      choices: {
        create: [
          { name: "ICE", extraPrice: 0 },
          { name: "HOT", extraPrice: 0 },
        ],
      },
    },
  });

  const latte = await prisma.menuItem.upsert({
    where: { id: "menu-latte" },
    update: {},
    create: {
      id: "menu-latte",
      categoryId: coffee.id,
      name: "카페라떼",
      description: "부드러운 우유와 에스프레소",
      basePrice: 4500,
      isAvailable: true,
    },
  });

  await prisma.optionGroup.upsert({
    where: { id: "opt-latte-shot" },
    update: {},
    create: {
      id: "opt-latte-shot",
      menuItemId: latte.id,
      name: "샷 추가",
      type: "multi",
      required: false,
      choices: {
        create: [{ name: "샷 추가 1개", extraPrice: 500 }],
      },
    },
  });

  await prisma.menuItem.upsert({
    where: { id: "menu-choco" },
    update: {},
    create: {
      id: "menu-choco",
      categoryId: nonCoffee.id,
      name: "초코라떼",
      description: "진한 초콜릿과 부드러운 우유",
      basePrice: 5000,
      isAvailable: true,
    },
  });

  console.log(`Seed complete. Admin login → username: ${ADMIN_USERNAME} / password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
