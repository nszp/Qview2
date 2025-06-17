import { DataTable } from "mantine-datatable";
import type { IndividualData } from "@/types/data.ts";
import { useMemo, useState } from "react";
import { placesWithTies } from "@/utils/places.ts";
import styled from "@emotion/styled";
import { ChevronLeftIcon } from "lucide-react";

const ExpandIcon = styled(ChevronLeftIcon)({
  // marginTop: "auto",
  marginBottom: "-6px",
  transition: "transform 0.2s ease-in-out",
  "&.expanded": {
    transform: "rotate(-90deg)",
  },
});

export default function IndividualStandingsTable({
  individuals,
}: { individuals: IndividualData[] }) {
  const [expandedIndividualIds, setExpandedIndividualIds] = useState<string[]>(
    [],
  );
  const [animatingIds, setAnimatingIds] = useState<string[]>([]);

  const individualsWithPlaces = useMemo(() => {
    return placesWithTies(individuals, "score", "errors");
  }, [individuals]);

  return (
    <DataTable
      columns={[
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
        {
          accessor: "expandIcon",
          render: (individual) => (
            <ExpandIcon
              // size={24}
              onClick={() => {
                if (animatingIds.includes(individual.name)) return;
                setAnimatingIds((prev) => [...prev, individual.name]);
                setExpandedIndividualIds((prev) =>
                  prev.includes(individual.name)
                    ? prev.filter((id) => id !== individual.name)
                    : [...prev, individual.name],
                );
                setTimeout(() => {
                  setAnimatingIds((prev) =>
                    prev.filter((id) => id !== individual.name),
                  );
                }, 200); // match transition duration
              }}
              className={
                expandedIndividualIds.includes(individual.name)
                  ? "expanded"
                  : ""
              }
            />
          ),
          title: "",
          textAlign: "center",
          width: "5%",
        },
      ]}
      records={individualsWithPlaces}
      striped
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{
        marginBottom: "4rem",
      }}
      idAccessor={"name"}
      pinFirstColumn
      highlightOnHover
      rowExpansion={{
        allowMultiple: true,
        trigger: "never",
        expanded: {
          recordIds: expandedIndividualIds,
          onRecordIdsChange: setExpandedIndividualIds,
        },
        content: ({ record: individual }) => (
          <div>
            <p>Rounds: {individual.rounds}</p>
            <p>Average Score: {individual.averageScore}</p>
            <p>
              Correct/Errors: {individual.correct}/{individual.errors}
            </p>
            {/* Add more details as needed */}
          </div>
        ),
      }}
    />
  );
}
