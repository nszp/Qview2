import { theme } from "@/theme.ts";
import type { IndividualData, Scoresheet, ScoresheetTeam } from "@/types/data";
import { Box, Flex, Text, Tooltip } from "@mantine/core";
import type { DataTableColumn } from "mantine-datatable";
import type { MRT_ColumnDef } from "mantine-react-table";

const correctScoresheetColor = theme.colors.green[8];
const errorScoresheetColor = theme.colors.red[9];

export type ScoresheetTableRow = {
  name: string;
  questions: string[];
  totalScore: string | number;
  totalCorrect: string | number;
  totalErrors: string | number;
  totalFouls: string | number;
  dummyHeader?: boolean; // Display as a row of headers
  tableId: string;
};

export const scoresheetColumns: DataTableColumn<ScoresheetTableRow>[] = [
  {
    accessor: "name",
    title: "Name",
    textAlign: "left",
    noWrap: true,
    render: (row) =>
      row.dummyHeader ? (
        <Text fw={700}>{row.name}</Text>
      ) : (
        <Text fw={row.name === "Running Score" ? 500 : undefined}>
          {row.name}
        </Text>
      ),
  },
];

for (let i = 0; i < 21; i++) {
  scoresheetColumns.push({
    accessor: `questions.${i}`,
    title: i === 20 ? "TB" : `${i + 1}`,
    textAlign: "center",
    width: "40px",
    cellsStyle: (record) =>
      record.dummyHeader
        ? undefined
        : {
            paddingLeft: 0,
            paddingRight: 0,
          },
    render: (row) =>
      row.dummyHeader ? (
        <Text fw={700}>{i === 20 ? "TB" : `${i + 1}`}</Text>
      ) : (
        <Text
          ta="center"
          fw={
            row.name === "Running Score"
              ? 500
              : row.name !== "Bonus/Penalty Pts"
                ? 600
                : undefined
          }
          c={
            row.name === "Running Score" || row.name === "Bonus/Penalty Pts"
              ? undefined
              : ["20", "30"].includes(row.questions[i])
                ? correctScoresheetColor
                : ["E"].includes(row.questions[i])
                  ? errorScoresheetColor
                  : undefined
          }
        >
          {row.name === "Running Score"
            ? row.questions[i] === ""
              ? "—"
              : row.questions[i]
            : row.questions[i]}
        </Text>
      ),
  });
}

scoresheetColumns.push({
  accessor: "totalScore",
  title: "Score",
  textAlign: "center",
  render: (row) => {
    return row.dummyHeader ? (
      <Text fw={700}>Score</Text>
    ) : row.totalScore === "" ? (
      ""
    ) : (
      <Tooltip
        label={
          <Box>
            {(
              [
                ["Score", "totalScore"],
                ["empty"],
                ["Correct", "totalCorrect"],
                ["Errors", "totalErrors"],
                ["Fouls", "totalFouls"],
              ] as ([string, keyof ScoresheetTableRow] | ["empty"])[]
            ).map(([title, property], index) =>
              property === undefined ? (
                <br key={`empty${Number(index)}`} />
              ) : (
                <Flex justify="space-between" key={property} miw="90px">
                  <Text>{title}:</Text>
                  <Text>{row[property]}</Text>
                </Flex>
              ),
            )}
          </Box>
        }
      >
        <Flex>
          <Box w="50%">
            <Text
              ta="center"
              span
              fw={row.name === "Running Score" ? 500 : undefined}
            >
              {row.totalScore}
            </Text>
          </Box>
          <Box w="50%" ta="center">
            <Text span c={correctScoresheetColor} fw={600}>
              {row.totalCorrect}
            </Text>
            <Text span>/</Text>
            <Text span c={errorScoresheetColor} fw={600}>
              {row.totalErrors}
            </Text>
          </Box>
        </Flex>
      </Tooltip>
    );
  },
  noWrap: true,
  width: "100px",
});

export function getTeamRecords(team: ScoresheetTeam) {
  const records: ScoresheetTableRow[] = [
    ...team.quizzers.map((quizzer) => ({
      ...quizzer,
      tableId: `${team.name}-${quizzer.name}`,
    })),
  ];
  records.push({
    name: "Bonus/Penalty Pts",
    tableId: `${team.name}-bonus-penalty-pts`,
    questions: team.bonusOrPenaltyPoints,
    totalScore: "",
    totalCorrect: "",
    totalErrors: "",
    totalFouls: "",
  });

  const teamLastRunningScore = team.runningScore.reduceRight(
    (previous, current) => {
      if (previous !== "") return previous;
      return current === "" ? "" : current;
    },
    "",
  );

  records.push({
    name: "Running Score",
    tableId: `${team.name}-running-score`,
    questions: team.runningScore,
    totalScore: teamLastRunningScore === "" ? "0" : teamLastRunningScore,
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

export function getRecords(scoresheet: Scoresheet) {
  return scoresheet.teams.flatMap((team) => {
    return [
      {
        name: team.name,
        questions: [],
        totalErrors: "",
        totalCorrect: "",
        totalFouls: "",
        totalScore: "",
        dummyHeader: true,
        tableId: `${team.name}-header`,
      },
      ...getTeamRecords(team),
    ];
  });
}
