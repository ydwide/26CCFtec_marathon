import { Body, Controller, Param, Post } from "@nestjs/common";
import { runtime } from "../../runtime";

@Controller("reviews")
export class ReviewController {
  private readonly reviewService = runtime.reviewService;

  @Post(":id/approve")
  approve(
    @Param("id") id: string,
    @Body()
    body: {
      title: string;
      description: string;
      category: string;
      conditionLabel: string;
      priceInCents: number;
    }
  ) {
    return this.reviewService.approve(id, body);
  }
}
