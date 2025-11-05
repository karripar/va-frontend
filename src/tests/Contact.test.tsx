import { renderHook, act } from "@testing-library/react";
import { useContactMessages } from "@/hooks/messageHooks";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock directly inside vi.mock without external variable
vi.mock("@/lib/fetchData", () => {
  return {
    default: vi.fn(),
  };
});

import fetchData from "@/lib/fetchData";

// Mock auth hook
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email: "test@example.com", userName: "TestUser" },
  }),
}));

describe("useContactMessages", () => {
  beforeEach(() => {
    (fetchData as jest.Mock).mockReset();
    localStorage.clear();
    localStorage.setItem("authToken", "test-token");
  });

  it("posts a message successfully", async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useContactMessages());

    await act(async () => {
      const res = await result.current.postMessage({ subject: "Test Subject", message: "Hello Admin" });
      expect(res).toEqual({ success: true });
    });

    expect(fetchData).toHaveBeenCalledTimes(1);
  });

  it("fails if no token is found", async () => {
    localStorage.clear();

    const { result } = renderHook(() => useContactMessages());

    await act(async () => {
      await result.current.postMessage({ subject: "No Token Subject", message: "No token test" });
    });

    expect(result.current.error).toBe("No auth token found");
  });

  it("fetches messages successfully", async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce({
      messages: [{ id: 1, message: "Hello" }],
    });

    const { result } = renderHook(() => useContactMessages());

    await act(async () => {
      const res = await result.current.getMessages();
      expect(res).toEqual({ messages: [{ id: 1, message: "Hello" }] });
    });
  });
});
