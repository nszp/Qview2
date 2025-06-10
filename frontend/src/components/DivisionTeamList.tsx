import { Paper, SimpleGrid, Text, useComputedColorScheme } from "@mantine/core";
import type { DivisionData } from "../types/data.ts";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import { createStyles } from "@mantine/emotion";
import { largerThan, smallerThan } from "@/utils/styleUtils.ts";

const useStyles = createStyles((_theme, _, u) => ({
  teamListText: {
    whiteSpace: "nowrap",
    [u.smallerThan("xxs")]: {
      fontSize: "14px !important",
    },
    [`@media ${largerThan(u, "xxs")} and ${smallerThan(u, "xs")}`]: {
      fontSize: "12px !important",
    },
    [u.largerThan("xs")]: {
      fontSize: "13px !important",
    },
    [u.largerThan("md")]: {
      fontSize: "14px !important",
    },
  },
}));

/*
 * base: 1 column and 14px font size
 * xxs: 2 columns and 12px font size
 * sm: 2 columns and 13px font size
 * md: 4 columns and 13px font size
 * lg: 6 columns and 14px font size
 * xl: 8 columns and 14px font size
 * */

export function DivisionTeamList({ division }: { division: DivisionData }) {
  const navigate = useNavigate();

  const colorScheme = useComputedColorScheme("light");
  const { classes } = useStyles();

  const sortedTeams = useMemo(() => {
    return [...division.teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [division.teams]);

  return (
    <>
      <Text
        size="md"
        mb="sm"
        pb="xs"
        ta="center"
        w="50%"
        sx={(theme) => ({
          whiteSpace: "nowrap",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor:
            colorScheme === "light"
              ? theme.colors.gray[3]
              : theme.colors.dark[4],
        })}
      >
        {division.name}
      </Text>
      <SimpleGrid
        mb="md"
        cols={{
          base: 1,
          xxs: Math.min(2, division.teams.length),
          md: Math.min(4, division.teams.length),
          lg: Math.min(6, division.teams.length),
          xl: Math.min(8, division.teams.length),
        }}
        w="100%"
      >
        {sortedTeams.map((team) => (
          <Paper
            withBorder
            shadow="sm"
            radius="md"
            p="sm"
            key={team.name}
            onClick={() => {
              navigate(
                `/schedules/division/${encodeURIComponent(division.name)}/${encodeURIComponent(team.name)}`,
                { viewTransition: true },
              );
            }}
            sx={(theme) => ({
              cursor: "pointer",
              "&:hover": {
                backgroundColor:
                  colorScheme === "light"
                    ? theme.colors.gray[0]
                    : theme.colors.dark[6],
              },
            })}
          >
            <Text size="md" ta="center" className={classes.teamListText}>
              {team.name}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
    </>
  );
}
