import { Box, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import type {
  IndividualData,
  IndividualRoundData,
  TeamRoundData,
} from "@/types/data.ts";

export default function IndividualRoundsTable({
  individual,
  teamQuizzes,
}: {
  individual: IndividualData;
  teamQuizzes: TeamRoundData[];
}) {
  return (
    <Box mb="md" mx="auto" maw="75em">
      <DataTable
        columns={[
          {
            accessor: "index",
            title: "Round",
            textAlign: "center",
            width: "5%",
            render: (_, index) => {
              return index + 1;
            },
          },
          {
            accessor: "score",
            title: "Score",
            textAlign: "center",
            width: "10%",
          },
          {
            accessor: "questions",
            title: "Questions",
            textAlign: "center",
            width: "10%",
            render: (round) => {
              let tempScore = round.score;
              if (round.errors === 3) {
                tempScore += 10;
              }
              if (round.score === 90) {
                tempScore -= 10;
              }
              const correct = tempScore / 20;
              return `${correct}/${round.errors}`;
            },
          },
          {
            accessor: "room",
            title: "Room",
            textAlign: "center",
            width: "10%",
          },
          {
            accessor: "opponent",
            title: "Opponent",
            textAlign: "left",
            noWrap: true,
            render: (round) => {
              const teamRound = teamQuizzes.find(
                (teamRound) => teamRound.round === round.round,
              );

              if (!teamRound) return "N/A";

              return (
                teamRound.teams.find((team) => team.name !== individual.team)
                  ?.name || "N/A"
              );
            },
          },
        ]}
        records={individual.quizzes}
        striped
        withRowBorders
        withTableBorder
        fz={{ base: "md", sm: "lg" }}
        mx="auto"
        minHeight={individual.quizzes.length > 0 ? 50 : 100}
        idAccessor={"name"}
        pinFirstColumn
        emptyState={
          <Text>
            Something went wrong and no rounds were found for this person.
          </Text>
        }
      />
    </Box>
  );
}
