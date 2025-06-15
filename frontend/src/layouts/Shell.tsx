import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  Text,
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" sx={{ flex: 1 }}>
            <Text
              size="lg"
              fw={500}
              sx={{
                marginTop: "-0.2rem",
                userSelect: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate("/", { viewTransition: true })}
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
  );
};
