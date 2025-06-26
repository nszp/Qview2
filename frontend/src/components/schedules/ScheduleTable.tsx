import { ScoresheetTeamIcon } from "@/components/scoresheets/ScoresheetTeamIcon.tsx";
import {
  roomStreamRoute,
  scoresheetRoute,
  statGroupTeamScheduleRoute,
} from "@/pages";
import { theme } from "@/theme.ts";
import type { TeamRoundData } from "@/types/data.ts";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";
import { Box, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import * as dayjs from "dayjs";
import {
  CalendarIcon,
  CheckIcon,
  HourglassIcon,
  MonitorPlayIcon,
  SheetIcon,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";

type Props = {
  statGroupName?: string;
  primaryTeamName?: string;
  showRoundColumn?: boolean;
  showCurrentQuestionColumn?: boolean;
} & (QuizWithTime | QuizWithoutTime);

type QuizWithTime = {
  quizzes: (TeamRoundData & {
    statGroupName?: string;
  })[];
  includeTime?: true;
};

type QuizWithoutTime = {
  quizzes: (Omit<TeamRoundData, "time"> & {
    time?: string;
    statGroupName?: string;
  })[];
  includeTime: false;
};

type ArrayElement<T> = T extends (infer U)[] ? U : never;

export default function ScheduleTable({
  quizzes,
  statGroupName,
  primaryTeamName,
  showRoundColumn = false,
  includeTime = true,
  showCurrentQuestionColumn = false,
}: Props) {
  const hasThreeTeams = useMemo(
    () => quizzes.some((quiz) => quiz.teams.length === 3),
    [quizzes],
  );

  const columns = useMemo(() => {
    const columns: DataTableColumn<ArrayElement<typeof quizzes>>[] = [
      {
        accessor: "icon",
        title: "",
        textAlign: "center",
        width: "1%",
        render: (quiz) => {
          if (!quiz.completed && !quiz.inProgress) {
            // Scheduled quiz
            return (
              <CalendarIcon
                color={theme.colors.gray[6]}
                size={24}
                style={{ marginBottom: "-5px" }}
              />
            );
          }
          if (quiz.inProgress) {
            // Quiz in progress
            return (
              <Text
                component={Link}
                to={roomStreamRoute.to}
                // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                params={{ roomName: quiz.room }}
              >
                <MonitorPlayIcon
                  color={theme.colors.blue[4]}
                  size={24}
                  style={{
                    marginBottom: "-6px",
                  }}
                />
              </Text>
            );
          }
          if (quiz.completed) {
            // Completed quiz
            return (
              <CheckIcon
                size={24}
                style={{
                  marginBottom: "-6px",
                }}
              />
            );
          }
        },
      },
      {
        accessor: "icon2",
        title: "",
        textAlign: "center",
        width: "1%",
        render: (quiz) => {
          if (quiz.completed || quiz.inProgress) {
            return (
              <Text
                component={Link}
                to={scoresheetRoute.to}
                // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                params={{ roundNumber: quiz.tdrri }}
              >
                <SheetIcon size={24} style={{ marginBottom: "-6px" }} />
              </Text>
            );
          }
          return (
            <HourglassIcon
              color={theme.colors.gray[6]}
              size={24}
              style={{ marginBottom: "-6px" }}
            />
          );
        },
      },
      {
        accessor: "time",
        title: "Time",
        textAlign: "center",
        width: "1%",
        noWrap: true,
        hidden: !includeTime,
        render: (quiz) => {
          if (quiz.inProgress) {
            return "In Progress";
          }
          if (quiz.completed) {
            return "Completed";
          }
          return dayjs
            .unix(Number.parseInt(quiz.time ?? ""))
            .subtract(2, "hour")
            .format("ddd hh:mmA (MM/DD/YY)");
        },
      },
      {
        accessor: "room",
        title: "Room",
        textAlign: "center",
        width: "1%",
        noWrap: true,
        render: (quiz) => {
          if (quiz.teams.some((team) => team.name === "BYE")) {
            return "";
          }
          return quiz.room;
        },
      },
      {
        hidden: !showCurrentQuestionColumn,
        accessor: "question",
        title: "Question",
        textAlign: "center",
        width: "100px",
      },
    ];
    columns.push({
      accessor: "teams1",
      title: "Teams",
      textAlign: "left",
      width: "1%", // force column not to take remaining space
      noWrap: true,
      render: (quiz) => {
        if (quiz.teams.some((team) => team.name === "Bye")) {
          return (
            <Text span>
              <ScoresheetTeamIcon
                color={theme.colors.gray[6]}
                size={16}
                style={{
                  marginRight: "0.25rem",
                }}
              />
              Bye round
            </Text>
          );
        }

        const team = quiz.teams[0];

        const winners: string[] = [];

        const sortedByScore = [...quiz.teams].sort((a, b) => b.score - a.score);

        winners.push(sortedByScore[0].name);

        if (
          sortedByScore.length > 2 &&
          sortedByScore[0].score === sortedByScore[1].score
        ) {
          // Jank way to handle ties (we don't have placement information in this data)
          winners.push(sortedByScore[1].name);
        }

        const color = getTeamColorsForTeamCount(quiz.teams.length)[0];

        return (
          <Text span>
            <Text span fw={winners.includes(team.name) ? 700 : 500}>
              <ScoresheetTeamIcon
                color={color}
                size={16}
                style={{
                  marginRight: "0.25rem",
                }}
              />
              {primaryTeamName === team.name && (
                <Text span fw={winners.includes(team.name) ? 700 : 500}>
                  {team.name}
                </Text>
              )}
              {primaryTeamName !== team.name && (
                <Text
                  component={Link}
                  to={statGroupTeamScheduleRoute.to}
                  fw={winners.includes(team.name) ? 700 : 500}
                  params={{
                    // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                    statGroupName: statGroupName
                      ? statGroupName
                      : quiz.statGroupName,
                    teamName: team.name,
                  }}
                >
                  {team.name}
                </Text>
              )}

              {(quiz.inProgress || quiz.completed) && ` (${team.score})`}
            </Text>
          </Text>
        );
      },
    });

    columns.push({
      accessor: "teams1.5",
      title: "",
      textAlign: "center",
      width: "1%",
      render: (quiz) => {
        if (quiz.teams.some((team) => team.name === "Bye")) {
          return "";
        }
        return "vs.";
      },
    });

    columns.push({
      accessor: "teams2",
      title: "",
      textAlign: "left",
      width: "1%", // force column not to take remaining space
      noWrap: true,
      render: (quiz) => {
        if (quiz.teams.some((team) => team.name === "Bye")) {
          return "";
        }

        const team = quiz.teams[1];

        const winners: string[] = [];

        const sortedByScore = [...quiz.teams].sort((a, b) => b.score - a.score);

        winners.push(sortedByScore[0].name);

        if (
          sortedByScore.length > 2 &&
          sortedByScore[0].score === sortedByScore[1].score
        ) {
          // Jank way to handle ties (we don't have placement information in this data)
          winners.push(sortedByScore[1].name);
        }

        const color = getTeamColorsForTeamCount(quiz.teams.length)[1];

        return (
          <Text span>
            <Text span fw={winners.includes(team.name) ? 700 : 500}>
              <ScoresheetTeamIcon
                color={color}
                size={16}
                style={{
                  marginRight: "0.25rem",
                }}
              />
              {primaryTeamName === team.name && (
                <Text span fw={winners.includes(team.name) ? 700 : 500}>
                  {team.name}
                </Text>
              )}
              {primaryTeamName !== team.name && (
                <Text
                  component={Link}
                  to={statGroupTeamScheduleRoute.to}
                  fw={winners.includes(team.name) ? 700 : 500}
                  params={{
                    // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                    statGroupName: statGroupName
                      ? statGroupName
                      : quiz.statGroupName,
                    teamName: team.name,
                  }}
                >
                  {team.name}
                </Text>
              )}

              {(quiz.inProgress || quiz.completed) && ` (${team.score})`}
            </Text>
          </Text>
        );
      },
    });

    if (hasThreeTeams) {
      columns.push({
        accessor: "teams2.5",
        title: "",
        textAlign: "center",
        width: "50px",
        render: (quiz) => {
          if (
            quiz.teams.some((team) => team.name === "Bye") ||
            quiz.teams.length < 3
          ) {
            return "";
          }
          return "Bye";
        },
      });

      columns.push({
        accessor: "teams3",
        title: "",
        textAlign: "left",
        width: "1%", // force column not to take remaining space
        noWrap: true,
        render: (quiz) => {
          if (
            quiz.teams.some((team) => team.name === "Bye") ||
            quiz.teams.length < 3
          ) {
            return "";
          }

          const team = quiz.teams[2];

          const winners: string[] = [];

          const sortedByScore = [...quiz.teams].sort(
            (a, b) => b.score - a.score,
          );

          winners.push(sortedByScore[0].name);

          if (
            sortedByScore.length > 2 &&
            sortedByScore[0].score === sortedByScore[1].score
          ) {
            // Jank way to handle ties (we don't have placement information in this data)
            winners.push(sortedByScore[1].name);
          }

          const color = getTeamColorsForTeamCount(quiz.teams.length)[2];

          return (
            <Text span>
              <Text span fw={winners.includes(team.name) ? 700 : 500}>
                <ScoresheetTeamIcon
                  color={color}
                  size={16}
                  style={{
                    marginRight: "0.25rem",
                  }}
                />
                {primaryTeamName === team.name && (
                  <Text span fw={winners.includes(team.name) ? 700 : 500}>
                    {team.name}
                  </Text>
                )}
                {primaryTeamName !== team.name && (
                  <Text
                    component={Link}
                    to={statGroupTeamScheduleRoute.to}
                    fw={winners.includes(team.name) ? 700 : 500}
                    params={{
                      // @ts-ignore (type safety unfortunately doesn't work with polymorphic links)
                      statGroupName: statGroupName
                        ? statGroupName
                        : quiz.statGroupName,
                      teamName: team.name,
                    }}
                  >
                    {team.name}
                  </Text>
                )}

                {(quiz.inProgress || quiz.completed) && ` (${team.score})`}
              </Text>
            </Text>
          );
        },
      });
    }

    columns.push({
      accessor: "round",
      title: "Round",
      textAlign: "center",
      width: "110px",
      hidden: !showRoundColumn,
    });
    return columns;
  }, [
    statGroupName,
    primaryTeamName,
    showRoundColumn,
    includeTime,
    showCurrentQuestionColumn,
    hasThreeTeams,
  ]);

  return (
    <Box
      mb="md"
      mih="50vh"
      maw="75em"
      mx="auto"
      sx={(theme) => ({
        marginBottom: theme.spacing.md,
        minHeight: "50vh",
        maxWidth: hasThreeTeams ? "100%" : "75em",
        marginLeft: "auto",
        marginRight: "auto",
      })}
    >
      <DataTable
        columns={columns}
        records={quizzes.filter((quiz) => quiz.teams.length > 1)}
        striped
        withRowBorders
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        idAccessor={({ round, room }) => `${round}-${room}`}
        pinFirstColumn
        emptyState={<Text>No scheduled quizzes yet.</Text>}
      />
    </Box>
  );
}
