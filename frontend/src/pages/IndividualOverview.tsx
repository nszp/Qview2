import { tournamentDataOptions } from "@/api.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Flex, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";

export const individualOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats/individual/$individualName",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function IndividualOverview() {
    const { individualName } = individualOverviewRoute.useParams();

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    if (isPending) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
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
          <Text size="xl">{individualName}</Text>
          <Text size="md" mb="md" c="gray">
            Individual Stats Across Divisions
          </Text>
        </Flex>
      </>
    );
  },
});
