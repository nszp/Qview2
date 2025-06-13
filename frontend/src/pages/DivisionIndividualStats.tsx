import { DataContext } from "@/context.ts";
import { Flex, Text } from "@mantine/core";
import { useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useTournamentData } from "@/api.ts";

export function DivisionIndividualStats() {
  const navigate = useNavigate();
  const { divisionName } = useParams<{ divisionName: string }>();

  const { isPending, error, data } = useTournamentData();

  const division = data?.divisions.find((d) => d.name === divisionName);

  if (isPending) {
    return <p>wait,,,,</p>;
  }

  if (error) {
    return <p>Error: {error.toString()}</p>;
  }

  if (!division) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Flex
        justify="center"
        align="center"
        mb="md"
        direction="column"
        sx={(_, u) => ({
          [u.smallerThan("sm")]: {
            width: "100%",
          },
        })}
      >
        <Text size="xl">{division.name}</Text>
        <Text size="md" mb="md" c="gray">
          Individual Standings
        </Text>
      </Flex>
    </>
  );
}
