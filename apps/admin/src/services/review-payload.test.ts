import { afterEach, describe, expect, it, vi } from "vitest";
import { approveDonationCase } from "./review";

describe("review approval payload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts enriched approval data to the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "product-1" })
    });

    vi.stubGlobal("fetch", fetchMock);

    await approveDonationCase("case-1", {
      finalBrand: "Canon",
      finalItemName: "胶片相机",
      finalAttributes: {
        年代: "1970s",
        成像方式: "胶片"
      },
      finalCategory: "经典影像 / 胶片相机",
      finalConditionLabel: "8成新",
      finalTitle: "时光掠影，1970s 复古胶片相机",
      finalDescription: "平台整理后的上架文案",
      finalPriceInCents: 85000
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/reviews/case-1/approve",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          finalBrand: "Canon",
          finalItemName: "胶片相机",
          finalAttributes: {
            年代: "1970s",
            成像方式: "胶片"
          },
          finalCategory: "经典影像 / 胶片相机",
          finalConditionLabel: "8成新",
          finalTitle: "时光掠影，1970s 复古胶片相机",
          finalDescription: "平台整理后的上架文案",
          finalPriceInCents: 85000
        })
      })
    );
  });
});
