export function elapsedMs(events) {
  const first = events[0].serverTimestamp.getTime()
  const last = events[events.length - 1].serverTimestamp.getTime()
  return last - first
}
