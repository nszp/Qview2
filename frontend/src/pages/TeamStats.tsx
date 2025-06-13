import { useParams } from "react-router";
import { Flex, Text } from "@mantine/core";
import { useTournamentData } from "@/api.ts";

export function TeamStats() {
  const { teamName } = useParams<{ teamName: string }>();

  const { isPending, error, data } = useTournamentData();

  // const division = data?.divisions.find((d) => d.name === divisionName);

  if (isPending) {
    return <p>wait,,,,</p>;
  }

  if (error) {
    return <p>Error: {error.toString()}</p>;
  }

  // if (!division) {
  //   return <Navigate to="/" replace />;
  // }

  // const division = data.divisions.find(
  //   (d) => d.name === divisionName,
  // );
  //
  // if (!division) {
  //   navigate("/");
  //   return null;
  // }

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
        <Text size="xl">{teamName}</Text>
        <Text size="md" mb="md" c="gray">
          Team Stats Across Divisions
        </Text>
      </Flex>
    </>
  );
}
