import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  NavLink,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMergedRef } from "@mantine/hooks";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { type Ref, useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { homeRoute, statGroupIndividualStandingsRoute } from "@/routes.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tournamentDataOptions } from "@/api.ts";
import { isQ } from "@/utils/utils.ts";
import { largerThan, smallerThan } from "@/utils/styleUtils.ts";
import { ScrollRefsContext } from "@/context.ts";
import { mergeRefs } from "@/utils/mergeRefs.ts";

export const Shell = () => {
  const [scrollRefs, setScrollRefs] = useState<Ref<HTMLElement>[]>([]);

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const location = useLocation();

  const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: i don't want to
  useEffect(() => {
    if (mobileOpened) {
      toggleMobile();
    } else if (desktopOpened) {
      toggleDesktop();
    }
  }, [location.pathname]);

  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const statGroups = useMemo(() => {
    return data?.statGroups.filter((statGroup) => {
      if (!isQ(data)) return true;
      return (
        statGroup.webName !== statGroup.name && !statGroup.name.endsWith("f")
      );
    });
  }, [data]);

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
            {/* TODO: Finish navbar and re-enable */}
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
            component={Link}
            to={homeRoute.to}
            viewTransition={true}
          />
          {/*<NavLink*/}
          {/*  label="Division Standings"*/}
          {/*  component={Link}*/}
          {/*  to={homeRoute.to}*/}
          {/*  viewTransition={true}*/}
          {/*  hashScrollIntoView=""*/}
          {/*/>*/}
          {isLoading || error || data?.statGroups.length === 0 ? (
            <Skeleton height={40} mb="xs" />
          ) : (
            // <AppShell.Section grow component={ScrollArea} ml="md">
            statGroups.map((statGroup) => (
              <NavLink
                key={statGroup.name}
                label={statGroup.webName}
                defaultOpened
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
                  to={statGroupIndividualStandingsRoute.to}
                  // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                  params={{ statGroupName: statGroup.name }}
                />
              </NavLink>
            ))
            // </AppShell.Section>
          )}
        </AppShell.Navbar>
        <AppShell.Main
          ref={mergeRefs(scrollRefs)}
          style={{
            overflow: mobileOpened ? "hidden" : "scroll",
          }}
          sx={(theme, u) => ({
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
          </ScrollRefsContext>
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
};
