export function placesWithTies<T>(
  input: T[],
  primaryKey: keyof T = "score", // Sort by this
  secondaryKey: keyof T = "errors", // Break ties by this after primary key if possible
  // If two people after 6th place are tied, they should both be 7th place
): Array<T & { place: number }> {
  const output: Array<T & { place: number }> = [];
  let currentPlace = 1;
  let lastValue: T = null;
  let lastPlace = 0;
  for (const item of input) {
    if (
      lastValue === null ||
      item[primaryKey] < lastValue[primaryKey] ||
      (item[primaryKey] === lastValue[primaryKey] &&
        item[secondaryKey] < lastValue[secondaryKey])
    ) {
      currentPlace = output.length + 1; // Update current place
    }
    output.push({ ...item, place: currentPlace });
    lastValue = item;
    lastPlace = currentPlace;
  }
  // If the last place is not the same as the current place, fill in the last places
  if (lastPlace < currentPlace) {
    for (let i = lastPlace + 1; i <= currentPlace; i++) {
      output.push({ ...lastValue, place: i });
    }
  }
  return output;
}
