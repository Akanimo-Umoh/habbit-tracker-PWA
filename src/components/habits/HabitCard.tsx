"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "../../lib/slug";
import { calculateCurrentStreak } from "../../lib/streaks";
import { toggleHabitCompletion } from "../../lib/habits";

type HabitCardProps = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitCard({
  habit,
  onUpdate,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [confirming, setConfirming] = useState(false);

  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split("T")[0];
  const isCompleted = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions);

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    onUpdate(updated);
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`container transition-colors ${
        isCompleted
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-indigo-400"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{habit.name}</h3>
          </div>

          {habit.description && (
            <p className="mt-1 text-sm text-slate-500">{habit.description}</p>
          )}

          <p
            data-testid={`habit-streak-${slug}`}
            className="mt-2 text-sm font-medium text-indigo-600"
          >
            🔥 {streak} day streak
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            data-testid={`habit-complete-${slug}`}
            onClick={handleToggle}
            aria-pressed={isCompleted}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
              isCompleted
                ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-400"
                : "btn-done"
            }`}
          >
            {isCompleted ? "✓ Done" : "Mark done"}
          </button>

          <div className="flex gap-3">
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="text-xs text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors cursor-pointer"
            >
              Edit
            </button>

            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirming(true)}
              className="text-xs text-slate-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>

          {isCompleted && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Done today
            </span>
          )}
        </div>
      </div>

      {confirming && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="mb-3 text-sm text-red-700">
            Delete <strong>{habit.name}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
