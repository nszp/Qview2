import { createRoute } from "@tanstack/react-router";
import { Flex, Text } from "@mantine/core";
import { tournamentDataOptions } from "@/api.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { useSuspenseQuery } from "@tanstack/react-query";

export const individualOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats/individual/$individualName",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function IndividualOverview() {
    const { individualName } = individualOverviewRoute.useParams();

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    // const division = data?.divisions.find((d) => d.name === divisionName);

    if (isPending) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    // if (!division) {
    //   return <Navigate to="/" replace />;
    // }

    // const division = data.divisions.find(
    //   (d) => d.name === divisionName,
    // );
    //
    // if (!division) {
    //   navigate("/");
    //   return null;
    // }

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
