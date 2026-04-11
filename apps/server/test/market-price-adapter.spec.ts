import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarketPriceAdapter } from "../src/modules/ai-drafts/market-price-adapter";

describe("createMarketPriceAdapter", () => {
  afterEach(() => {
    delete process.env.MARKET_PRICE_API_URL;
    vi.unstubAllGlobals();
  });

  it("uses an external market price provider when MARKET_PRICE_API_URL is configured", async () => {
    process.env.MARKET_PRICE_API_URL = "https://price.example.test/search";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        samples: [
          {
            id: "external-1",
            sourcePlatform: "第三方电商",
            sampleTitle: "Canon 胶片相机",
            samplePrice: 88000
          }
        ]
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const adapter = createMarketPriceAdapter();
    const result = await adapter.lookup({
      brand: "Canon",
      itemName: "胶片相机",
      attributes: {
        年代: "1970s"
      }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://price.example.test/search",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          brand: "Canon",
          itemName: "胶片相机",
          attributes: {
            年代: "1970s"
          }
        })
      })
    );
    expect(result.query).toBe("Canon 胶片相机 1970s");
    expect(result.samples).toEqual([
      {
        id: "external-1",
        sourcePlatform: "第三方电商",
        sampleTitle: "Canon 胶片相机",
        samplePrice: 88000
      }
    ]);
  });

  it("falls back to local market samples when the external provider is unavailable", async () => {
    process.env.MARKET_PRICE_API_URL = "https://price.example.test/search";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const adapter = createMarketPriceAdapter();
    const result = await adapter.lookup({
      brand: "Canon",
      itemName: "胶片相机",
      attributes: {
        年代: "1970s"
      }
    });

    expect(result.query).toBe("Canon 胶片相机 1970s");
    expect(result.samples.length).toBeGreaterThan(0);
    expect(result.samples[0].sourcePlatform).toBe("闲鱼");
  });
});
