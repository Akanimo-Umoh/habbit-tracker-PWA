export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const todayDate = today ?? new Date().toISOString().split("T")[0];

  // remove duplicates
  const unique = [...new Set(completions)];

  // sort descending first
  const sorted = [...unique].sort((a, b) => b.localeCompare(a));

  // if today not completed - 0
  if (!sorted.includes(todayDate)) return 0;

  let streak = 0;
  const current = new Date(todayDate);

  for (const date of sorted) {
    const expected = current.toISOString().split("T")[0];

    if (date === expected) {
      streak++;
      current.setUTCDate(current.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
