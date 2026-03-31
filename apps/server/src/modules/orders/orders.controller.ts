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
