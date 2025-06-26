import type { StreamRoomType, TournamentData } from "@/types/data.ts";

export function transformTournamentData(data: TournamentData) {
  return transformLocalNoviceIndividuals(addRoomList(data));
}

export const roomListNumbers = {
  Kresge: 1,
  LF005: 2,
  LF006: 3,
  LF007: 4,
  RS202: 5,
  RS208: 6,
  RS214: 7,
  RS302: 8,
  RS300: 9,
  LF131: 10,
  LF136: 11,
  LF142: 12,
  BA001: 13,
  BA005: 14,
  BA007: 15,
  BA010: 16,
  BA306: 17,
  BA307: 18,
  BA402: 19,
  BA403: 20,
  BA411: 21,
  BA413: 22,
  WC103: 23,
  WC104: 24,
  WC204: 25,
  WC207: 26,
  WC301: 27,
  WC304: 28,
  WC305: 29,
  WC306: 30,
};

function addRoomList<T extends TournamentData>(
  data: T,
): T & {
  rooms: {
    Novice: string[];
    Experienced: string[];
  };
} {
  const roomsList: Record<StreamRoomType, Set<string>> = {
    Novice: new Set<string>(),
    Experienced: new Set<string>(),
  };
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const listOfAllRooms = new Set<string>(); // allocate an empty set to test that the browser is modern enough (we don't want people on old browsers to use this website)
  for (const quiz of data.statGroups
    .flatMap((statGroup) => statGroup.teams)
    .flatMap((team) => team.quizzes)) {
    if (quiz.division.includes("Novice")) {
      roomsList.Novice.add(quiz.room);
    } else if (quiz.division.includes("Experienced")) {
      roomsList.Experienced.add(quiz.room);
    }
  }
  const Novice = [...roomsList.Novice];
  const Experienced = [...roomsList.Experienced];

  Novice.sort((a: string, b: string) => {
    return (
      (roomListNumbers[a as keyof typeof roomListNumbers] ?? 100) -
      (roomListNumbers[b as keyof typeof roomListNumbers] ?? 100)
    );
  });

  Experienced.sort((a: string, b: string) => {
    return (
      (roomListNumbers[a as keyof typeof roomListNumbers] ?? 100) -
      (roomListNumbers[b as keyof typeof roomListNumbers] ?? 100)
    );
  });

  return {
    ...data,
    rooms: {
      Novice,
      Experienced,
    },
  };
}

function transformLocalNoviceIndividuals<T extends TournamentData>(data: T): T {
  // Find the statGroup with the webName "Local Novice Individuals" and change the webName to "Local Novice Prelims"
  const statGroup = data.statGroups.find(
    (group) => group.webName === "Local Novice Individuals",
  );
  if (statGroup) {
    statGroup.webName = "Local Novice Prelims";
  }
  return data;
}
