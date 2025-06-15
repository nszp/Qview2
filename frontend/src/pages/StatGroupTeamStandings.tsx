import { Flex, Text } from "@mantine/core";
import { createRoute, Navigate } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";
import { queryClient } from "@/main.tsx";
import { tournamentDataOptions } from "@/api.ts";
import { useSuspenseQuery } from "@tanstack/react-query";

export const statGroupTeamStandingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats/division/$statGroupName/team",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function StatGroupTeamStandings() {
    const { statGroupName } = statGroupTeamStandingsRoute.useParams();

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    const statGroup = data?.statGroups.find((s) => s.name === statGroupName);

    if (isPending) {
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
            Team Standings
          </Text>
        </Flex>
      </>
    );
  },
});
