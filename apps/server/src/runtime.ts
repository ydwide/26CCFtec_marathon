// 当前阶段先用内存态 runtime 模拟数据库与服务容器，方便把主链路先跑通。
import { DonationStatus, OrderStatus, ProductStatus } from "@ccf/shared";
import { AiDraftsService } from "./modules/ai-drafts/ai-drafts.service";
import { DonationsService } from "./modules/donations/donations.service";
import { ReviewService } from "./modules/review/review.service";
import { OrdersService } from "./modules/orders/orders.service";

export interface DonationCaseRecord {
  id: string;
  title: string;
  conditionLabel?: string;
  description?: string;
  status: DonationStatus;
}

export interface AiDraftRecord {
  id: string;
  donationCaseId: string;
  suggestedCategory: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedTags: string[];
  suggestedPriceInCents: number;
  provider: string;
}

export interface ProductRecord {
  id: string;
  donationCaseId: string;
  title: string;
  description: string;
  category: string;
  conditionLabel: string;
  priceInCents: number;
  status: ProductStatus;
}

export interface OrderRecord {
  id: string;
  userId: string;
  productId: string;
  amountInCents: number;
  status: OrderStatus;
}

export interface RuntimeStore {
  donationCases: Map<string, DonationCaseRecord>;
  aiDrafts: Map<string, AiDraftRecord>;
  products: Map<string, ProductRecord>;
  orders: Map<string, OrderRecord>;
}

const runtimeStore: RuntimeStore = {
  donationCases: new Map(),
  aiDrafts: new Map(),
  products: new Map(),
  orders: new Map()
};

const aiDraftsService = new AiDraftsService(runtimeStore);
const donationsService = new DonationsService(runtimeStore, aiDraftsService);
const reviewService = new ReviewService(runtimeStore);
const ordersService = new OrdersService(runtimeStore);

export const runtime = {
  store: runtimeStore,
  aiDraftsService,
  donationsService,
  reviewService,
  ordersService
};
