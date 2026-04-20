import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { listUserNotifications, markNotificationRead } from "../../persistence/prisma";
import type { RuntimeStore } from "../../runtime";

@Injectable()
export class NotificationsService {
  constructor(@Inject("RUNTIME_STORE") private readonly store: RuntimeStore) {}

  async list(userId: string) {
    const persisted = await listUserNotifications(userId);

    if (persisted) {
      return persisted.map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        readAt: item.readAt?.toISOString() ?? null
      }));
    }

    return Array.from(this.store.notifications.values())
      .filter((item) => item.userId === userId)
      .sort((a, b) => (a.readAt === b.readAt ? 0 : a.readAt ? 1 : -1));
  }

  async markAsRead(id: string) {
    const persisted = await markNotificationRead(id);

    if (persisted) {
      return {
        id: persisted.id,
        readAt: persisted.readAt?.toISOString() ?? null
      };
    }

    const notification = this.store.notifications.get(id);

    if (!notification) {
      throw new NotFoundException("消息不存在");
    }

    notification.readAt = new Date().toISOString();

    return {
      id: notification.id,
      readAt: notification.readAt
    };
  }
}
