"use client";

import { useState } from "react";
import { validateHabitName } from "../../lib/validators";
import { Habit } from "../../types/habit";

type HabitFormProps = {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  initial?: Habit;
};

export default function HabitForm({
  onSave,
  onCancel,
  initial,
}: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    onSave(result.value, description.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* modal content */}
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit habit" : "New habit"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          data-testid="habit-form"
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-black"
        >
          {error && (
            <p role="alert" className="rounded bg-red-50 p-3 error">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="habit-name">
              Habit name <span className="text-red-500">*</span>
            </label>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink Water"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="habit-description">Description</label>
            <input
              id="habit-description"
              data-testid="habit-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="habit-frequency">Frequency</label>
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              defaultValue="daily"
              disabled
              className="rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 h-10"
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              data-testid="habit-save-button"
              className="text-white bg-indigo-600 py-1.5 rounded-md shadow-sm hover:bg-indigo-700 active:ring-2 ring-offset-1 ring-indigo-700 cursor-pointer flex-1 text-center"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
