import { afterEach, describe, expect, it, vi } from "vitest";

describe("prisma persistence helpers", () => {
  afterEach(() => {
    delete process.env.DATABASE_URL;
    vi.resetModules();
  });

  it("falls back to runtime mode when DATABASE_URL is missing", async () => {
    const persistence = await import("../src/persistence/prisma");

    await expect(persistence.getPrismaClient()).resolves.toBeNull();
    await expect(
      persistence.loadReviewDraft("case-missing-database")
    ).resolves.toBeNull();
  });
});
