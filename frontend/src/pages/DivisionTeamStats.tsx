import { DataContext } from "@/context";
import { Flex, Text } from "@mantine/core";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function DivisionTeamStats() {
  const navigate = useNavigate();
  const { divisionName } = useParams<{ divisionName: string }>();

  const data = useContext(DataContext);

  const division = data.divisions.find((d) => d.name === divisionName);

  useEffect(() => {
    if (!division) {
      navigate("/");
    }
  }, [division, navigate]);

  if (!division) {
    return <p>Division not found, returning home</p>;
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
          Team Standings
        </Text>
      </Flex>
    </>
  );
}
