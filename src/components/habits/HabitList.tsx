"use client";

import { useState } from "react";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import { Habit } from "../../types/habit";

type HabitListProps = {
  habits: Habit[];
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export default function HabitList({
  habits,
  onUpdate,
  onDelete,
}: HabitListProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  function handleSaveEdit(name: string, description: string) {
    if (!editingHabit) return;
    onUpdate({ ...editingHabit, name, description });
    setEditingHabit(null);
  }

  function handleCancelEdit() {
    setEditingHabit(null);
  }

  return (
    <>
      {editingHabit && (
        <HabitForm
          initial={editingHabit}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="flex flex-col gap-4">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onUpdate={onUpdate}
            onEdit={setEditingHabit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
