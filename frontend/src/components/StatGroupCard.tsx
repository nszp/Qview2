import {
  Button,
  Card,
  Flex,
  SimpleGrid,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import type { StatGroupData } from "../types/data.ts";
import { useNavigate } from "react-router";

export function StatGroupCard({ statGroup }: { statGroup: StatGroupData }) {
  const navigate = useNavigate();

  const colorScheme = useComputedColorScheme("light");

  return (
    <Card withBorder shadow="sm" radius="md" p="md" key={statGroup.name}>
      <Card.Section inheritPadding pt="sm">
        <Flex justify="center" align="center">
          <Text
            size="md"
            hiddenFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.02em" }}
          >
            {statGroup.name}
          </Text>
          <Text
            size="lg"
            visibleFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.04em" }}
          >
            {statGroup.name}
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
                `/stats/division/${encodeURIComponent(statGroup.name)}/individual`,
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
                `/stats/division/${encodeURIComponent(statGroup.name)}/team`,
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
