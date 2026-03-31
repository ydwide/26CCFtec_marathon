import { afterEach, describe, expect, it, vi } from "vitest";
import { createDonationCase } from "./donations";

describe("createDonationCase", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts donation data to the backend api", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "case-1", status: "已提交" })
    });

    vi.stubGlobal("fetch", fetchMock);

    await createDonationCase({
      title: "儿童绘本",
      conditionLabel: "九成新",
      description: "适合 6-8 岁"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/donations",
      expect.objectContaining({
        method: "POST"
      })
    );
  });
});
