// 审核上架入口：后台工作人员确认 AI 草稿后，从这里把捐赠单转成可售商品。
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
