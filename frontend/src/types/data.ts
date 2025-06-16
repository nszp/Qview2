export type ScoresheetQuestion =
  | ""
  | "-10"
  | "10"
  | "20"
  | "30"
  | "C"
  | "E"
  | "B"
  | "/";
// / == missed bonus, C == 21st question tiebreaker

export interface ScoresheetQuizzer {
  name: string;
  questions: Array<ScoresheetQuestion>;
  totalScore: number;
  totalCorrect: number;
  totalErrors: number;
  totalFouls: number;
}

export interface ScoresheetTeam {
  name: string;
  quizzersWithCorrectQuestions: number;
  overruledChallenges: number;
  place: number;
  quizzers: Array<ScoresheetQuizzer>;
  bonusOrPenaltyPoints: Array<string>;
  runningScore: Array<string>;
}

export interface Scoresheet {
  tdrri: string;
  division: string;
  room: string;
  round: string;
  tournament: string; // TODO: check if matches in main tournament data
  teams: Array<ScoresheetTeam>;
}

export interface TickertapeRoomData {
  division: string;
  room: string;
  round: string;
  tdrri: number;
  teams: { name: string; score: number }[];
  time: number;
  tournament: string;
  livestreamUrl?: string;
}

export interface IndividualRoundData {
  errors: number;
  room: string;
  round: string;
  score: number;
  tdrri: number;
}

export interface IndividualData {
  according: number;
  averageScore: number;
  bonus: number;
  bonusAttempts: number;
  context: number;
  correct: number;
  errors: number;
  errors16_5: number;
  generals: number;
  memory: number;
  name: string;
  quizzes: IndividualRoundData[];
  rounds: number;
  score: number;
  special: number;
  team: string;
}

export type TeamRoundData = TickertapeRoomData & {
  completed: boolean;
};

export interface TeamData {
  averageScore: number;
  losses: number;
  modifiedOlympicPoints: number;
  name: string;
  olympicPoints: number;
  quizzes: TeamRoundData[];
  rounds: number;
  totalScore: number;
  wins: number;
}

export interface StatGroupData {
  individuals: IndividualData[];
  name: string;
  teams: TeamData[];
  webName: string;
}

export interface TournamentData {
  statGroups: StatGroupData[];
  generationQueuedAt: string;
  generationCompletedAt: string;
  tournamentName: string;
  updatedEveryMinutes: number;
}
