// AI 整理服务：当前先返回稳定的 mock 结果，后面会替换成真实模型调用。
import { Injectable } from "@nestjs/common";
import type { RuntimeStore } from "../../runtime";

@Injectable()
export class AiDraftsService {
  constructor(private readonly store: RuntimeStore) {}

  generate(donationCaseId: string) {
    const draft = {
      id: `draft-${donationCaseId}`,
      donationCaseId,
      suggestedCategory: "图书文具",
      suggestedTitle: "儿童绘本套装",
      suggestedDescription: "平台已根据捐赠信息整理商品文案。",
      suggestedTags: ["亲子", "阅读", "公益流转"],
      suggestedPriceInCents: 2900,
      provider: "mock-ai"
    };

    this.store.aiDrafts.set(donationCaseId, draft);
    return draft;
  }
}
