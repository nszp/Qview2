import { tournamentDataOptions } from "@/api.ts";
import HomepageCollapsable from "@/components/homepage/HomepageCollapsable.tsx";
import { HomepageSection } from "@/components/homepage/HomepageSection.tsx";
import { StatGroupCard } from "@/components/homepage/StatGroupCard.tsx";
import { StatGroupTeamList } from "@/components/homepage/StatGroupTeamList.tsx";
import StreamCards from "@/components/homepage/StreamCards.tsx";
import { ScrollRefsContext } from "@/context.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { individualOverviewRoute, teamOverviewRoute } from "@/routes.ts";
import { theme } from "@/theme.ts";
import { scrollIntoViewOptions } from "@/utils/styleUtils.ts";
import { isQ } from "@/utils/utils.ts";
import {
  Autocomplete,
  Box,
  Button,
  Flex,
  SimpleGrid,
  Skeleton,
  Space,
  useComputedColorScheme,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { useContext, useEffect, useMemo } from "react";

interface HomeSearch {
  section?: string;
}

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search): HomeSearch => {
    return {
      section: (search.section as string) || undefined,
    };
  },
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  head: () => ({
    meta: [
      {
        title: "Q2025 Stats",
      },
    ],
  }),
  component: function Home() {
    const { setScrollRefs } = useContext(ScrollRefsContext);
    const { section } = homeRoute.useSearch();

    const {
      scrollIntoView: scrollDivisionStandingsIntoView,
      targetRef: targetDivisionStandingsRef,
      scrollableRef: scrollableDivisionStandingsRef,
    } = useScrollIntoView<HTMLDivElement>(scrollIntoViewOptions);
    const {
      scrollIntoView: scrollSearchIntoView,
      targetRef: targetSearchRef,
      scrollableRef: scrollableSearchRef,
    } = useScrollIntoView<HTMLDivElement>(scrollIntoViewOptions);
    const {
      scrollIntoView: scrollTeamSchedulesIntoView,
      targetRef: targetTeamSchedulesRef,
      scrollableRef: scrollableTeamSchedulesRef,
    } = useScrollIntoView<HTMLDivElement>(scrollIntoViewOptions);
    const {
      scrollIntoView: scrollStreamsIntoView,
      targetRef: targetStreamsRef,
      scrollableRef: scrollableStreamsRef,
    } = useScrollIntoView<HTMLDivElement>(scrollIntoViewOptions);

    useEffect(() => {
      setScrollRefs([
        scrollableStreamsRef,
        scrollableTeamSchedulesRef,
        scrollableSearchRef,
        scrollableDivisionStandingsRef,
      ]);
    }, [
      scrollableStreamsRef,
      scrollableTeamSchedulesRef,
      scrollableSearchRef,
      scrollableDivisionStandingsRef,
      setScrollRefs,
    ]);

    const navigate = homeRoute.useNavigate();

    useEffect(() => {
      if (section === "division-standings") {
        scrollDivisionStandingsIntoView();
      } else if (section === "search") {
        scrollSearchIntoView();
      } else if (section === "team-schedules") {
        scrollTeamSchedulesIntoView();
      } else if (section === "streams") {
        scrollStreamsIntoView();
      }
    }, [
      section,
      scrollDivisionStandingsIntoView,
      scrollSearchIntoView,
      scrollTeamSchedulesIntoView,
      scrollStreamsIntoView,
    ]);

    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

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
          top="-20px" // change this and `mt` together
          bg="var(--mantine-color-body)"
          mt="-20px" // offsets the padding of the container
          style={{
            position: "sticky",
            zIndex: 50, // the navbar is 100
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

        <Space pt="md"></Space>
        <HomepageSection
          name="Division Standings"
          ref={targetDivisionStandingsRef}
        >
          <SimpleGrid
            cols={{
              base: 1,
              xs: data ? Math.min(2, data.statGroups.length) : 2,
              lg: data ? Math.min(3, data.statGroups.length) : 3,
              xl: data ? Math.min(4, data.statGroups.length) : 4,
            }}
            sx={{
              width: "100%",
            }}
            spacing="sm"
            verticalSpacing="md"
          >
            {isPending &&
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
            {data &&
              !isQ(data) &&
              data.statGroups
                // .filter(
                //   (division) => division.name !== division.webName || !isQ(data),
                // )
                .map((statGroup) => (
                  <StatGroupCard statGroup={statGroup} key={statGroup.name} />
                ))}
          </SimpleGrid>
          {data &&
            isQ(data) &&
            ["Field", "District", "Local", "Decades"]
              .filter((outerGroupName) =>
                data.statGroups.some(
                  (statGroup) =>
                    statGroup.webName.startsWith(outerGroupName) &&
                    statGroup.name !== statGroup.webName,
                ),
              )
              .map((outerGroupName) => (
                <HomepageCollapsable
                  title={outerGroupName}
                  key={outerGroupName}
                  openByDefault={true}
                >
                  <SimpleGrid
                    cols={{
                      base: 1,
                      xs: data ? Math.min(2, data.statGroups.length) : 2,
                      lg: data ? Math.min(3, data.statGroups.length) : 3,
                      xl: data ? Math.min(4, data.statGroups.length) : 4,
                    }}
                    sx={{
                      width: "100%",
                    }}
                    spacing="sm"
                    verticalSpacing="md"
                    mb="md"
                  >
                    {data.statGroups
                      .filter(
                        (statGroup) =>
                          statGroup.name !== statGroup.webName &&
                          statGroup.webName.startsWith(outerGroupName),
                      )
                      .map((statGroup) => (
                        <StatGroupCard
                          key={statGroup.name}
                          statGroup={statGroup}
                        />
                      ))}
                  </SimpleGrid>
                </HomepageCollapsable>
              ))}
        </HomepageSection>
        <HomepageSection name="Search" ref={targetSearchRef}>
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
        <HomepageSection name="Team Schedules" ref={targetTeamSchedulesRef}>
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
          <HomepageSection name="Streams" ref={targetStreamsRef}>
            <StreamCards />
          </HomepageSection>
        )}
      </>
    );
  },
  errorComponent: function HomeError({ error, reset }) {
    const router = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();
    const posthog = usePostHog();

    useEffect(() => {
      queryErrorResetBoundary.reset();
    }, [queryErrorResetBoundary]);

    useEffect(() => {
      posthog.captureException(error);
      console.error(error);
    }, [error, posthog]);

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
