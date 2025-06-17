import type { DataTableColumn } from "mantine-datatable";
import type { TeamData } from "@/types/data.ts";
import { Text } from "@mantine/core";

export const teamStandingsColumns: DataTableColumn<
  TeamData & { place: number }
>[] = [
  {
    accessor: "place",
    title: "#",
    textAlign: "center",
    width: "5%",
    // cellsStyle: {
    //   position: "sticky",
    // },
    render: (team) => {
      return (
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {team.place}
        </span>
      );
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
];
