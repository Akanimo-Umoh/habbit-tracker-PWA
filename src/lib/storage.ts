import { Session, User } from "@/types/auth";
import { STORAGE_KEYS } from "./constants";
import { Habit } from "../types/habit";

// get users
export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

// save user
export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// get session
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
}

// save session
export function saveSession(session: Session | null): void {
  if (session === null) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }
}

// // clear session: using null does not remove the key entirely
// export function clearSession(): void {
//   localStorage.setItem(STORAGE_KEYS.session, "null");
// }

// user habits
export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : [];
}

// save habbits
export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

// get user habbits
export function getHabitsForUser(userId: string): Habit[] {
  return getHabits().filter((h) => h.userId === userId);
}
