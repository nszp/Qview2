import {
  Button,
  Card,
  Flex,
  SimpleGrid,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import type { DivisionData } from "../types/data.ts";
import { useNavigate } from "react-router";

export function DivisionCard({ division }: { division: DivisionData }) {
  const navigate = useNavigate();

  const colorScheme = useComputedColorScheme("light");

  return (
    <Card withBorder shadow="sm" radius="md" padding="sm" key={division.name}>
      <Card.Section inheritPadding pt="sm">
        <Flex justify="center" align="center">
          <Text size="md" hiddenFrom="sm" mb="xs" sx={{ whiteSpace: "nowrap" }}>
            {division.name}
          </Text>
          <Text
            size="lg"
            visibleFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap" }}
          >
            {division.name}
          </Text>
        </Flex>
      </Card.Section>
      <Card.Section>
        <SimpleGrid cols={2} spacing="0">
          <Button
            variant="outline"
            color="gray"
            radius="0"
            onClick={() =>
              navigate(
                `/individual/${division.name.toLowerCase().replace(/ /g, "_")}`,
                { viewTransition: true },
              )
            }
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: theme.fontSizes.xs,
              },
              [u.largerThan("sm")]: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          >
            Individuals
          </Button>

          <Button
            variant="outline"
            color="gray"
            radius="0"
            onClick={() =>
              navigate(
                `/team/${division.name.toLowerCase().replace(/ /g, "_")}`,
                { viewTransition: true },
              )
            }
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderRightWidth: 0,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: theme.fontSizes.xs,
              },
              [u.largerThan("sm")]: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          >
            Teams
          </Button>
        </SimpleGrid>
      </Card.Section>
    </Card>
  );
}
