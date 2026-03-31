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
