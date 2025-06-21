import { Flex, Text } from "@mantine/core";
import { createRoute, Navigate } from "@tanstack/react-router";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { tournamentDataOptions } from "@/api.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import IndividualStandingsTable from "@/components/standings/IndividualStandingsTable.tsx";

export const statGroupIndividualStandingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats/division/$statGroupName/individual",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function StatGroupIndividualStandings() {
    const { statGroupName } = statGroupIndividualStandingsRoute.useParams();

    const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);

    const statGroup = data?.statGroups.find((s) => s.name === statGroupName);

    if (isLoading) {
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
          sx={(_, __) => ({
            // [u.smallerThan("sm")]: {
            width: "100%",
            // },
          })}
        >
          <Text size="xl">{statGroup.webName}</Text>
          <Text size="md" c="gray">
            Individual Standings
          </Text>
        </Flex>
        <IndividualStandingsTable individuals={statGroup.individuals} />
      </>
    );
  },
});
