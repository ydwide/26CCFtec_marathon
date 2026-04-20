import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MessagesScreen } from "./index";

const markAsRead = vi.fn().mockResolvedValue(undefined);

vi.mock("../../services/notifications", () => ({
  listNotifications: async () => [
    {
      id: "msg-1",
      title: "商品已上架",
      summary: "你的捐赠已经整理完成并上架",
      readAt: null
    }
  ],
  markAsRead: (id: string) => markAsRead(id)
}));

describe("MessagesScreen", () => {
  it("renders grouped notifications and supports marking as read", async () => {
    render(<MessagesScreen />);

    expect(await screen.findByText("商品已上架")).toBeTruthy();
    fireEvent.click(screen.getByText("标记已读"));

    await waitFor(() => {
      expect(markAsRead).toHaveBeenCalledWith("msg-1");
    });
  });
});
