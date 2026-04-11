import { DonationStatus, OrderStatus, ProductStatus } from "@ccf/shared";
import type { PrismaClient } from "@prisma/client";
import type {
  AiDraftRecord,
  DonationCaseRecord,
  ProductRecord
} from "../runtime";

const DEFAULT_USER_ID = "demo-user";
const DEFAULT_REVIEWER_ID = "admin-demo";

let prismaClientPromise: Promise<PrismaClient | null> | null = null;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

async function createPrismaClient(): Promise<PrismaClient | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function getPrismaClient() {
  if (!prismaClientPromise) {
    prismaClientPromise = createPrismaClient();
  }

  return prismaClientPromise;
}

async function ensureDemoUser(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {},
    create: {
      id: DEFAULT_USER_ID,
      role: "ADMIN",
      nickname: "demo-user",
      notificationPreferences: []
    }
  });
}

export async function persistDonationCase(record: DonationCaseRecord) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return false;
  }

  await ensureDemoUser(prisma);
  await prisma.donationCase.upsert({
    where: { id: record.id },
    update: {
      title: record.title,
      rawItemName: record.title,
      rawDescription: record.description,
      rawCondition: record.conditionLabel,
      rawImages: record.rawImageUrls ?? (record.rawImageUrl ? [record.rawImageUrl] : []),
      conditionLabel: record.conditionLabel,
      description: record.description,
      status: record.status
    },
    create: {
      id: record.id,
      userId: DEFAULT_USER_ID,
      title: record.title,
      rawItemName: record.title,
      rawDescription: record.description,
      rawCondition: record.conditionLabel,
      rawImages: record.rawImageUrls ?? (record.rawImageUrl ? [record.rawImageUrl] : []),
      conditionLabel: record.conditionLabel,
      description: record.description,
      status: record.status
    }
  });

  return true;
}

export async function persistAiDraft(draft: AiDraftRecord) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return false;
  }

  await prisma.aiDraft.upsert({
    where: { donationCaseId: draft.donationCaseId },
    update: {
      suggestedCategory: draft.suggestedCategory,
      suggestedTitle: draft.suggestedTitle,
      suggestedDescription: draft.suggestedDescription,
      suggestedTags: draft.suggestedTags,
      suggestedPriceInCents: draft.suggestedPriceInCents,
      suggestedMinPriceInCents: draft.priceRange.min,
      suggestedMaxPriceInCents: draft.priceRange.max,
      aiBrand: draft.aiBrand,
      aiItemName: draft.aiItemName,
      aiAttributes: draft.aiAttributes,
      sampleCount: draft.sampleCount,
      priceQuery: draft.priceQuery ?? [draft.aiBrand, draft.aiItemName, ...Object.values(draft.aiAttributes)]
        .filter(Boolean)
        .join(" "),
      pricingReason: draft.pricingReason ?? `${draft.sampleCount} price samples used for suggestion`,
      provider: draft.provider,
      priceSamples: {
        deleteMany: {},
        create: draft.priceSamples.map((sample) => ({
          id: sample.id,
          sourcePlatform: sample.sourcePlatform,
          sampleTitle: sample.sampleTitle,
          samplePrice: sample.samplePrice
        }))
      }
    },
    create: {
      id: draft.id,
      donationCaseId: draft.donationCaseId,
      suggestedCategory: draft.suggestedCategory,
      suggestedTitle: draft.suggestedTitle,
      suggestedDescription: draft.suggestedDescription,
      suggestedTags: draft.suggestedTags,
      suggestedPriceInCents: draft.suggestedPriceInCents,
      suggestedMinPriceInCents: draft.priceRange.min,
      suggestedMaxPriceInCents: draft.priceRange.max,
      aiBrand: draft.aiBrand,
      aiItemName: draft.aiItemName,
      aiAttributes: draft.aiAttributes,
      sampleCount: draft.sampleCount,
      priceQuery: draft.priceQuery ?? [draft.aiBrand, draft.aiItemName, ...Object.values(draft.aiAttributes)]
        .filter(Boolean)
        .join(" "),
      pricingReason: draft.pricingReason ?? `${draft.sampleCount} price samples used for suggestion`,
      provider: draft.provider,
      priceSamples: {
        create: draft.priceSamples.map((sample) => ({
          id: sample.id,
          sourcePlatform: sample.sourcePlatform,
          sampleTitle: sample.sampleTitle,
          samplePrice: sample.samplePrice
        }))
      }
    }
  });

  return true;
}

export async function loadReviewDraft(donationCaseId: string) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return null;
  }

  return prisma.donationCase.findUnique({
    where: { id: donationCaseId },
    include: {
      aiDraft: {
        include: {
          priceSamples: {
            orderBy: {
              createdAt: "asc"
            }
          }
        }
      }
    }
  });
}

export async function loadDonationCase(donationCaseId: string) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return null;
  }

  return prisma.donationCase.findUnique({
    where: { id: donationCaseId }
  });
}

export async function loadProduct(productId: string) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return null;
  }

  return prisma.product.findUnique({
    where: { id: productId }
  });
}

export async function persistApprovedReview(input: {
  donationCaseId: string;
  draftId: string;
  product: ProductRecord;
  review: {
    finalBrand?: string;
    finalItemName: string;
    finalAttributes?: Record<string, string>;
    finalCategory: string;
    finalCondition: string;
    finalTitle: string;
    finalDescription: string;
    finalPriceInCents: number;
  };
}) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return false;
  }

  await prisma.$transaction([
    prisma.reviewDecision.upsert({
      where: { donationCaseId: input.donationCaseId },
      update: {
        draftId: input.draftId,
        finalBrand: input.review.finalBrand,
        finalItemName: input.review.finalItemName,
        finalAttributes: input.review.finalAttributes,
        finalCategory: input.review.finalCategory,
        finalCondition: input.review.finalCondition,
        finalTitle: input.review.finalTitle,
        finalDescription: input.review.finalDescription,
        finalPriceInCents: input.review.finalPriceInCents,
        reviewResult: "APPROVED",
        reviewedBy: DEFAULT_REVIEWER_ID,
        reviewedAt: new Date()
      },
      create: {
        donationCaseId: input.donationCaseId,
        draftId: input.draftId,
        finalBrand: input.review.finalBrand,
        finalItemName: input.review.finalItemName,
        finalAttributes: input.review.finalAttributes,
        finalCategory: input.review.finalCategory,
        finalCondition: input.review.finalCondition,
        finalTitle: input.review.finalTitle,
        finalDescription: input.review.finalDescription,
        finalPriceInCents: input.review.finalPriceInCents,
        reviewResult: "APPROVED",
        reviewedBy: DEFAULT_REVIEWER_ID,
        reviewedAt: new Date()
      }
    }),
    prisma.product.upsert({
      where: { donationCaseId: input.donationCaseId },
      update: {
        brand: input.product.brand,
        itemName: input.product.itemName,
        attributes: input.product.attributes,
        title: input.product.title,
        description: input.product.description,
        category: input.product.category,
        conditionLabel: input.product.conditionLabel,
        priceInCents: input.product.priceInCents,
        status: input.product.status,
        publishedAt: new Date()
      },
      create: {
        id: input.product.id,
        donationCaseId: input.donationCaseId,
        brand: input.product.brand,
        itemName: input.product.itemName,
        attributes: input.product.attributes,
        title: input.product.title,
        description: input.product.description,
        category: input.product.category,
        conditionLabel: input.product.conditionLabel,
        priceInCents: input.product.priceInCents,
        status: input.product.status,
        publishedAt: new Date()
      }
    }),
    prisma.aiDraft.update({
      where: { id: input.draftId },
      data: {
        accepted: true
      }
    }),
    prisma.donationCase.update({
      where: { id: input.donationCaseId },
      data: {
        productId: input.product.id,
        status: DonationStatus.Published
      }
    }),
    prisma.notificationRecord.create({
      data: {
        userId: DEFAULT_USER_ID,
        type: "PRODUCT_PUBLISHED",
        title: "商品已上架",
        summary: `你捐赠的${input.review.finalTitle}已完成整理并上架`,
        targetPath: `/pages/detail/index?id=${input.product.id}`
      }
    })
  ]);

  return true;
}

export async function persistOrderLock(input: {
  orderId: string;
  userId: string;
  productId: string;
  amountInCents: number;
}) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return false;
  }

  await prisma.user.upsert({
    where: { id: input.userId },
    update: {},
    create: {
      id: input.userId,
      role: "BUYER",
      nickname: input.userId,
      notificationPreferences: []
    }
  });

  await prisma.$transaction([
    prisma.product.update({
      where: { id: input.productId },
      data: {
        status: ProductStatus.Locked
      }
    }),
    prisma.order.upsert({
      where: { id: input.orderId },
      update: {
        userId: input.userId,
        productId: input.productId,
        amountInCents: input.amountInCents,
        status: OrderStatus.PendingPayment,
        paymentStatus: OrderStatus.PendingPayment,
        fulfillmentStatus: OrderStatus.PendingFulfillment
      },
      create: {
        id: input.orderId,
        userId: input.userId,
        productId: input.productId,
        amountInCents: input.amountInCents,
        status: OrderStatus.PendingPayment,
        paymentStatus: OrderStatus.PendingPayment,
        fulfillmentStatus: OrderStatus.PendingFulfillment
      }
    })
  ]);

  return true;
}

export async function listUserNotifications(userId: string) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return null;
  }

  return prisma.notificationRecord.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function markNotificationRead(notificationId: string) {
  const prisma = await getPrismaClient();

  if (!prisma) {
    return null;
  }

  return prisma.notificationRecord.update({
    where: { id: notificationId },
    data: {
      readAt: new Date()
    }
  });
}
