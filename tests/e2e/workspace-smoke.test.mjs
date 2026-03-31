import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";

describe("workspace scaffold", () => {
  it("contains all planned apps and packages", () => {
    expect(existsSync("apps/server")).toBe(true);
    expect(existsSync("apps/miniprogram")).toBe(true);
    expect(existsSync("apps/app")).toBe(true);
    expect(existsSync("apps/admin")).toBe(true);
    expect(existsSync("packages/shared")).toBe(true);
  });
});
