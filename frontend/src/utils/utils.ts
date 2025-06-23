import type { TournamentData } from "@/types/data.ts";

export function placesWithTies<T>(
  input: T[],
  primaryKey: keyof T, // Sort by this
  secondaryKey: keyof T, // Break ties by this after primary key if possible
  // If two people after 6th place are tied, they should both be 7th place
): Array<T & { place: number }> {
  const output: Array<T & { place: number }> = [];
  let currentPlace = 1;
  let lastValue: T | null = null;
  let lastPlace = 0;
  for (const item of input) {
    if (
      lastValue === null ||
      item[primaryKey] <
        (lastValue?.[primaryKey] as (typeof item)[typeof primaryKey]) ||
      (item[primaryKey] ===
        (lastValue?.[primaryKey] as (typeof item)[typeof primaryKey]) &&
        item[secondaryKey] <
          (lastValue?.[secondaryKey] as (typeof item)[typeof secondaryKey]))
    ) {
      currentPlace = output.length + 1; // Update current place
    }
    output.push({ ...item, place: currentPlace });
    lastValue = item;
    lastPlace = currentPlace;
  }
  // If the last place is not the same as the current place, fill in the last places
  if (lastPlace < currentPlace && lastValue !== null) {
    for (let i = lastPlace + 1; i <= currentPlace; i++) {
      output.push({ ...lastValue, place: i });
    }
  }
  return output;
}

export function isQ(_tournament: TournamentData) {
  return true; // tournamentName is not often correct, so we will just assume this is Q
  // return (
  //   tournament.tournamentName === `Q${new Date().getFullYear()}` ||
  //   tournament.tournamentName === `Q${new Date().getFullYear() - 1}`
  // );
}
