import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(@Inject(ReviewService) private readonly reviewService: ReviewService) {}

  @Get(":id")
  getDraft(@Param("id") id: string) {
    return this.reviewService.getDraft(id);
  }

  @Post(":id/approve")
  approve(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.reviewService.approve(id, body);
  }
}
