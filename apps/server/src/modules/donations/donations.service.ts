import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DonationStatus } from "@ccf/shared";
import { AiDraftsService } from "../ai-drafts/ai-drafts.service";
import {
  loadDonationCase,
  persistAiDraft,
  persistDonationCase
} from "../../persistence/prisma";
import type { DonationCaseRecord, RuntimeStore } from "../../runtime";
import { createEntityId } from "../../utils/ids";

@Injectable()
export class DonationsService {
  constructor(
    @Inject("RUNTIME_STORE") private readonly store: RuntimeStore,
    @Inject(AiDraftsService) private readonly aiDraftsService: AiDraftsService
  ) {}

  async createDonationCase(input: {
    title: string;
    conditionLabel?: string;
    description?: string;
  }) {
    const id = createEntityId("case");
    const record: DonationCaseRecord = {
      id,
      title: input.title,
      conditionLabel: input.conditionLabel,
      description: input.description,
      status: DonationStatus.Submitted,
      rawImageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80"
    };

    this.store.donationCases.set(id, record);
    await persistDonationCase(record);
    return record;
  }

  async generateAiDraft(donationCaseId: string) {
    let donationCase = this.store.donationCases.get(donationCaseId);

    if (!donationCase) {
      const persistedDonationCase = await loadDonationCase(donationCaseId);

      if (persistedDonationCase) {
        donationCase = {
          id: persistedDonationCase.id,
          title: persistedDonationCase.rawItemName ?? persistedDonationCase.title,
          conditionLabel:
            persistedDonationCase.rawCondition ?? persistedDonationCase.conditionLabel ?? undefined,
          description:
            persistedDonationCase.rawDescription ?? persistedDonationCase.description ?? undefined,
          status: persistedDonationCase.status as DonationStatus,
          rawImageUrl: persistedDonationCase.rawImages[0]
        };

        this.store.donationCases.set(donationCaseId, donationCase);
      }
    }

    if (!donationCase) {
      throw new NotFoundException("捐赠单不存在");
    }

    const draft = await this.aiDraftsService.generate(donationCaseId);
    donationCase.status = DonationStatus.PendingReview;
    await persistDonationCase(donationCase);
    await persistAiDraft(draft);

    return {
      ...draft,
      status: donationCase.status,
      aiSuggestedPrice: draft.suggestedPriceInCents
    };
  }
}
