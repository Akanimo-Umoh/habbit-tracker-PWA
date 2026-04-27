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

  function handleDeleteClick() {
    setConfirming(true);
  }

  function handleConfirmDelete() {
    onDelete(habit.id);
  }

  function handleCancelDelete() {
    setConfirming(false);
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-xl border p-5 shadow-sm transition-colors ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
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
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isCompleted
                ? "bg-green-600 text-white focus:ring-green-500"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50 focus:ring-gray-400"
            }`}
          >
            {isCompleted ? "✓ Done" : "Mark done"}
          </button>

          <div className="flex gap-2">
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="text-xs text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              Edit
            </button>
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={handleDeleteClick}
              className="text-xs text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {confirming && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="mb-3 text-sm text-red-700">
            Are you sure you want to delete <strong>{habit.name}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={handleConfirmDelete}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Yes, delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
