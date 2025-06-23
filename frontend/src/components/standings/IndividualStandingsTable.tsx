import { DataTable, type DataTableColumn } from "mantine-datatable";
import type { IndividualData } from "@/types/data.ts";
import { useMemo } from "react";
import { placesWithTies } from "@/utils/utils.ts";
import styled from "@emotion/styled";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Box, Text } from "@mantine/core";
import { individualRoundSummaryRoute } from "@/pages";

const Open = styled(ExternalLinkIcon)({
  marginBottom: "-6px",
});

export default function IndividualStandingsTable({
  individuals,
  statGroupName,
}: {
  individuals: (IndividualData & {
    scheduledRounds: number;
  })[];
  statGroupName?: string;
}) {
  const individualsWithPlaces = useMemo(() => {
    return placesWithTies(individuals, "score", "errors");
  }, [individuals]);

  const columns: DataTableColumn<
    IndividualData & {
      place: number;
      scheduledRounds: number;
    }
  >[] = [
    {
      accessor: "place",
      title: "#",
      textAlign: "center",
      width: "5%",
      render: (individual) => {
        return <strong>{individual.place}</strong>;
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
      render: (individual) =>
        individual.scheduledRounds !== 0
          ? `${individual.rounds} of ${individual.scheduledRounds}`
          : individual.rounds,
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
    {
      accessor: "team",
      title: "Team",
      textAlign: "left",
      noWrap: true,
    },
  ];

  if (statGroupName) {
    columns.push({
      accessor: "expandIcon",
      render: (individual) => (
        <Text
          component={Link}
          to={individualRoundSummaryRoute.to}
          // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
          params={{ individualName: individual.name, statGroupName }}
        >
          <Open size={24} />
        </Text>
      ),
      title: "",
      textAlign: "center",
      width: "5%",
    });
  }

  return (
    <Box mb="md">
      <DataTable
        columns={columns}
        records={individualsWithPlaces}
        striped
        withRowBorders
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        minHeight={individuals.length > 0 ? 50 : 100}
        idAccessor={"name"}
        pinFirstColumn
        emptyState={
          <Text>No standings yet. Check back after the first round!</Text>
        }
      />
    </Box>
  );
}
