import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("useCases router", () => {
  describe("getScenarios", () => {
    it("returns empty array when database is not available", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // This will return empty array since we don't have a real DB in tests
      const result = await caller.useCases.getScenarios();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getScenario", () => {
    it("returns null for non-existent scenario", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.useCases.getScenario({ id: 999 });
      expect(result).toBeNull();
    });
  });

  describe("getSharedReport", () => {
    it("returns null for non-existent token", async () => {
      const { ctx } = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.useCases.getSharedReport({ token: "non-existent-token" });
      expect(result).toBeNull();
    });
  });
});

describe("calculation engine utilities", () => {
  it("formatCurrency handles millions correctly", async () => {
    const { formatCurrency } = await import("../client/src/hooks/useCalculationEngine");
    expect(formatCurrency(1_500_000)).toBe("$1.5M");
    expect(formatCurrency(10_000_000)).toBe("$10.0M");
  });

  it("formatCurrency handles thousands correctly", async () => {
    const { formatCurrency } = await import("../client/src/hooks/useCalculationEngine");
    expect(formatCurrency(1_500)).toBe("$1.5K");
    expect(formatCurrency(50_000)).toBe("$50.0K");
  });

  it("formatCurrency handles small numbers correctly", async () => {
    const { formatCurrency } = await import("../client/src/hooks/useCalculationEngine");
    expect(formatCurrency(100)).toBe("$100");
    expect(formatCurrency(999)).toBe("$999");
  });

  it("formatPercentage formats correctly", async () => {
    const { formatPercentage } = await import("../client/src/hooks/useCalculationEngine");
    expect(formatPercentage(0.75)).toBe("75.0%");
    expect(formatPercentage(0.123)).toBe("12.3%");
  });

  it("formatNumber handles millions correctly", async () => {
    const { formatNumber } = await import("../client/src/hooks/useCalculationEngine");
    expect(formatNumber(1_500_000)).toBe("1.5M");
    expect(formatNumber(10_000_000)).toBe("10.0M");
  });
});
