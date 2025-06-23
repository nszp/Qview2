import { createRoute, Link, Navigate } from "@tanstack/react-router";
import { Flex, Text } from "@mantine/core";
import { tournamentDataOptions } from "@/api.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import IndividualStandingsTable from "@/components/standings/IndividualStandingsTable.tsx";
import { Undo2Icon } from "lucide-react";
import { statGroupIndividualStandingsRoute } from "@/pages/StatGroupIndividualStandings.tsx";

export const individualRoundSummaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats/division/$statGroupName/individual/$individualName",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function IndividualRoundSummary() {
    const { statGroupName, individualName } =
      individualRoundSummaryRoute.useParams();

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    if (isPending) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    const statGroup = data?.statGroups.find((s) => s.name === statGroupName);

    if (!statGroup) {
      return <Navigate to="/" replace />;
    }

    const individual = statGroup?.individuals.find(
      (i) => i.name === individualName,
    );

    if (!individual) {
      return <Navigate to="/" replace />;
    }

    const team = statGroup?.teams.find((t) => t.name === individual?.team);

    const individuals = [
      {
        ...individual,
        scheduledRounds: team?.quizzes.length || 0,
      },
    ];

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
          <Text size="xl">{individualName}</Text>
          <Text size="md" mb="md" c="gray">
            Rounds in {statGroup.webName}
          </Text>
        </Flex>
        <IndividualStandingsTable individuals={individuals} />
        <Flex
          align="center"
          mb="md"
          direction="column"
          sx={(_, u) => ({
            [u.smallerThan("sm")]: {
              width: "100%",
            },
          })}
        >
          <Flex
            gap="4px"
            component={Link}
            to={statGroupIndividualStandingsRoute.to}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            params={{ statGroupName }}
            c="gray"
          >
            <Undo2Icon size={20} />
            <Text td="underline" mt="-2px">
              Go back to standings
            </Text>
          </Flex>
        </Flex>
      </>
    );
  },
});
