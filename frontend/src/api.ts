import type {
  Scoresheet,
  TickertapeData,
  TournamentData,
} from "@/types/data.ts";
import { queryOptions } from "@tanstack/react-query";
import { transformTournamentData } from "@/utils/transforms.ts";

declare global {
  interface Window {
    publicDataUrl?: string;
  }
}

let BASE_URL = "https://bucket.quizstats.org";
if (
  typeof window.publicDataUrl === "string" &&
  window.publicDataUrl !== "" &&
  window.publicDataUrl !== "<!PUBLIC_BUCKET_URL>"
) {
  BASE_URL = window.publicDataUrl;
}

const TOURNAMENT_DATA_URL = `${BASE_URL}/tournamentData.json`;
const TICKERTAPE_DATA_URL = `${BASE_URL}/tickertape.json`;

function getScoresheetDataUrl(scoreSheetId: string): string {
  return `${BASE_URL}/scoresheets/scoresheet${scoreSheetId}.json`;
}

export async function getTournamentData(): Promise<TournamentData> {
  const response = await fetch(TOURNAMENT_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch tournament data: ${response.statusText}`);
  }
  const data = await response.json();
  return transformTournamentData(data);
}

export async function getTickertapeData(): Promise<TickertapeData> {
  const response = await fetch(TICKERTAPE_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch tickertape data: ${response.statusText}`);
  }
  return (await response.json()) as Promise<TickertapeData>;
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

export const tickertapeDataOptions = queryOptions({
  queryKey: ["tickertape"],
  queryFn: getTickertapeData,
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
