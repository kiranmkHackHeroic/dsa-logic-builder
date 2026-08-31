import { describe, expect, it, beforeEach } from "vitest";
import { getLocalProgressKey, readLocalProgress, writeLocalProgress } from "@/lib/progressStorage";

describe("progressStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses user-scoped keys to isolate account progress", () => {
    writeLocalProgress("1", { current_step: 4, completed_steps: [1, 2, 3] }, "user-a");
    writeLocalProgress("1", { current_step: 2, completed_steps: [1] }, "user-b");

    expect(readLocalProgress("1", "user-a")).toEqual({
      current_step: 4,
      completed_steps: [1, 2, 3],
    });

    expect(readLocalProgress("1", "user-b")).toEqual({
      current_step: 2,
      completed_steps: [1],
    });

    expect(getLocalProgressKey("1", "user-a")).not.toBe(getLocalProgressKey("1", "user-b"));
  });

  it("returns null for invalid JSON payloads", () => {
    localStorage.setItem(getLocalProgressKey("2", "guest"), "{bad json");
    expect(readLocalProgress("2", "guest")).toBeNull();
  });

  it("sanitizes invalid completed_steps and current_step", () => {
    localStorage.setItem(
      getLocalProgressKey("3", "guest"),
      JSON.stringify({ current_step: -10, completed_steps: [1, "x", 2, null] })
    );

    expect(readLocalProgress("3", "guest")).toEqual({
      current_step: 1,
      completed_steps: [1, 2],
    });
  });
});
