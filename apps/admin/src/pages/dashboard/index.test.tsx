import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "./index";

describe("DashboardPage", () => {
  it("renders the key admin summary cards", () => {
    render(<DashboardPage />);

    expect(screen.getByText("待 AI 整理")).toBeTruthy();
    expect(screen.getByText("待人工审核")).toBeTruthy();
    expect(screen.getByText("待履约订单")).toBeTruthy();
    expect(screen.getByText("今日核心数据")).toBeTruthy();
  });
});
