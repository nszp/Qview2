import { DataContext } from "@/context.ts";
import { Flex, Text } from "@mantine/core";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router";

export function IndividualStats() {
  const navigate = useNavigate();
  const { divisionId } = useParams<{ divisionId: string }>();

  const data = useContext(DataContext);

  const division = data.divisions.find(
    (d) => d.name.toLowerCase().replace(/ /g, "_") === divisionId,
  );

  if (!division) {
    navigate("/");
    return null;
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
