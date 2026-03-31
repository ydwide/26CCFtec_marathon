// 捐赠领域服务：维护捐赠单状态，并把“已提交 -> 待审核”这段流程推进起来。
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
    // 这里先用内存 Map 模拟持久化，后面切 Prisma 时保留同样的业务语义。
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

    // AI 草稿生成完成后，捐赠单状态推进到“待审核”，交给后台人工确认。
    const draft = this.aiDraftsService.generate(donationCaseId);
    donationCase.status = DonationStatus.PendingReview;

    return {
      ...draft,
      status: donationCase.status,
      aiSuggestedPrice: draft.suggestedPriceInCents
    };
  }
}
