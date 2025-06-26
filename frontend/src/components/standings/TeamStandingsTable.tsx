import { DataTable } from "mantine-datatable";
import type { TeamData } from "@/types/data.ts";
import { useMemo } from "react";
import { placesWithTies } from "@/utils/utils.ts";
import { Box, Text } from "@mantine/core";

export default function TeamStandingsTable({ teams }: { teams: TeamData[] }) {
  const teamsWithPlaces = useMemo(() => {
    return placesWithTies(teams, "wins", "modifiedOlympicPoints");
  }, [teams]);

  return (
    <Box mb="md">
      <DataTable
        columns={[
          {
            accessor: "place",
            title: "#",
            textAlign: "center",
            width: "5%",
            render: (team) => {
              return <strong>{team.place}</strong>;
            },
          },
          {
            accessor: "name",
            title: "Name",
            textAlign: "left",
            noWrap: true,
          },
          {
            accessor: "rounds",
            title: "Rounds",
            textAlign: "center",
            noWrap: true,
            render: (team) =>
              team.quizzes.length !== 0
                ? `${team.rounds} of ${
                    new Set(
                      team.quizzes.map((quiz) => `${quiz.round}-${quiz.room}`),
                    ).size
                  }`
                : team.rounds,
          },
          {
            accessor: "record",
            render: (team) => (
              <Text>
                {team.wins}/{team.losses}
              </Text>
            ),
            title: "Record",
            textAlign: "center",
            width: "20%",
            noWrap: true,
          },
          {
            accessor: "olympicPoints",
            title: "Olympic",
            textAlign: "center",
          },
          {
            accessor: "modifiedOlympicPoints",
            title: "M. Olympic",
            textAlign: "center",
          },
          {
            accessor: "averageScore",
            title: "Avg",
            textAlign: "center",
            width: "20%",
            render: (team) => {
              return team.averageScore.toFixed(1).endsWith(".0")
                ? team.averageScore
                : team.averageScore.toFixed(1);
            },
          },
        ]}
        records={teamsWithPlaces}
        striped
        withRowBorders
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        idAccessor={"name"}
        pinFirstColumn
        minHeight={teams.length > 0 ? 50 : 100}
        emptyState={
          <Text>No standings yet. Check back after the first round!</Text>
        }
      />
    </Box>
  );
}
