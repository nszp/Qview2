import { Flex, Text } from "@mantine/core";
import { Navigate, useParams } from "react-router";
import { useTournamentData } from "@/api.ts";

export function StatGroupIndividualStats() {
  const { statGroupName } = useParams<{ statGroupName: string }>();

  const { isLoading, error, data } = useTournamentData();

  const statGroup = data?.statGroups.find((s) => s.name === statGroupName);

  if (isLoading) {
    return <p>wait,,,,</p>;
  }

  if (error) {
    return <p>Error: {error.toString()}</p>;
  }

  if (!statGroup) {
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
        <Text size="xl">{statGroup.name}</Text>
        <Text size="md" mb="md" c="gray">
          Individual Standings
        </Text>
      </Flex>
    </>
  );
}
