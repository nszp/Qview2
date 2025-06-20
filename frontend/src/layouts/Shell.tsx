import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { homeRoute, statGroupIndividualStandingsRoute } from "@/routes.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tournamentDataOptions } from "@/api.ts";

export const Shell = () => {
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
        <AppShell.Navbar p="md">
          {isLoading || error || data?.statGroups.length === 0 ? (
            <Skeleton height={40} mb="xs" />
          ) : (
            <AppShell.Section grow component={ScrollArea}>
              {data.statGroups.map((statGroup) => (
                <NavLink
                  key={statGroup.name}
                  label={statGroup.name}
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
              ))}
            </AppShell.Section>
          )}
        </AppShell.Navbar>
        <AppShell.Main>
          {/*<ScrollArea*/}
          {/*  type={mobileOpened || desktopOpened ? "never" : "auto"}*/}
          {/*  styles={{*/}
          {/*    viewport: {*/}
          {/*      minHeight: "99vh",*/}
          {/*    },*/}
          {/*    content: {*/}
          {/*      minHeight: "99vh",*/}
          {/*    },*/}
          {/*  }}*/}
          {/*>*/}
          <Outlet />
          {/*</ScrollArea>*/}
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
};
