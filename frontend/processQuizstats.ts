import quizstats from "./qstats.json";
import type { TournamentData } from "./src/types/data";
import dayjs from "dayjs";
import * as fsp from "node:fs/promises";

const prettyDivisionNamesForQ: Record<string, string> = {
  ln: "Local Novice",
  lna: "Local Novice Pool A",
  lnb: "Local Novice Pool B",
  lnuf: "Local Novice Upper Tournament",
  lnlf: "Local Novice Lower Tournament",
  lx: "Local Experienced",
  lxa: "Local Experienced Pool A",
  lxb: "Local Experienced Pool B",
  lxuf: "Local Experienced Upper Tournament",
  lxlf: "Local Experienced Lower Tournament",
  dn: "District Novice",
  dna: "District Novice Pool A",
  dnb: "District Novice Pool B",
  dnf: "District Novice Tournament",
  dx: "District Experienced",
  dxa: "District Experienced Pool A",
  dxb: "District Experienced Pool B",
  dxuf: "District Experienced Upper Tournament",
  dxlf: "District Experienced Lower Tournament",
  fa: "Field A",
  faf: "Field A Tournament",
  fb: "Field B",
  fbf: "Field B Tournament",
  "10sc": "Decades Competitive",
  "10sl": "Decades Less Competitive",
};

const divisionNameMap = new Map<string, string>();
Object.entries(prettyDivisionNamesForQ).forEach(([key, value]) => {
  divisionNameMap.set(value, key);
});

const tournamentData: TournamentData = {
  tournamentName: "Q2024",
  lastUpdated: dayjs().valueOf().toString(),
  updatedEveryMinutes: 1,
  tickertape: [],
  divisions: [...divisionNameMap.keys()].map((divisionName) => ({
    name: divisionName,
    webName: divisionName,
    individuals: [],
    teams: [],
  })),
};

type OldQuizStatsIndividualData = {
  place: number;
  name: string;
  team_name: string;
  rounds: number;
  score: number;
  avg_score: number;
  correct: number;
  errors: number;
  bonus: number;
  bonus_attempts: number;
};

type OldQuizStatsTeamData = {
  place: number;
  team_name: string;
  rounds: number;
  wins: number;
  loses: number;
  olympic_pts: number;
  modified_olympic: number;
  avg_score: number;
};

for (const division of tournamentData.divisions) {
  const divisionKey = divisionNameMap.get(
    division.name,
  ) as keyof typeof quizstats.individual;
  for (const individual of quizstats.individual[divisionKey]) {
    if (individual.name === "") continue; // Skip individuals with no name
    if (individual.team_name === "") {
      individual.team_name = "No Team";
    }
    division.individuals.push({
      according: 0,
      averageScore: individual.avg_score,
      bonus: individual.bonus,
      bonusAttempts: individual.bonus_attempts,
      context: 0,
      correct: individual.correct,
      errors: individual.errors,
      errors16_5: 0,
      generals: 0,
      memory: 0,
      name: individual.name,
      quizzes: [],
      rounds: individual.rounds,
      score: individual.score,
      special: 0,
      team: individual.team_name,
    });
  }
  for (const team of quizstats.team[divisionKey]) {
    if (team.team_name === "") continue;
    division.teams.push({
      averageScore: team.avg_score,
      losses: team.loses,
      modifiedOlympicPoints: team.modified_olympic,
      name: team.team_name,
      olympicPoints: team.olympic_pts,
      quizzes: [],
      rounds: team.rounds,
      totalScore: team.avg_score * team.rounds,
      wins: team.wins,
    });
  }
}

fsp.writeFile("./q2024.json", JSON.stringify(tournamentData, null, 2));
