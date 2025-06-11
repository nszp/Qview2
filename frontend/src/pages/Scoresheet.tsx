import { Navigate, useNavigate, useParams } from "react-router";
import { useContext, useEffect } from "react";
import { DataContext } from "@/context.ts";
import { Flex, Text } from "@mantine/core";

export function Scoresheet() {
  const navigate = useNavigate();
  const { roundNumber: _roundNumber } = useParams<{ roundNumber: string }>();
  const roundNumber = Number.parseInt(_roundNumber || "");

  if (Number.isNaN(roundNumber)) {
    return <Navigate to="/" replace />;
  }

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
        <Text size="xl">Scoresheet Thing</Text>
        <Text size="md" mb="md" c="gray">
          Yep it's a scoresheet
        </Text>
      </Flex>
    </>
  );
}
