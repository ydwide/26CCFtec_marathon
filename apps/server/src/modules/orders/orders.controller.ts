import { Body, Controller, Inject, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { productId: string; userId: string }) {
    return this.ordersService.create(body);
  }
}
