import type { Scoresheet } from "@/types/data";
import {
  getTeamRecords,
  scoresheetColumns,
} from "@/types/tables/scoresheet.tsx";
import { DataTable } from "mantine-datatable";

export default function ScoresheetTable({ data }: { data: Scoresheet }) {
  return (
    <>
      <DataTable
        records={getTeamRecords(data.teams[0])}
        columns={scoresheetColumns}
        striped
        withColumnBorders
        withTableBorder
        pinFirstColumn
        pinLastColumn
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        sx={{
          marginBottom: "4rem",
        }}
        idAccessor={"name"}
      />
      <DataTable
        records={getTeamRecords(data.teams[1])}
        columns={scoresheetColumns}
        striped
        pinFirstColumn
        pinLastColumn
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        sx={{
          marginBottom: "4rem",
        }}
        idAccessor={"name"}
      />
    </>
  );
}
