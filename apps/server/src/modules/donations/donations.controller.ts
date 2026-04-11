import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { DonationsService } from "./donations.service";

@Controller("donations")
export class DonationsController {
  constructor(@Inject(DonationsService) private readonly donationsService: DonationsService) {}

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
