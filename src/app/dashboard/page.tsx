"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import { getCurrentSession, logOut } from "@/lib/auth";
import { getHabits, saveHabits } from "@/lib/storage";
import type { Habit } from "@/types/habit";
import Link from "next/link";

function getInitialHabits(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}

export default function DashboardPage() {
  const session = getCurrentSession();

  const [habits, setHabits] = useState<Habit[]>(() =>
    session ? getInitialHabits(session.userId) : [],
  );
  const [showForm, setShowForm] = useState(false);

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
    saveHabits([...all, newHabit]);
    setHabits((prev) => [...prev, newHabit]);
    setShowForm(false);
  }

  function handleUpdate(updatedHabit: Habit) {
    const all = getHabits();
    saveHabits(all.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)));
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    );
  }

  function handleDelete(id: string) {
    const all = getHabits();
    saveHabits(all.filter((h) => h.id !== id));
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function handleLogout() {
    logOut();
    window.location.href = "/login";
  }

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="pt-16.75">
        <header className="border-b border-gray-200 px-4 py-4 fixed top-0 w-full left-0 h-16.75">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              Habit<span className="text-indigo-600">Tracker</span>
            </Link>

            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 cursor-pointer hover:text-gray-800"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-lg px-4 py-6">
          <p className="mb-6">
            Welcome,{" "}
            <span className="text-sm font-medium text-indigo-600">
              {session?.email}
            </span>
          </p>

          {!showForm && (
            <button
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="mb-6 w-full rounded-xl border-2 border-dashed border-indigo-300 py-4 text-sm font-medium text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
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

          {habits.length === 0 && !showForm && (
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
