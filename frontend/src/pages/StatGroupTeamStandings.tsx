import { tournamentDataOptions } from "@/api.ts";
import TeamStandingsTable from "@/components/standings/TeamStandingsTable.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Flex, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createRoute } from "@tanstack/react-router";

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
          <Text size="xl">{statGroup.webName}</Text>
          <Text size="md" mb="md" c="gray">
            Team Standings
          </Text>
        </Flex>
        <TeamStandingsTable
          teams={statGroup.teams.filter((team) => team.rounds > 0)}
        />
      </>
    );
  },
});
