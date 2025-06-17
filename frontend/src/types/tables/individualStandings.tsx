import type { DataTableColumn } from "mantine-datatable";
import type { IndividualData } from "@/types/data.ts";

export const individualStandingsColumns: DataTableColumn<
  IndividualData & { place: number }
>[] = [
  {
    accessor: "place",
    title: "#",
    textAlign: "center",
    width: "5%",
    // cellsStyle: {
    //   position: "sticky",
    // },
    render: (individual) => {
      return (
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {individual.place}
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
    accessor: "averageScore",
    title: "Avg",
    textAlign: "center",
    width: "20%",
  },
  {
    accessor: "score",
    title: "Score",
    textAlign: "center",
    width: "15%",
  },
  {
    accessor: "correct",
    render: (individual) => `${individual.correct}/${individual.errors}`,
    title: "Questions",
    textAlign: "center",
    width: "20%",
  },
  // {
  //   accessor: "bonus",
  //   render: (individual) => `${individual.bonus}/${individual.bonusAttempts}`,
  //   title: "Bonuses",
  //   textAlign: "center",
  //   width: "20%",
  // },
];
