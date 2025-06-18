import { statGroupTeamScheduleRoute } from "@/routes.ts";
import { largerThan, smallerThan } from "@/utils/styleUtils.ts";
import {
  Button,
  Collapse,
  Paper,
  SimpleGrid,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { StatGroupData } from "../types/data.ts";

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

export function StatGroupTeamList({
  statGroup,
  openByDefault,
}: { statGroup: StatGroupData; openByDefault: boolean }) {
  const navigate = useNavigate();

  const colorScheme = useComputedColorScheme("light");
  const { classes } = useStyles();
  const [open, setOpen] = useState(openByDefault);

  const sortedTeams = useMemo(() => {
    return [...statGroup.teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [statGroup.teams]);

  return (
    <>
      <Button
        size="md"
        mb="sm"
        pb="xs"
        ta="center"
        w="50%"
        variant="transparent"
        sx={(theme) => ({
          whiteSpace: "nowrap",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor:
            colorScheme === "light"
              ? theme.colors.gray[3]
              : theme.colors.dark[4],
          color: "unset",
        })}
        onClick={() => setOpen(!open)}
      >
        {statGroup.webName}
        {open ? <ChevronDown /> : <ChevronRight />}
        {/* TODO: make it a transition or something  */}
      </Button>
      <Collapse in={open} w="100%">
        <SimpleGrid
          mb="md"
          cols={{
            base: 1,
            xxs: Math.min(2, statGroup.teams.length),
            md: Math.min(4, statGroup.teams.length),
            lg: Math.min(6, statGroup.teams.length),
            xl: Math.min(8, statGroup.teams.length),
          }}
          w="100%"
        >
          {sortedTeams.map((team) => (
            <Paper
              withBorder
              shadow="sm"
              radius="md"
              py="sm"
              key={team.name}
              onClick={() => {
                navigate({
                  to: statGroupTeamScheduleRoute.to,
                  params: {
                    statGroupName: statGroup.name,
                    teamName: team.name,
                  },
                  viewTransition: true,
                });
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
      </Collapse>
    </>
  );
}
