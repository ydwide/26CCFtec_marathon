import { afterEach, describe, expect, it, vi } from "vitest";
import { approveDonationCase, getReviewDraft } from "./review";

describe("review service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the review draft from the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ suggestedTitle: "儿童绘本套装" })
    });

    vi.stubGlobal("fetch", fetchMock);

    await getReviewDraft("case-1");

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/reviews/case-1");
  });

  it("posts approval data to the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "product-1" })
    });

    vi.stubGlobal("fetch", fetchMock);

    await approveDonationCase("case-1", {
      title: "儿童绘本套装",
      description: "平台整理后的上架文案",
      category: "图书文具",
      conditionLabel: "九成新",
      priceInCents: 2900
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/reviews/case-1/approve",
      expect.objectContaining({
        method: "POST"
      })
    );
  });
});
