import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

beforeEach(() => {
  localStorageMock.clear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') ?? 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    // First signup
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // Second signup with same email
    render(<SignupForm />);
    await user.type(screen.getAllByTestId('auth-signup-email')[1], 'test@example.com');
    await user.type(screen.getAllByTestId('auth-signup-password')[1], 'password123');
    await user.click(screen.getAllByTestId('auth-signup-submit')[1]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();

    // Create user first
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // Clear session so we can test login
    localStorageMock.removeItem('habit-tracker-session');

    // Now login
    render(<LoginForm />);
    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'password123');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') ?? 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('login@example.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'wrong@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});