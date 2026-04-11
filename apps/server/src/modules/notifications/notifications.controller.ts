import { Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(
    @Inject(NotificationsService) private readonly notificationsService: NotificationsService
  ) {}

  @Get()
  list(@Query("userId") userId: string) {
    return this.notificationsService.list(userId);
  }

  @Post(":id/read")
  markAsRead(@Param("id") id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
