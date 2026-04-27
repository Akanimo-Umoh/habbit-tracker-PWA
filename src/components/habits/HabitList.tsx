"use client";

import { useState } from "react";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import { Habit } from "../../types/habit";
import { getHabitSlug } from "../../lib/slug";

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

  function handleEdit(habit: Habit) {
    setEditingHabit(habit);
  }

  function handleSaveEdit(name: string, description: string) {
    if (!editingHabit) return;

    const updated: Habit = {
      ...editingHabit,
      name,
      description,
    };

    onUpdate(updated);
    setEditingHabit(null);
  }

  function handleCancelEdit() {
    setEditingHabit(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {habits.map((habit) => {
        const slug = getHabitSlug(habit.name);
        const isEditing = editingHabit?.id === habit.id;

        if (isEditing) {
          return (
            <div key={habit.id}>
              <HabitForm
                initial={editingHabit}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            </div>
          );
        }

        return (
          <HabitCard
            key={slug}
            habit={habit}
            onUpdate={onUpdate}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
