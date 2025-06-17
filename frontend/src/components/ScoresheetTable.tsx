import type { Scoresheet } from "@/types/data";
import { MRT_Table, useMantineReactTable } from "mantine-react-table";
import { useMemo } from "react";
import getScoresheetTableOptions from "@/types/tables/scoresheet.tsx";

export default function ScoresheetTable({ data }: { data: Scoresheet }) {
  const tableOptions = useMemo(() => {
    return getScoresheetTableOptions(data.teams);
  }, [data.teams]);

  const table = useMantineReactTable({
    ...tableOptions,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mantineTableProps: {
      highlightOnHover: false,
      striped: "odd",
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
      sx: {
        tableLayout: "fixed",
      },
      styles: {
        thead: {
          display: "none",
        },
        td: {
          textAlign: "center",
          paddingLeft: "0",
          paddingRight: "0",
        },
      },
    },
    mantineTableHeadCellProps: {
      sx: {
        "> div": {
          alignItems: "center",
        },
      },
    },
  });

  return <MRT_Table table={table} />;
}
