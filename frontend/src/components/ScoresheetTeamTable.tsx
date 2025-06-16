import type { ScoresheetQuizzer, ScoresheetTeam } from "@/types/data";
import {
  type MRT_ColumnDef,
  MRT_Table,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";

const columns: MRT_ColumnDef<Record<string, any>>[] = [
  {
    header: "Quizzer",
    id: "quizzer",
    accessorFn: (quizzer) => quizzer.name,
  },
];

for (let i = 0; i < 21; i++) {
  columns.push({
    header: i === 20 ? "OT" : `#${i + 1}`,
    id: `question${i + 1}`,
    accessorFn: (quizzer) => quizzer.questions[i] || "",
    minSize: 5,
    size: 5,
  });
}

columns.push(
  {
    header: "Score",
    id: "score",
    accessorFn: (quizzer) => quizzer.totalScore,
    minSize: 20,
    size: 20,
  },
  {
    header: "Correct",
    id: "correct",
    accessorFn: (quizzer) => quizzer.totalCorrect,
    minSize: 20,
    size: 20,
  },
  {
    header: "Error",
    id: "error",
    accessorFn: (quizzer) => quizzer.totalErrors,
    minSize: 20,
    size: 20,
  },
  {
    header: "Foul",
    id: "foul",
    accessorFn: (quizzer) => quizzer.totalFouls,
    minSize: 20,
    size: 20,
  },
);

export default function ScoresheetTeamTable({
  team,
}: { team: ScoresheetTeam }) {
  const quizzers = useMemo(() => {
    return [
      ...team.quizzers,
      {
        name: "Bonus/Penalty Points",
        questions: team.bonusOrPenaltyPoints,
        totalScore: "",
        totalCorrect: "",
        totalErrors: "",
        totalFouls: "",
      },
      {
        name: "Running Score",
        questions: team.runningScore,
        totalScore: team.runningScore[team.runningScore.length - 1],
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
      },
    ];
  }, [team.quizzers, team.bonusOrPenaltyPoints, team.runningScore]);

  const table = useMantineReactTable({
    data: quizzers,
    columns,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mantineTableProps: {
      highlightOnHover: false,
      striped: "odd",
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
  });

  return <MRT_Table table={table} />;
}
