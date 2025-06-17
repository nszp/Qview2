import type { IndividualData, ScoresheetTeam } from "@/types/data";
import type { DataTableColumn } from "mantine-datatable";
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

export const scoresheetColumns: DataTableColumn<ScoresheetTableRow>[] = [
  {
    accessor: "name",
    title: "Name",
    textAlign: "left",
    noWrap: true,
  },
];

for (let i = 0; i < 21; i++) {
  scoresheetColumns.push({
    accessor: `questions.${i}`,
    title: i === 20 ? "TB" : `${i + 1}`,
    textAlign: "center",
  });
}

scoresheetColumns.push({
  accessor: "totalScore",
  title: "Score",
  textAlign: "center",
});

scoresheetColumns.push({
  accessor: "totalCorrect",
  title: "Record",
  textAlign: "center",
  render: (row) =>
    row.totalScore === ""
      ? ""
      : `${row.totalCorrect}/${row.totalErrors}/${row.totalFouls}`,
});

export function getTeamRecords(team: ScoresheetTeam) {
  const records: ScoresheetTableRow[] = [...team.quizzers];
  records.push({
    name: "Bonus/Penalty Points",
    questions: team.bonusOrPenaltyPoints,
    totalScore: "",
    totalCorrect: "",
    totalErrors: "",
    totalFouls: "",
  });

  records.push({
    name: "Running Score",
    questions: team.runningScore,
    totalScore: team.runningScore.reduceRight((previous, current) => {
      if (previous !== "") return previous;
      return current === "" ? "" : current;
    }, ""),
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
  return records;
}
