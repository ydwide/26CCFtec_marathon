import type { DonationStatus, OrderStatus, ProductStatus } from "./status";

export interface User {
  id: string;
  role: "USER" | "STAFF" | "ADMIN";
  nickname: string;
  mobile?: string;
  notificationPreferences?: string[];
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface DonationCase {
  id: string;
  userId: string;
  title: string;
  category?: string;
  conditionLabel?: string;
  description?: string;
  deliveryMethod?: string;
  contactPhone?: string;
  status: DonationStatus;
  rejectReason?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiDraft {
  id: string;
  donationCaseId: string;
  suggestedCategory: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedTags: string[];
  suggestedPriceInCents: number;
  provider: string;
  accepted: boolean;
}

export interface Product {
  id: string;
  donationCaseId: string;
  title: string;
  description: string;
  category: string;
  conditionLabel: string;
  priceInCents: number;
  status: ProductStatus;
  isUnique: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amountInCents: number;
  status: OrderStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  fulfillmentStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  summary: string;
  targetPath?: string;
  readAt?: string;
}

export interface ImpactRecord {
  id: string;
  donationCaseId?: string;
  productId?: string;
  orderId?: string;
  donorUserId?: string;
  buyerUserId?: string;
  impactSummary: string;
  completedAt?: string;
}
