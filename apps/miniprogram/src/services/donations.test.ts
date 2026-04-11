import { afterEach, describe, expect, it, vi } from "vitest";
import { createDonationCase } from "./donations";

describe("createDonationCase", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts donation data and triggers ai draft generation", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "case-1", status: "已提交" })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "draft-case-1", status: "待审核" })
      });

    vi.stubGlobal("fetch", fetchMock);

    const result = await createDonationCase({
      title: "儿童绘本",
      conditionLabel: "9成新",
      description: "适合 6-8 岁",
      imageUrls: ["https://img.example.test/book-set.jpg"]
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/donations",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      title: "儿童绘本",
      conditionLabel: "9成新",
      description: "适合 6-8 岁",
      imageUrls: ["https://img.example.test/book-set.jpg"]
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/donations/case-1/ai-draft",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(result.aiDraft.id).toBe("draft-case-1");
  });
});
