import { useNavigate, useParams } from "react-router";
import { useContext } from "react";
import { DataContext } from "@/context.ts";
import { Flex, Text } from "@mantine/core";

export function TeamStats() {
  const navigate = useNavigate();
  const { teamName } = useParams<{ teamName: string }>();

  const data = useContext(DataContext);

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
