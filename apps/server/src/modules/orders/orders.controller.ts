// 订单入口：接收购买请求，并在创建订单时先锁定商品。
import { Body, Controller, Post } from "@nestjs/common";
import { runtime } from "../../runtime";

@Controller("orders")
export class OrdersController {
  private readonly ordersService = runtime.ordersService;

  @Post()
  create(@Body() body: { productId: string; userId: string }) {
    return this.ordersService.create(body);
  }
}
