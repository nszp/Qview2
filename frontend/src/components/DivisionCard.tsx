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
    <Card withBorder shadow="sm" radius="md" p="md" key={division.name}>
      <Card.Section inheritPadding pt="sm">
        <Flex justify="center" align="center">
          <Text
            size="md"
            hiddenFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.02em" }}
          >
            {division.name}
          </Text>
          <Text
            size="lg"
            visibleFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.04em" }}
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
                `/stats/division/${encodeURIComponent(division.name)}/individual`,
                { viewTransition: true },
              )
            }
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0.5,
              fontWeight: 500,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: "13px",
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
                `/stats/division/${encodeURIComponent(division.name)}/team`,
                { viewTransition: true },
              )
            }
            sx={(theme, u) => ({
              borderBottomWidth: 0,
              borderRightWidth: 0,
              borderLeftWidth: 0.5,
              fontWeight: 500,
              color:
                colorScheme === "light"
                  ? theme.colors.gray[9]
                  : theme.colors.dark[0],
              [u.smallerThan("sm")]: {
                fontSize: "13px",
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
