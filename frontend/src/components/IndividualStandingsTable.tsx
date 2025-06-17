import { DataTable } from "mantine-datatable";
import type { IndividualData } from "@/types/data.ts";
import { useMemo } from "react";
import { individualStandingsColumns } from "@/types/tables/individualStandings.tsx";
import { placesWithTies } from "@/utils/places.ts";

export default function IndividualStandingsTable({
  individuals,
}: { individuals: IndividualData[] }) {
  const individualsWithPlaces = useMemo(() => {
    return placesWithTies(individuals);
  }, [individuals]);

  return (
    <DataTable
      columns={individualStandingsColumns}
      records={individualsWithPlaces}
      striped
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{
        marginBottom: "4rem",
      }}
      idAccessor={"name"}
    />
  );
}
