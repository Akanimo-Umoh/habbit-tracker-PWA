import { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const exists = habit.completions.includes(date);

  const updatedCompletions = exists
    ? habit.completions.filter((d) => d !== date)
    : [...new Set([...habit.completions, date])];

  return { ...habit, completions: updatedCompletions };
}
