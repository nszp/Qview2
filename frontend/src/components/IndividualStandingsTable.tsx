import { DataTable } from "mantine-datatable";
import type { IndividualData } from "@/types/data.ts";
import { useMemo } from "react";
import { placesWithTies } from "@/utils/utils.ts";
import styled from "@emotion/styled";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Box, Text } from "@mantine/core";

const Open = styled(ExternalLinkIcon)({
  marginBottom: "-6px",
});

export default function IndividualStandingsTable({
  individuals,
}: { individuals: IndividualData[] }) {
  const individualsWithPlaces = useMemo(() => {
    return placesWithTies(individuals, "score", "errors");
  }, [individuals]);

  return (
    <Box mb="md">
      <DataTable
        columns={[
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
            render: (individual) =>
              `${individual.correct}/${individual.errors}`,
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
          {
            accessor: "expandIcon",
            render: (individual) => (
              // Todo: figure out where this link should go
              <Text component={Link} to={`/individual/${individual.name}`}>
                <Open size={24} />
              </Text>
            ),
            title: "",
            textAlign: "center",
            width: "5%",
          },
        ]}
        records={individualsWithPlaces}
        striped
        withRowBorders
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        idAccessor={"name"}
        pinFirstColumn
        emptyState={
          <Text>No standings yet. Check back after the first round!</Text>
        }
      />
    </Box>
  );
}
