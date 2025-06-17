import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { homeRoute } from "@/routes.ts";

export const Shell = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: i don't want to
  useEffect(() => {
    if (opened) {
      toggle();
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
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
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
          {/*{data.divisions.length === 0 ? (*/}
          {/*  <Skeleton height={40} mb="xs" />*/}
          {/*) : (*/}
          {/*  data.divisions.map((division) => (*/}
          {/*    <NavLink key={division.name} label={division.name} defaultOpened>*/}
          {/*      <NavLink*/}
          {/*        label="Individual Standings"*/}
          {/*        onClick={() =>*/}
          {/*          navigate(*/}
          {/*            `/stats/division/${encodeURIComponent(division.name)}/individual`,*/}
          {/*          )*/}
          {/*        }*/}
          {/*      />*/}
          {/*      <NavLink*/}
          {/*        label="Team Standings"*/}
          {/*        onClick={() =>*/}
          {/*          navigate(*/}
          {/*            `/stats/division/${encodeURIComponent(division.name)}/team`,*/}
          {/*          )*/}
          {/*        }*/}
          {/*      />*/}
          {/*    </NavLink>*/}
          {/*  ))*/}
          {/*)}*/}
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
};
