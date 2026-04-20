import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarketPriceAdapter } from "../src/modules/ai-drafts/market-price-adapter";

describe("createMarketPriceAdapter", () => {
  afterEach(() => {
    delete process.env.MARKET_PRICE_API_URL;
    delete process.env.ONEBOUND_KEY;
    delete process.env.ONEBOUND_SECRET;
    delete process.env.ONEBOUND_UPLOAD_IMG_URL;
    delete process.env.ONEBOUND_ITEM_SEARCH_IMG_URL;
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
      },
      imageUrls: ["https://img.example.test/camera.jpg"],
      searchSkill: "commerce-market-search"
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
          },
          imageUrls: ["https://img.example.test/camera.jpg"],
          searchSkill: "commerce-market-search"
        })
      })
    );
    expect(result.query).toBe("Canon 胶片相机 1970s 产品图识别");
    expect(result.samples).toEqual([
      {
        id: "external-1",
        sourcePlatform: "第三方电商",
        sampleTitle: "Canon 胶片相机",
        samplePrice: 88000
      }
    ]);
  });

  it("uses OneBound image search when credentials and product image are configured", async () => {
    process.env.ONEBOUND_KEY = "onebound-key";
    process.env.ONEBOUND_SECRET = "onebound-secret";
    process.env.ONEBOUND_UPLOAD_IMG_URL = "https://api-gw.onebound.cn/taobao/upload_img";
    process.env.ONEBOUND_ITEM_SEARCH_IMG_URL = "https://api-gw.onebound.cn/taobao/item_search_img";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: {
            item: {
              name: "1465008666331338751"
            }
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: {
            item: [
              {
                num_iid: "785697155584",
                title: "Canon 胶片相机 成色不错",
                price: "880.00",
                detail_url: "//item.taobao.com/item.htm?id=785697155584"
              },
              {
                num_iid: "785697155585",
                title: "复古胶片相机",
                promotion_price: "760.50",
                detail_url: "https://item.taobao.com/item.htm?id=785697155585"
              }
            ]
          }
        })
      });
    vi.stubGlobal("fetch", fetchMock);

    const adapter = createMarketPriceAdapter();
    const result = await adapter.lookup({
      brand: "Canon",
      itemName: "胶片相机",
      attributes: {
        年代: "1970s"
      },
      imageUrls: ["https://img.example.test/camera.jpg"],
      searchSkill: "commerce-market-search"
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const uploadUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(uploadUrl.origin + uploadUrl.pathname).toBe("https://api-gw.onebound.cn/taobao/upload_img");
    expect(uploadUrl.searchParams.get("key")).toBe("onebound-key");
    expect(uploadUrl.searchParams.get("secret")).toBe("onebound-secret");
    expect(uploadUrl.searchParams.get("imgcode")).toBe("https://img.example.test/camera.jpg");
    expect(uploadUrl.searchParams.get("img_type")).toBe("1");

    const searchUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(searchUrl.origin + searchUrl.pathname).toBe("https://api-gw.onebound.cn/taobao/item_search_img");
    expect(searchUrl.searchParams.get("imgid")).toBe("1465008666331338751");

    expect(result.query).toBe("Canon 胶片相机 1970s 产品图识别");
    expect(result.samples).toEqual([
      {
        id: "taobao-785697155584",
        sourcePlatform: "淘宝图搜",
        sampleTitle: "Canon 胶片相机 成色不错",
        samplePrice: 88000,
        sampleUrl: "https://item.taobao.com/item.htm?id=785697155584"
      },
      {
        id: "taobao-785697155585",
        sourcePlatform: "淘宝图搜",
        sampleTitle: "复古胶片相机",
        samplePrice: 76050,
        sampleUrl: "https://item.taobao.com/item.htm?id=785697155585"
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
