import { DataTable } from "mantine-datatable";
import type { IndividualData, TeamData } from "@/types/data.ts";
import { useMemo } from "react";
import { individualStandingsColumns } from "@/types/tables/individualStandings.tsx";
import { placesWithTies } from "@/utils/places.ts";
import { teamStandingsColumns } from "@/types/tables/teamStandings.tsx";

export default function TeamStandingsTable({ teams }: { teams: TeamData[] }) {
  const teamsWithPlaces = useMemo(() => {
    return placesWithTies(teams, "wins", "modifiedOlympicPoints");
  }, [teams]);

  return (
    <DataTable
      columns={teamStandingsColumns}
      records={teamsWithPlaces}
      striped
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{
        marginBottom: "4rem",
      }}
      idAccessor={"name"}
      pinFirstColumn
    />
  );
}
