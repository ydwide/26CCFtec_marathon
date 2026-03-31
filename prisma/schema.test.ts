import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("prisma schema", () => {
  it("defines the mvp core models", () => {
    const schema = readFileSync("prisma/schema.prisma", "utf8");

    expect(schema).toContain("model User");
    expect(schema).toContain("model DonationCase");
    expect(schema).toContain("model Product");
    expect(schema).toContain("model Order");
    expect(schema).toContain("model NotificationRecord");
    expect(schema).toContain("model ImpactRecord");
  });
});
