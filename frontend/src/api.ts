import type { Scoresheet, TournamentData } from "@/types/data.ts";
import { queryOptions, useQuery } from "@tanstack/react-query";

const BASE_URL = "https://pub-6d08eec9bb2b41c1a12ec58fb2943b8d.r2.dev";
const TOURNAMENT_DATA_URL = `${BASE_URL}/tournamentData.json`;

function getScoresheetDataUrl(scoreSheetId: string): string {
  return `${BASE_URL}/scoresheet${scoreSheetId}.json`;
}

export async function getTournamentData(): Promise<TournamentData> {
  const response = await fetch(TOURNAMENT_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch tournament data: ${response.statusText}`);
  }
  return (await response.json()) as Promise<TournamentData>;
}

export async function getScoresheetData(
  scoreSheetId: string,
): Promise<Scoresheet> {
  const url = getScoresheetDataUrl(scoreSheetId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch scoresheet data: ${response.statusText}`);
  }
  return (await response.json()) as Promise<Scoresheet>;
}

export const tournamentDataOptions = queryOptions({
  queryKey: ["tournament"],
  queryFn: getTournamentData,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export const scoresheetDataOptions = (scoreSheetId: string) =>
  queryOptions({
    queryKey: ["scoresheet", scoreSheetId],
    queryFn: () => getScoresheetData(scoreSheetId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
