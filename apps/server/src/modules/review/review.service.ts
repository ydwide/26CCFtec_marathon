import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DonationStatus, ProductStatus } from "@ccf/shared";
import {
  loadReviewDraft,
  persistApprovedReview
} from "../../persistence/prisma";
import type { RuntimeStore } from "../../runtime";
import { createEntityId } from "../../utils/ids";

@Injectable()
export class ReviewService {
  constructor(@Inject("RUNTIME_STORE") private readonly store: RuntimeStore) {}

  async getDraft(donationCaseId: string) {
    const persisted = await loadReviewDraft(donationCaseId);

    if (persisted?.aiDraft) {
      if (persisted.status !== DonationStatus.PendingReview) {
        throw new ConflictException("当前状态不可审核");
      }

      return {
        donationId: persisted.id,
        statusLabel: "状态：等待策展润色",
        rawItemName: persisted.rawItemName ?? persisted.title,
        rawDescription: persisted.rawDescription ?? persisted.description ?? "",
        rawImageUrl: persisted.rawImages[0],
        suggestedTitle: persisted.aiDraft.suggestedTitle,
        suggestedDescription: persisted.aiDraft.suggestedDescription,
        suggestedCategory: persisted.aiDraft.suggestedCategory,
        suggestedPriceInCents: persisted.aiDraft.suggestedPriceInCents,
        conditionLabel: persisted.rawCondition ?? persisted.conditionLabel ?? "",
        averagePriceInCents:
          persisted.aiDraft.suggestedMinPriceInCents && persisted.aiDraft.suggestedMaxPriceInCents
            ? Math.round(
                (persisted.aiDraft.suggestedMinPriceInCents +
                  persisted.aiDraft.suggestedMaxPriceInCents) /
                  2
              )
            : persisted.aiDraft.suggestedPriceInCents,
        priceQuery: persisted.aiDraft.priceQuery ?? "",
        pricingReason: persisted.aiDraft.pricingReason ?? "",
        provider: persisted.aiDraft.provider,
        aiBrand: persisted.aiDraft.aiBrand,
        aiItemName: persisted.aiDraft.aiItemName,
        aiAttributes:
          persisted.aiDraft.aiAttributes &&
          typeof persisted.aiDraft.aiAttributes === "object" &&
          !Array.isArray(persisted.aiDraft.aiAttributes)
            ? (persisted.aiDraft.aiAttributes as Record<string, string>)
            : {},
        sampleCount: persisted.aiDraft.sampleCount,
        priceRange: {
          min: persisted.aiDraft.suggestedMinPriceInCents ?? persisted.aiDraft.suggestedPriceInCents,
          max: persisted.aiDraft.suggestedMaxPriceInCents ?? persisted.aiDraft.suggestedPriceInCents
        },
        priceSamples: persisted.aiDraft.priceSamples.map((sample) => ({
          id: sample.id,
          sourcePlatform: sample.sourcePlatform,
          sampleTitle: sample.sampleTitle,
          samplePrice: sample.samplePrice
        }))
      };
    }

    const donationCase = this.store.donationCases.get(donationCaseId);
    const draft = this.store.aiDrafts.get(donationCaseId);

    if (!donationCase || !draft) {
      throw new NotFoundException("审核草稿不存在");
    }

    if (donationCase.status !== DonationStatus.PendingReview) {
      throw new ConflictException("当前状态不可审核");
    }

    return {
      donationId: donationCase.id,
      statusLabel: "状态：等待策展润色",
      rawItemName: donationCase.title,
      rawDescription: donationCase.description ?? "",
      rawImageUrl: donationCase.rawImageUrl,
      suggestedTitle: draft.suggestedTitle,
      suggestedDescription: draft.suggestedDescription,
      suggestedCategory: draft.suggestedCategory,
      suggestedPriceInCents: draft.suggestedPriceInCents,
      conditionLabel: donationCase.conditionLabel ?? "",
      averagePriceInCents: draft.averagePriceInCents ?? draft.suggestedPriceInCents,
      priceQuery: draft.priceQuery ?? "",
      pricingReason: draft.pricingReason ?? "",
      provider: draft.provider,
      aiBrand: draft.aiBrand,
      aiItemName: draft.aiItemName,
      aiAttributes: draft.aiAttributes,
      sampleCount: draft.sampleCount,
      priceRange: draft.priceRange,
      priceSamples: draft.priceSamples
    };
  }

  async approve(donationCaseId: string, input: Record<string, unknown>) {
    let donationCase = this.store.donationCases.get(donationCaseId);
    let runtimeDraft = this.store.aiDrafts.get(donationCaseId);

    if (!donationCase || !runtimeDraft) {
      const persisted = await loadReviewDraft(donationCaseId);

      if (persisted?.aiDraft) {
        donationCase = {
          id: persisted.id,
          title: persisted.rawItemName ?? persisted.title,
          conditionLabel: persisted.rawCondition ?? persisted.conditionLabel ?? undefined,
          description: persisted.rawDescription ?? persisted.description ?? undefined,
          status: persisted.status as DonationStatus,
          rawImageUrl: persisted.rawImages[0]
        };

        runtimeDraft = {
          id: persisted.aiDraft.id,
          donationCaseId: persisted.aiDraft.donationCaseId,
          suggestedCategory: persisted.aiDraft.suggestedCategory,
          suggestedTitle: persisted.aiDraft.suggestedTitle,
          suggestedDescription: persisted.aiDraft.suggestedDescription,
          suggestedTags: persisted.aiDraft.suggestedTags,
          suggestedPriceInCents: persisted.aiDraft.suggestedPriceInCents,
          aiBrand: persisted.aiDraft.aiBrand ?? "",
          aiItemName: persisted.aiDraft.aiItemName ?? "",
          aiAttributes:
            persisted.aiDraft.aiAttributes &&
            typeof persisted.aiDraft.aiAttributes === "object" &&
            !Array.isArray(persisted.aiDraft.aiAttributes)
              ? (persisted.aiDraft.aiAttributes as Record<string, string>)
              : {},
          sampleCount: persisted.aiDraft.sampleCount,
          priceRange: {
            min: persisted.aiDraft.suggestedMinPriceInCents ?? persisted.aiDraft.suggestedPriceInCents,
            max: persisted.aiDraft.suggestedMaxPriceInCents ?? persisted.aiDraft.suggestedPriceInCents
          },
          priceSamples: persisted.aiDraft.priceSamples.map((sample) => ({
            id: sample.id,
            sourcePlatform: sample.sourcePlatform,
            sampleTitle: sample.sampleTitle,
            samplePrice: sample.samplePrice
          })),
          provider: persisted.aiDraft.provider
        };

        this.store.donationCases.set(donationCaseId, donationCase);
        this.store.aiDrafts.set(donationCaseId, runtimeDraft);
      }
    }

    if (!donationCase) {
      throw new NotFoundException("捐赠单不存在");
    }

    if (donationCase.status !== DonationStatus.PendingReview) {
      throw new ConflictException("当前状态不可上架");
    }

    const finalTitle = String(input.finalTitle ?? input.title ?? "");
    const finalDescription = String(input.finalDescription ?? input.description ?? "");
    const finalCategory = String(input.finalCategory ?? input.category ?? "");
    const finalConditionLabel = String(input.finalConditionLabel ?? input.conditionLabel ?? "");
    const finalPriceInCents = Number(input.finalPriceInCents ?? input.priceInCents ?? 0);
    const finalBrand = input.finalBrand ? String(input.finalBrand) : undefined;
    const finalItemName = input.finalItemName ? String(input.finalItemName) : undefined;
    const finalAttributes =
      input.finalAttributes && typeof input.finalAttributes === "object"
        ? (input.finalAttributes as Record<string, string>)
        : undefined;

    const product = {
      id: createEntityId("product"),
      donationCaseId,
      brand: finalBrand,
      itemName: finalItemName,
      attributes: finalAttributes,
      title: finalTitle,
      description: finalDescription,
      category: finalCategory,
      conditionLabel: finalConditionLabel,
      priceInCents: finalPriceInCents,
      status: ProductStatus.OnSale
    };

    this.store.products.set(product.id, product);
    donationCase.status = DonationStatus.Published;

    const notification = {
      id: createEntityId("msg"),
      userId: "demo-user",
      title: "商品已上架",
      summary: `你捐赠的${finalTitle}已完成整理并上架`,
      readAt: null
    };
    this.store.notifications.set(notification.id, notification);

    if (runtimeDraft) {
      await persistApprovedReview({
        donationCaseId,
        draftId: runtimeDraft.id,
        product,
        review: {
          finalBrand,
          finalItemName: finalItemName ?? finalTitle,
          finalAttributes,
          finalCategory,
          finalCondition: finalConditionLabel,
          finalTitle,
          finalDescription,
          finalPriceInCents
        }
      });
    }

    return product;
  }
}
