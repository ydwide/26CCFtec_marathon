import { Injectable, NotFoundException } from "@nestjs/common";
import { DonationStatus } from "@ccf/shared";
import { AiDraftsService } from "../ai-drafts/ai-drafts.service";
import type { DonationCaseRecord, RuntimeStore } from "../../runtime";

@Injectable()
export class DonationsService {
  constructor(
    private readonly store: RuntimeStore,
    private readonly aiDraftsService: AiDraftsService
  ) {}

  createDonationCase(input: {
    title: string;
    conditionLabel?: string;
    description?: string;
  }) {
    const id = `case-${this.store.donationCases.size + 1}`;
    const record: DonationCaseRecord = {
      id,
      title: input.title,
      conditionLabel: input.conditionLabel,
      description: input.description,
      status: DonationStatus.Submitted
    };

    this.store.donationCases.set(id, record);
    return record;
  }

  generateAiDraft(donationCaseId: string) {
    const donationCase = this.store.donationCases.get(donationCaseId);

    if (!donationCase) {
      throw new NotFoundException("捐赠单不存在");
    }

    const draft = this.aiDraftsService.generate(donationCaseId);
    donationCase.status = DonationStatus.PendingReview;

    return {
      ...draft,
      status: donationCase.status,
      aiSuggestedPrice: draft.suggestedPriceInCents
    };
  }
}
