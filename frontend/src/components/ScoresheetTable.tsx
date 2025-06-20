import type { Scoresheet } from "@/types/data";
import { getRecords, scoresheetColumns } from "@/types/tables/scoresheet.tsx";
import { Box } from "@mantine/core";
import { DataTable } from "mantine-datatable";

export default function ScoresheetTable({ data }: { data: Scoresheet }) {
  return (
    <Box mx="auto" maw="75em" mb="md">
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
        idAccessor={"tableId"}
      />
    </Box>
  );
}
