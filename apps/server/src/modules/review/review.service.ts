// 审核服务：负责把“待审核”的捐赠单正式转成“销售中”的商品。
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DonationStatus, ProductStatus } from "@ccf/shared";
import type { RuntimeStore } from "../../runtime";

@Injectable()
export class ReviewService {
  constructor(private readonly store: RuntimeStore) {}

  getDraft(donationCaseId: string) {
    const donationCase = this.store.donationCases.get(donationCaseId);
    const draft = this.store.aiDrafts.get(donationCaseId);

    if (!donationCase || !draft) {
      throw new NotFoundException("审核草稿不存在");
    }

    if (donationCase.status !== DonationStatus.PendingReview) {
      throw new ConflictException("当前状态不可审核");
    }

    return {
      suggestedTitle: draft.suggestedTitle,
      suggestedDescription: draft.suggestedDescription,
      suggestedCategory: draft.suggestedCategory,
      suggestedPriceInCents: draft.suggestedPriceInCents,
      conditionLabel: donationCase.conditionLabel ?? ""
    };
  }

  approve(
    donationCaseId: string,
    input: {
      title: string;
      description: string;
      category: string;
      conditionLabel: string;
      priceInCents: number;
    }
  ) {
    const donationCase = this.store.donationCases.get(donationCaseId);
    if (!donationCase) {
      throw new NotFoundException("捐赠单不存在");
    }

    if (donationCase.status !== DonationStatus.PendingReview) {
      throw new ConflictException("当前状态不可上架");
    }

    // 审核通过后生成唯一商品，后续购买和锁单都围绕这个商品对象展开。
    const product = {
      id: `product-${this.store.products.size + 1}`,
      donationCaseId,
      title: input.title,
      description: input.description,
      category: input.category,
      conditionLabel: input.conditionLabel,
      priceInCents: input.priceInCents,
      status: ProductStatus.OnSale
    };

    this.store.products.set(product.id, product);
    donationCase.status = DonationStatus.Published;

    return product;
  }
}
