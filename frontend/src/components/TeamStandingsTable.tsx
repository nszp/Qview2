import { DataTable } from "mantine-datatable";
import type { IndividualData, TeamData } from "@/types/data.ts";
import { useMemo } from "react";
import { placesWithTies } from "@/utils/places.ts";
import { Text } from "@mantine/core";

export default function TeamStandingsTable({ teams }: { teams: TeamData[] }) {
  const teamsWithPlaces = useMemo(() => {
    return placesWithTies(teams, "wins", "modifiedOlympicPoints");
  }, [teams]);

  return (
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
        },
      ]}
      records={teamsWithPlaces}
      striped
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{
        marginBottom: "4rem",
      }}
      idAccessor={"name"}
      pinFirstColumn
      emptyState={
        <Text>No standings yet. Check back after the first round!</Text>
      }
    />
  );
}
