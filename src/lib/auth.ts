import { getUsers, saveUsers, getSession, saveSession } from "./storage";
import type { User, Session } from "../types/auth";

export function signUp(
  email: string,
  password: string,
): { success: boolean; error: string | null } {
  const users = getUsers();
  const exists = users.find((u) => u.email === email);

  if (exists) {
    return { success: false, error: "User already exists" };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  saveSession({ userId: newUser.id, email: newUser.email });

  return { success: true, error: null };
}

export function logIn(
  email: string,
  password: string,
): { success: boolean; error: string | null } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  saveSession({ userId: user.id, email: user.email });
  return { success: true, error: null };
}

export function logOut(): void {
  saveSession(null);
}

export function getCurrentSession(): Session | null {
  return getSession();
}
