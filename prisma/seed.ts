import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.notificationRecord.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.order.deleteMany();
  await prisma.aiDraft.deleteMany();
  await prisma.impactRecord.deleteMany();
  await prisma.product.deleteMany();
  await prisma.donationCase.deleteMany();
  await prisma.user.deleteMany();

  const donor = await prisma.user.create({
    data: {
      id: "seed-donor-1",
      role: "USER",
      nickname: "爱心用户A",
      mobile: "13800000000",
      notificationPreferences: ["APP", "MINIPROGRAM"],
      status: "ACTIVE"
    }
  });

  await prisma.user.create({
    data: {
      id: "seed-admin-1",
      role: "ADMIN",
      nickname: "运营管理员",
      mobile: "13900000000",
      notificationPreferences: ["APP"],
      status: "ACTIVE"
    }
  });

  const donationCase = await prisma.donationCase.create({
    data: {
      id: "seed-case-1",
      userId: donor.id,
      title: "儿童绘本",
      category: "图书文具",
      conditionLabel: "九成新",
      description: "适合 6 到 8 岁儿童阅读",
      deliveryMethod: "用户自送",
      contactPhone: "13800000000",
      status: "待审核"
    }
  });

  await prisma.aiDraft.create({
    data: {
      donationCaseId: donationCase.id,
      suggestedCategory: "图书文具",
      suggestedTitle: "儿童绘本套装",
      suggestedDescription: "平台已根据捐赠信息整理为更适合上架的文案。",
      suggestedTags: ["亲子", "阅读", "公益流转"],
      suggestedPriceInCents: 2900,
      provider: "seed",
      accepted: false
    }
  });

  await prisma.product.create({
    data: {
      id: "seed-product-1",
      donationCaseId: donationCase.id,
      title: "儿童绘本套装",
      description: "精选儿童绘本，适合亲子阅读。",
      category: "图书文具",
      conditionLabel: "九成新",
      priceInCents: 2900,
      status: "销售中",
      isUnique: true,
      publishedAt: new Date()
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
