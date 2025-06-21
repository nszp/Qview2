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
  Box,
  Burger,
  Flex,
  Group,
  NavLink,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { mergeRefs, useDisclosure } from "@mantine/hooks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
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
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const location = useLocation();

  const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);

  const toggle = () => {
    if (mobileOpened) {
      toggleMobile();
    } else if (desktopOpened) {
      toggleDesktop();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: i don't want to
  useEffect(() => {
    toggle();
  }, [location.pathname]);

  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const timestampDate = dayjs.unix(Number.parseInt(data.generationQueuedAt));

  return (
    <>
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
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
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
                {/*<Flex ta="center" direction="row" gap="xs" mr="md">*/}
                {/* TODO: make this a nvabar footer instead or something */}
                <Text span size="sm" p="0" mr="md">
                  <Text span c="dimmed" size="sm" p="0">
                    as of{" "}
                  </Text>
                  {timestampDate.format(" hh:mma")}
                  {timestampDate.isToday()
                    ? " today"
                    : timestampDate.isYesterday()
                      ? " yesterday"
                      : timestampDate.week() === dayjs().week()
                        ? timestampDate.format(" dddd")
                        : timestampDate.format(" MMM D")}
                </Text>
                {/*</Flex>*/}
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
        <AppShell.Navbar
          p="md"
          pt="0"
          sx={{
            overflow: "auto",
          }}
          zIndex={2000}
        >
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
                toggle();
              }
            }}
          />
          <NavLink
            label="Search Individuals and Teams"
            active={false}
            component={Link}
            to={homeRoute.to}
            viewTransition={true}
            resetScroll={true}
            // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
            search={{ section: "search" }}
            onClick={() => {
              if (location.pathname === homeRoute.path) {
                toggle();
              }
            }}
          />
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
                toggle();
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
                toggle();
              }
            }}
          />
          <NavLink
            label="Rounds in Progress"
            component={Link}
            to={tickertapeRoute.to}
            viewTransition={true}
          />
          <Text size="xs" fw={600} pl="0.5rem" mt="10px" c="dimmed">
            Divisions
          </Text>
          {isLoading || error || data?.statGroups.length === 0 ? (
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
        </AppShell.Navbar>
        <AppShell.Main
          ref={mergeRefs(...scrollRefs)}
          style={{}}
          sx={(theme, u) => ({
            overflow: mobileOpened ? "hidden" : "scroll",
            paddingBottom: "4rem",
            paddingTop: "40px",
            [u.smallerThan("md")]: {
              height: "calc(100vh - 60px)",
              marginTop: `calc(60px - ${theme.spacing.md})`,
            },
            [`@media ${largerThan(u, "md")} and ${smallerThan(u, "lg")}`]: {
              height: "calc(100vh - 70px)",
              marginTop: `calc(70px - ${theme.spacing.md})`,
            },
            [u.largerThan("lg")]: {
              height: "calc(100vh - 80px)",
              marginTop: `calc(80px - ${theme.spacing.md})`,
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
            <Flex justify="center" mb="md">
              <Anchor
                ta="center"
                underline="hover"
                component={Link}
                to={aboutRoute.to}
              >
                Developed by QView Quiz Technologies Development Working Group.
              </Anchor>
            </Flex>
          </ScrollRefsContext>
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
};
