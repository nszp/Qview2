import type { Scoresheet } from "@/types/data";
import {
  getRecords,
  getTeamRecords,
  scoresheetColumns,
} from "@/types/tables/scoresheet.tsx";
import { DataTable } from "mantine-datatable";

export default function ScoresheetTable({ data }: { data: Scoresheet }) {
  return (
    <>
      <DataTable
        records={getRecords(data)}
        columns={scoresheetColumns}
        striped
        withColumnBorders
        withTableBorder
        pinFirstColumn
        pinLastColumn
        noHeader
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        sx={{
          marginBottom: "4rem",
        }}
        idAccessor={"tableId"}
      />
    </>
  );
}
