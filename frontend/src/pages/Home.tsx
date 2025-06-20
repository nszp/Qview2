import { tournamentDataOptions } from "@/api.ts";
import { HomepageSection } from "@/components/HomepageSection.tsx";
import { StatGroupCard } from "@/components/StatGroupCard.tsx";
import { StatGroupTeamList } from "@/components/StatGroupTeamList.tsx";
import StreamCards from "@/components/StreamCards.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { individualOverviewRoute, teamOverviewRoute } from "@/routes.ts";
import { theme } from "@/theme.ts";
import { isQ } from "@/utils/utils.ts";
import {
  Autocomplete,
  Box,
  Button,
  Flex,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  useComputedColorScheme,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  component: function Home() {
    const {
      scrollIntoView: scrollDivisionStandingsIntoView,
      targetRef: targetDivisionStandingsRef,
    } = useScrollIntoView<HTMLDivElement>({
      offset: 150,
      duration: 600,
    });
    const { scrollIntoView: scrollSearchIntoView, targetRef: targetSearchRef } =
      useScrollIntoView<HTMLDivElement>({
        offset: 150,
        duration: 600,
      });
    const {
      scrollIntoView: scrollTeamSchedulesIntoView,
      targetRef: targetTeamSchedulesRef,
    } = useScrollIntoView<HTMLDivElement>({
      offset: 150,
      duration: 600,
    });
    const {
      scrollIntoView: scrollStreamsIntoView,
      targetRef: targetStreamsRef,
    } = useScrollIntoView<HTMLDivElement>({
      offset: 150,
      duration: 600,
    });

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    const navigate = homeRoute.useNavigate();

    const colorScheme = useComputedColorScheme("light");

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
          data?.statGroups
            .filter((statGroup) => {
              if (!isQ(data)) return true;
              return (
                statGroup.webName !== statGroup.name &&
                !statGroup.name.endsWith("f")
              );
            })
            .flatMap((statGroup) => {
              return statGroup.teams.map((team) => team.name);
            }),
        ),
      ],
      [data],
    );

    if (error) {
      return <div>Error loading data: {error.message}</div>;
    }

    return (
      <>
        <Box
          w="100%"
          top={{
            base: 60,
            md: 70,
            lg: 80,
          }}
          bg="var(--mantine-color-body)"
          mt="-md"
          style={{
            position: "sticky",
            zIndex: 1000,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor:
              colorScheme === "light"
                ? theme.colors.gray[3]
                : theme.colors.dark[4],
          }}
        >
          <Flex
            justify="center"
            direction="row"
            align="center"
            w="100%"
            gap={{
              base: "xs",
              xs: "md",
              sm: "lg",
              md: "xl",
            }}
            py="sm"
          >
            {(
              [
                ["Standings", scrollDivisionStandingsIntoView, false],
                ["Search", scrollSearchIntoView, true],
                ["Schedules", scrollTeamSchedulesIntoView, false],
                isQ(data)
                  ? ["Streams", scrollStreamsIntoView, true]
                  : undefined,
              ] as [string, () => void, boolean][]
            ).map(([name, scrollIntoView, visibleOnMobile]) => (
              <Button
                onClick={() => scrollIntoView()}
                key={name}
                miw="fit-content"
                variant="subtle"
                size="compact-md"
                visibleFrom={visibleOnMobile ? undefined : "xs"}
                style={{
                  color: "unset",
                }}
              >
                {name}
              </Button>
            ))}
          </Flex>
        </Box>

        <HomepageSection
          name={"Division Standings"}
          ref={targetDivisionStandingsRef}
        >
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
            {data?.statGroups
              .filter(
                (division) => division.name !== division.webName || !isQ(data),
              )
              .map((division) => (
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
        <HomepageSection name={"Search"} ref={targetSearchRef}>
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
        <HomepageSection name={"Team Schedules"} ref={targetTeamSchedulesRef}>
          {data?.statGroups
            .filter((statGroup) => {
              if (!isQ(data)) return true;
              return (
                statGroup.webName !== statGroup.name &&
                !statGroup.name.endsWith("f")
              );
            })
            .map((statGroup) => (
              <StatGroupTeamList
                statGroup={statGroup}
                key={statGroup.name}
                openByDefault={false}
              />
            )) ?? <Skeleton height={256} radius="md" mb="md" w="100%" />}
        </HomepageSection>
        {isQ(data) && (
          <HomepageSection name={"Streams"} ref={targetStreamsRef}>
            <StreamCards />
          </HomepageSection>
        )}
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
