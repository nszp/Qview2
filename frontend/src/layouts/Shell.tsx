import { tournamentDataOptions } from "@/api.ts";
import { ScrollRefsContext } from "@/context.ts";
import {
  aboutRoute,
  homeRoute,
  statGroupIndividualStandingsRoute,
  statGroupTeamScheduleRoute,
  statGroupTeamStandingsRoute,
  tickertapeRoute,
} from "@/routes.ts";
import { largerThan, smallerThan } from "@/utils/styleUtils.ts";
import { isQ } from "@/utils/utils.ts";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Burger,
  Flex,
  Group,
  NavLink,
  ScrollArea,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { mergeRefs, useDisclosure } from "@mantine/hooks";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday.js";
import isYesterday from "dayjs/plugin/isYesterday.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import { Moon, Sun } from "lucide-react";
import { type Ref, useEffect, useState } from "react";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekOfYear);

export const Shell = () => {
  const [scrollRefs, setScrollRefs] = useState<Ref<HTMLElement>[]>([]);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure();

  const location = useLocation();

  const { isPending, isFetching, error, data } = useQuery(
    tournamentDataOptions,
  );

  const toggle = () => {
    if (mobileOpened) {
      toggleMobile();
    } else if (desktopOpened) {
      toggleDesktop();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: i don't want to
  useEffect(() => {
    if (mobileOpened) {
      toggleMobile();
    }
  }, [location.pathname]);

  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const timestampDate = data
    ? dayjs.unix(Number.parseInt(data.generationQueuedAt))
    : undefined;

  return (
    <>
      <HeadContent />
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Group justify="space-between" sx={{ flex: 1 }}>
              <Text
                component={Link}
                to={homeRoute.to}
                viewTransition={true}
                size="lg"
                fw={500}
                sx={{
                  marginTop: "-0.1rem",
                  userSelect: "none",
                }}
              >
                Q2025 Stats
              </Text>
              <Group gap={0}>
                <ActionIcon
                  variant="transparent"
                  aria-label="Change color scheme"
                  c={colorScheme === "light" ? "black" : "white"}
                  onClick={toggleColorScheme}
                  p={2}
                >
                  {colorScheme === "light" ? (
                    <Sun size={24} />
                  ) : (
                    <Moon size={24} />
                  )}
                </ActionIcon>
              </Group>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar pl="md" pt="md" p="0" zIndex={2000}>
          <AppShell.Section grow component={ScrollArea} pr="md">
            <NavLink
              label="Home"
              active={false}
              component={Link}
              to={homeRoute.to}
              viewTransition={true}
              resetScroll={true}
              // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
              search={{ section: "division-standings" }}
              // TODO: make this a dropdown that goes to the correct group of stat groups
              onClick={() => {
                if (location.pathname === homeRoute.path) {
                  toggleMobile();
                }
              }}
            />
            {/*<NavLink*/}
            {/*  label="Search Individuals and Teams"*/}
            {/*  active={false}*/}
            {/*  component={Link}*/}
            {/*  to={homeRoute.to}*/}
            {/*  viewTransition={true}*/}
            {/*  resetScroll={true}*/}
            {/*  // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)*/}
            {/*  search={{ section: "search" }}*/}
            {/*  onClick={() => {*/}
            {/*    if (location.pathname === homeRoute.path) {*/}
            {/*      toggleMobile();*/}
            {/*    }*/}
            {/*  }}*/}
            {/*/>*/}
            <NavLink
              label="Team Schedules"
              active={false}
              component={Link}
              to={homeRoute.to}
              viewTransition={true}
              resetScroll={true}
              // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
              search={{ section: "team-schedules" }}
              // TODO: make this a dropdown that goes to the correct group of stat groups
              onClick={() => {
                if (location.pathname === homeRoute.path) {
                  toggleMobile();
                }
              }}
            />
            <NavLink
              label="Room Schedules and Livestreams"
              active={false}
              component={Link}
              to={homeRoute.to}
              viewTransition={true}
              resetScroll={true}
              // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
              search={{ section: "streams" }}
              // TODO: make this a dropdown that goes to the correct group of streams
              onClick={() => {
                if (location.pathname === homeRoute.path) {
                  toggleMobile();
                }
              }}
            />
            <NavLink
              label="Rounds in Progress"
              component={Link}
              to={tickertapeRoute.to}
            />
            <Text size="xs" fw={600} pl="0.5rem" mt="10px" c="dimmed">
              Divisions
            </Text>
            {isPending || error || data?.statGroups.length === 0 ? (
              <Skeleton height={40} mb="xs" />
            ) : isQ(data) ? (
              [
                "Field",
                "District Experienced",
                "Local Experienced",
                "District Novice",
                "Local Novice",
                "Decades",
              ]
                .filter((outerGroupName) =>
                  data.statGroups.some(
                    (statGroup) =>
                      statGroup.webName.startsWith(outerGroupName) &&
                      statGroup.name !== statGroup.webName,
                  ),
                )
                .map((outerGroupName) => (
                  <NavLink key={outerGroupName} label={outerGroupName}>
                    {data.statGroups
                      .filter((statGroup) =>
                        statGroup.webName.startsWith(outerGroupName),
                      )
                      .map((statGroup) =>
                        statGroup.webName.endsWith("Individuals") ? (
                          <NavLink
                            key={statGroup.name}
                            label="Individual Standings"
                            component={Link}
                            to={statGroupIndividualStandingsRoute.to}
                            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                            params={{ statGroupName: statGroup.name }}
                            viewTransition={true}
                          />
                        ) : (
                          <NavLink
                            key={statGroup.name}
                            label={
                              outerGroupName === "Field"
                                ? statGroup.webName
                                : statGroup.webName.replace(
                                    `${outerGroupName} `,
                                    "",
                                  )
                            }
                          >
                            <NavLink
                              label="Individual Standings"
                              component={Link}
                              to={statGroupIndividualStandingsRoute.to}
                              // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                              params={{ statGroupName: statGroup.name }}
                            />
                            <NavLink
                              label="Team Standings"
                              component={Link}
                              to={statGroupTeamStandingsRoute.to}
                              // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                              params={{ statGroupName: statGroup.name }}
                            />
                            {!statGroup.name.endsWith("f") && (
                              <NavLink label="Team Schedules">
                                {statGroup.teams.map((team) => (
                                  <NavLink
                                    key={team.name}
                                    label={team.name}
                                    component={Link}
                                    to={statGroupTeamScheduleRoute.to}
                                    params={{
                                      // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                                      statGroupName: statGroup.name,
                                      teamName: team.name,
                                    }}
                                  />
                                ))}
                              </NavLink>
                            )}
                          </NavLink>
                        ),
                      )}
                  </NavLink>
                ))
            ) : (
              data.statGroups.map((statGroup) => (
                <NavLink key={statGroup.name} label={statGroup.webName}>
                  <NavLink
                    label="Individual Standings"
                    component={Link}
                    to={statGroupIndividualStandingsRoute.to}
                    // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                    params={{ statGroupName: statGroup.name }}
                  />
                  <NavLink
                    label="Team Standings"
                    component={Link}
                    to={statGroupTeamStandingsRoute.to}
                    // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                    params={{ statGroupName: statGroup.name }}
                  />
                </NavLink>
              ))
            )}
          </AppShell.Section>
          <AppShell.Section
            style={{
              position: "fixed",
              width: "var(--app-shell-navbar-width)",
              marginLeft: "calc(var(--mantine-spacing-md) * -1)",
              bottom: 0,
              borderRight: "1px solid var(--app-shell-border-color)",
              borderTop: "1px solid var(--app-shell-border-color)",
              backgroundColor: "var(--mantine-color-body)",
              paddingTop: "0.5rem",
              paddingLeft: "var(--mantine-spacing-md)",
              paddingRight: "var(--mantine-spacing-md)",
              paddingBottom: "0.5rem",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Text span size="sm">
              {isFetching ? (
                <Text span c="dimmed" size="sm">
                  Updating...
                </Text>
              ) : (
                timestampDate && (
                  <>
                    <Text span c="dimmed" size="sm">
                      Updated at{" "}
                    </Text>
                    {timestampDate.format(" hh:mma")}
                    {timestampDate.isToday()
                      ? " today"
                      : timestampDate.isYesterday()
                        ? " yesterday"
                        : timestampDate.week() === dayjs().week()
                          ? timestampDate.format(" dddd")
                          : timestampDate.format(" MMM D")}
                  </>
                )
              )}
            </Text>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main
          ref={mergeRefs(...scrollRefs)}
          style={{}}
          sx={(theme, u) => ({
            overflow: mobileOpened ? "hidden" : "scroll",
            overflowX: "auto", // allow horizontal scroll but don't have the gutter unless needed
            paddingBottom: theme.spacing.md,
            paddingTop: theme.spacing.lg,
            [u.smallerThan("md")]: {
              height: "calc(100dvh - 60px)",
              minHeight: "calc(100dvh - 60px)",
              marginTop: "60px",
            },
            [`@media ${largerThan(u, "md")} and ${smallerThan(u, "lg")}`]: {
              height: "calc(100dvh - 70px)",
              minHeight: "calc(100dvh - 70px)",
              marginTop: "70px",
            },
            [u.largerThan("lg")]: {
              height: "calc(100dvh - 80px)",
              minHeight: "calc(100dvh - 80px)",
              marginTop: "80px",
            },
          })}
        >
          <ScrollRefsContext
            value={{
              scrollRefs,
              setScrollRefs,
            }}
          >
            <Outlet />
            {/* TODO: re-add after finishing about page */}
            {/*<Flex justify="center" mb="md">*/}
            {/*  <Anchor*/}
            {/*    ta="center"*/}
            {/*    underline="hover"*/}
            {/*    component={Link}*/}
            {/*    to={aboutRoute.to}*/}
            {/*  >*/}
            {/*    Developed by QView Quiz Technologies Development Working Group.*/}
            {/*  </Anchor>*/}
            {/*</Flex>*/}
          </ScrollRefsContext>
        </AppShell.Main>
      </AppShell>
      {/*<TanStackRouterDevtools position="bottom-left" />*/}
    </>
  );
};
