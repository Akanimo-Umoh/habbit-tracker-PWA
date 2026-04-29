import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="min-w-full min-h-screen flex items-center justify-center">
      <header className="border-b border-gray-200 px-4 py-4 fixed top-0 w-full left-0 h-16.75">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Habit<span className="text-indigo-600">Tracker</span>
          </Link>
        </div>
      </header>
      
      <SignupForm />
    </div>
  );
}
