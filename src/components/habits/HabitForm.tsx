"use client";

import { useState, useEffect } from "react";
import { Habit } from "../../types/habit";
import { validateHabitName } from "../../lib/validators";

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

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
    }
  }, [initial]);

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
    <form
      onSubmit={handleSubmit}
      data-testid="habit-form"
      className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-black"
    >
      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-name"
          className="text-sm font-medium text-gray-700"
        >
          Habit name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink Water"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-medium text-gray-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          disabled
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
