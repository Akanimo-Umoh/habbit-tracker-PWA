export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex items-center justify-center bg-black"
    >
      <div className="text-center">
        <h1 className="text-xl font-semibold mt-2">Habit Tracker</h1>
        <p>Loading...</p>
      </div>
    </div>
  );
}
