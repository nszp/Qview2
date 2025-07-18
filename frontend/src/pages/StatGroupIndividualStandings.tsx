import { tournamentDataOptions } from "@/api.ts";
import IndividualStandingsTable from "@/components/standings/IndividualStandingsTable.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Flex, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createRoute } from "@tanstack/react-router";
import { useMemo } from "react";

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

    const individualsWithScheduledRounds = useMemo(() => {
      return statGroup.individuals.map((i) => {
        const team = statGroup.teams.find((t) => t.name === i.team);
        if (!team) {
          return {
            ...i,
            scheduledRounds: 0, // If no team found, assume no scheduled rounds
          };
        }

        const uniqueQuizzes = new Set(
          team.quizzes.map((quiz) => `${quiz.round}-${quiz.room}`),
        );

        return {
          ...i,
          scheduledRounds: uniqueQuizzes.size,
        };
      });
    }, [statGroup]);

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
        <IndividualStandingsTable
          individuals={individualsWithScheduledRounds}
          statGroupName={statGroup.name}
        />
      </>
    );
  },
});
