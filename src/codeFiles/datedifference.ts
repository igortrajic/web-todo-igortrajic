export function getDateDiffFromToday(
  dateString: string,
  today: Date = new Date(),
): number {
  const dueDate = new Date(`${dateString}T00:00:00`)
  dueDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  return Math.floor(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )
}
