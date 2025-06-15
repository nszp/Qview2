import { StatGroupCard } from "@/components/StatGroupCard.tsx";
import { Autocomplete, SimpleGrid, Skeleton } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { HomepageSection } from "@/components/HomepageSection.tsx";
import { createRoute, useRouter } from "@tanstack/react-router";
import { StatGroupTeamList } from "@/components/StatGroupTeamList.tsx";
import { tournamentDataOptions } from "@/api.ts";
import { individualOverviewRoute, teamOverviewRoute } from "@/routes.ts";
import { rootRoute } from "@/rootRoute.ts";
import { queryClient } from "@/main.tsx";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function Home() {
    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    const navigate = homeRoute.useNavigate();

    const individualsList = useMemo(
      () => [
        ...new Set(
          data?.statGroups.flatMap((statGroup) => {
            return statGroup.individuals.map((individual) => individual.name);
          }),
        ),
      ],
      [data?.statGroups],
    );

    const teamsList = useMemo(
      () => [
        ...new Set(
          data?.statGroups.flatMap((statGroup) => {
            return statGroup.teams.map((team) => team.name);
          }),
        ),
      ],
      [data?.statGroups],
    );

    if (error) {
      return <div>Error loading data: {error.message}</div>;
    }

    return (
      <>
        <HomepageSection name={"Division Standings"}>
          <SimpleGrid
            cols={{
              base: 1,
              xs: data ? Math.min(2, data.statGroups.length) : 2,
              lg: data ? Math.min(4, data.statGroups.length) : 4,
              xl: data ? Math.min(6, data.statGroups.length) : 6,
            }}
            sx={{
              width: "100%",
            }}
            spacing="sm"
            verticalSpacing="md"
          >
            {data?.statGroups.map((division) => (
              <StatGroupCard statGroup={division} key={division.name} />
            )) ??
              new Array(24).fill(undefined).map((_, index) => (
                <Skeleton radius="md" key={Number(index)}>
                  <StatGroupCard
                    statGroup={{
                      name: "Loading...", // placeholder so that the skeleton has the same height as a standard card
                      webName: "Loading...",
                      individuals: [],
                      teams: [],
                    }}
                  />
                </Skeleton>
              ))}
          </SimpleGrid>
        </HomepageSection>
        <HomepageSection name={"Search"}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%">
            <Skeleton visible={isPending}>
              <Autocomplete
                label="Search Individuals"
                description="See stats for an individual across all divisions"
                placeholder="Enter a person's name..."
                flex="1"
                data={individualsList}
                onOptionSubmit={(individual) => {
                  navigate({
                    to: individualOverviewRoute.to,
                    params: {
                      individualName: individual,
                    },
                    viewTransition: true,
                  });
                }}
                styles={{
                  label: {
                    textAlign: "center",
                    width: "100%",
                  },
                  description: {
                    textAlign: "center",
                    width: "100%",
                  },
                }}
                mb="none"
              />
            </Skeleton>
            <Skeleton visible={isPending}>
              <Autocomplete
                label="Search Teams"
                description="See stats for a team across all divisions"
                placeholder="Enter a team name..."
                flex="1"
                data={teamsList}
                onOptionSubmit={(team) => {
                  navigate({
                    to: teamOverviewRoute.to,
                    params: { teamName: team },
                    viewTransition: true,
                  });
                }}
                styles={{
                  label: {
                    textAlign: "center",
                    width: "100%",
                  },
                  description: {
                    textAlign: "center",
                    width: "100%",
                  },
                }}
                mb="none"
              />
            </Skeleton>
          </SimpleGrid>
        </HomepageSection>
        <HomepageSection name={"Team Schedules"}>
          {data?.statGroups.map((statGroup) => (
            <StatGroupTeamList statGroup={statGroup} key={statGroup.name} />
          )) ?? <Skeleton height={256} radius="md" mb="md" w="100%" />}
        </HomepageSection>
      </>
    );
  },
  errorComponent: function HomeError({ error, reset }) {
    const router = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    useEffect(() => {
      queryErrorResetBoundary.reset();
    }, [queryErrorResetBoundary]);

    // TODO: make this Mantine
    // TODO: Link preloading on this page

    return (
      <div>
        <h1>Error loading home page</h1>
        <p>{error.message}</p>
        <button
          type="button"
          onClick={() => {
            reset();
          }}
        >
          Retry
        </button>
      </div>
    );
  },
});
