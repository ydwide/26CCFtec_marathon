// 捐赠提交流程入口：负责接收用户提交捐赠，以及触发 AI 整理草稿。
import { Body, Controller, Param, Post } from "@nestjs/common";
import { runtime } from "../../runtime";

@Controller("donations")
export class DonationsController {
  private readonly donationsService = runtime.donationsService;

  @Post()
  createDonationCase(
    @Body()
    body: {
      title: string;
      conditionLabel?: string;
      description?: string;
    }
  ) {
    return this.donationsService.createDonationCase(body);
  }

  @Post(":id/ai-draft")
  generateAiDraft(@Param("id") id: string) {
    return this.donationsService.generateAiDraft(id);
  }
}
