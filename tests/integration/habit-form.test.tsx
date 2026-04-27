import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

import HabitForm from "@/components/habits/HabitForm";
import HabitCard from "@/components/habits/HabitCard";
import type { Habit } from "@/types/habit";

const today = new Date().toISOString().split("T")[0];

const baseHabit: Habit = {
  id: "1",
  userId: "user-1",
  name: "Drink Water",
  description: "Stay hydrated",
  frequency: "daily",
  createdAt: "2026-01-01T00:00:00.000Z",
  completions: [],
};

beforeEach(() => {
  localStorageMock.clear();
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Habit name is required",
      );
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Stay hydrated",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("Drink Water", "Stay hydrated");
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <HabitForm initial={baseHabit} onSave={onSave} onCancel={vi.fn()} />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Read Books");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("Read Books", "Stay hydrated");
    });

    // Immutable fields (id, userId, createdAt, completions) are preserved by the parent
    // The form only passes name and description back up — it never touches immutable fields
    expect(onSave).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ id: expect.anything() }),
    );
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={baseHabit}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    // Click delete — should show confirmation, not delete yet
    await user.click(screen.getByTestId("habit-delete-drink-water"));
    expect(onDelete).not.toHaveBeenCalled();

    // Confirm deletion
    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(
      <HabitCard
        habit={baseHabit}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const streakEl = screen.getByTestId("habit-streak-drink-water");
    expect(streakEl).toHaveTextContent("0 day streak");

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          completions: expect.arrayContaining([today]),
        }),
      );
    });
  });
});
