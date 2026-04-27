"use client";

import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import { getCurrentSession, logOut } from "@/lib/auth";
import { getHabits, saveHabits } from "@/lib/storage";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Habit } from "@/types/habit";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const session = typeof window !== "undefined" ? getCurrentSession() : null;

  useEffect(() => {
    const all = getHabits();
    const mine = all.filter((h) => h.userId === session?.userId);
    setHabits(mine);
    setLoaded(true);
  }, [session?.userId]);

  function handleSaveNew(name: string, description: string) {
    if (!session) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name,
      description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    const all = getHabits();
    const updated = [...all, newHabit];
    saveHabits(updated);
    setHabits((prev) => [...prev, newHabit]);
    setShowForm(false);
  }

  function handleUpdate(updatedHabit: Habit) {
    const all = getHabits();
    const updated = all.map((h) =>
      h.id === updatedHabit.id ? updatedHabit : h,
    );
    saveHabits(updated);
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    );
  }

  function handleDelete(id: string) {
    const all = getHabits();
    const updated = all.filter((h) => h.id !== id);
    saveHabits(updated);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function handleLogout() {
    logOut();
    window.location.href = "/login";
  }

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-600">Habit Tracker</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{session?.email}</span>
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 py-6">
          {!showForm && (
            <button
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="mb-6 w-full rounded-xl border-2 border-dashed border-indigo-300 py-4 text-sm font-medium text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              + Add a new habit
            </button>
          )}

          {showForm && (
            <div className="mb-6">
              <HabitForm
                onSave={handleSaveNew}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {loaded && habits.length === 0 && !showForm && (
            <div
              data-testid="empty-state"
              className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center"
            >
              <p className="text-gray-400">
                No habits yet. Add your first one above!
              </p>
            </div>
          )}

          {habits.length > 0 && (
            <HabitList
              habits={habits}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
