import type { StreamRoomType, TournamentData } from "@/types/data.ts";

export function transformTournamentData(data: TournamentData) {
  return transformLocalNoviceIndividuals(addRoomList(data));
}

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
  return {
    ...data,
    rooms: {
      Novice: [...roomsList.Novice],
      Experienced: [...roomsList.Experienced],
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
