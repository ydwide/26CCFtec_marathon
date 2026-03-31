// 后端应用入口模块，负责把当前 MVP 已接通的捐赠、审核和订单接口注册起来。
import { Module } from "@nestjs/common";
import { DonationsController } from "./modules/donations/donations.controller";
import { DonationsService } from "./modules/donations/donations.service";
import { AiDraftsService } from "./modules/ai-drafts/ai-drafts.service";
import { ReviewController } from "./modules/review/review.controller";
import { ReviewService } from "./modules/review/review.service";
import { OrdersController } from "./modules/orders/orders.controller";
import { OrdersService } from "./modules/orders/orders.service";

@Module({
  controllers: [DonationsController, ReviewController, OrdersController],
  providers: [DonationsService, AiDraftsService, ReviewService, OrdersService]
})
export class AppModule {}
