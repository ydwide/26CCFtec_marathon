import { afterEach, describe, expect, it, vi } from "vitest";
import { listNotifications, markAsRead } from "./notifications";

describe("notifications service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads notifications from the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "msg-1",
          title: "商品已上架",
          summary: "你的捐赠已经整理完成并上架",
          readAt: null
        }
      ]
    });

    vi.stubGlobal("fetch", fetchMock);

    await listNotifications();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/notifications?userId=demo-user"
    );
  });

  it("marks a notification as read via the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "msg-1", readAt: new Date().toISOString() })
    });

    vi.stubGlobal("fetch", fetchMock);

    await markAsRead("msg-1");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/notifications/msg-1/read",
      expect.objectContaining({
        method: "POST"
      })
    );
  });
});
