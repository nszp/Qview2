import {
  statGroupIndividualStandingsRoute,
  statGroupTeamStandingsRoute,
} from "@/routes.ts";
import {
  Button,
  Card,
  Flex,
  SimpleGrid,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import type { StatGroupData } from "../types/data.ts";

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
            {statGroup.webName}
          </Text>
          <Text
            size="lg"
            visibleFrom="sm"
            mb="xs"
            sx={{ whiteSpace: "nowrap", letterSpacing: "-0.04em" }}
          >
            {statGroup.webName}
          </Text>
        </Flex>
      </Card.Section>
      <Card.Section>
        <SimpleGrid cols={2} spacing="0">
          <Button
            component={Link}
            to={statGroupIndividualStandingsRoute.to}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            params={{ statGroupName: statGroup.name }}
            viewTransition
            variant="outline"
            color="gray"
            radius="0"
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
            component={Link}
            to={statGroupTeamStandingsRoute.to}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            params={{ statGroupName: statGroup.name }}
            viewTransition
            variant="outline"
            color="gray"
            radius="0"
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
