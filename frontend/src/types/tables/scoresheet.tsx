import type { ScoresheetTeam } from "@/types/data";
import type { MRT_ColumnDef } from "mantine-react-table";

export type ScoresheetTableRow = {
  name: string;
  questions: string[];
  totalScore: string | number;
  totalCorrect: string | number;
  totalErrors: string | number;
  totalFouls: string | number;
  dummyHeader?: boolean; // Display as a row of headers
};

export default function getScoresheetTableOptions(teams: ScoresheetTeam[]): {
  columns: MRT_ColumnDef<ScoresheetTableRow>[];
  data: ScoresheetTableRow[];
} {
  if (teams.length === 0) {
    return { columns: [], data: [] };
  }

  const columns: MRT_ColumnDef<ScoresheetTableRow>[] = [];

  columns.push({
    header: teams[0].name,
    id: "quizzer",
    accessorFn: (quizzer) => (
      <div
        style={{ textAlign: "left", paddingLeft: "10px", paddingRight: "10px" }}
      >
        {quizzer.dummyHeader ? <strong>{quizzer.name}</strong> : quizzer.name}
      </div>
    ),
    grow: false,
  });

  for (let i = 0; i < 21; i++) {
    columns.push({
      header: i === 20 ? "TB" : `${i + 1}`,
      id: `question${i + 1}`,
      accessorFn: (quizzer) =>
        quizzer.dummyHeader ? (
          <strong>{i === 20 ? "TB" : `${i + 1}`}</strong>
        ) : (
          quizzer.questions[i] || ""
        ),
      size: 20,
      maxSize: 20,
    });
  }

  columns.push(
    {
      header: "Score",
      id: "score",
      accessorFn: (quizzer) => (
        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          {quizzer.dummyHeader ? <strong>Score</strong> : quizzer.totalScore}
        </div>
      ),
      size: 30,
    },
    {
      header: "Record",
      id: "correct",
      accessorFn: (quizzer) => (
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {quizzer.dummyHeader ? (
            <strong>Record</strong>
          ) : quizzer.totalCorrect !== "" ? (
            `${quizzer.totalCorrect}/${quizzer.totalErrors}/${quizzer.totalFouls}`
          ) : (
            ""
          )}
        </div>
      ),
      size: 50,
    },
  );

  const data: ScoresheetTableRow[] = [];

  for (const team of teams) {
    // if (team.name !== teams[0].name) {
    // Add a separator row with duplicated header columns
    data.push({
      name: team.name,
      dummyHeader: true,
    } as ScoresheetTableRow);
    // }

    data.push(...team.quizzers);

    data.push({
      name: "Bonuses/Penalties",
      questions: team.bonusOrPenaltyPoints,
      totalScore: "",
      totalCorrect: "",
      totalErrors: "",
      totalFouls: "",
    });

    data.push({
      name: "Running Score",
      questions: team.runningScore,
      totalScore: team.runningScore[team.runningScore.length - 2],
      totalCorrect: team.quizzers.reduce(
        (previous, quizzer) => previous + quizzer.totalCorrect,
        0,
      ),
      totalErrors: team.quizzers.reduce(
        (previous, quizzer) => previous + quizzer.totalErrors,
        0,
      ),
      totalFouls: team.quizzers.reduce(
        (previous, quizzer) => previous + quizzer.totalFouls,
        0,
      ),
    });
  }

  return { columns, data };
}
