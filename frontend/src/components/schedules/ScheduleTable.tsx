import { ScoresheetTeamIcon } from "@/components/scoresheets/ScoresheetTeamIcon.tsx";
import { roomStreamRoute, scoresheetRoute } from "@/pages";
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
import { DataTable } from "mantine-datatable";

type Props = {
  showRoundColumn?: boolean;
  showCurrentQuestionColumn?: boolean;
} & (QuizWithTime | QuizWithoutTime);

type QuizWithTime = {
  quizzes: TeamRoundData[];
  includeTime?: true;
};

type QuizWithoutTime = {
  quizzes: (Omit<TeamRoundData, "time"> & { time?: string })[];
  includeTime: false;
};

export default function ScheduleTable({
  quizzes,
  showRoundColumn = false,
  includeTime = true,
  showCurrentQuestionColumn = false,
}: Props) {
  return (
    <Box mb="md" mih="50vh">
      <DataTable
        columns={[
          {
            accessor: "icon",
            title: "",
            textAlign: "center",
            width: "50px",
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
            width: "50px",
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
            width: "250px",
            noWrap: true,
            hidden: !includeTime,
            render: (quiz) =>
              dayjs
                .unix(Number.parseInt(quiz.time ?? ""))
                .format("ddd hh:mmA (MM/DD/YY)"),
          },
          {
            accessor: "room",
            title: "Room",
            textAlign: "center",
            width: "110px",
            noWrap: true,
          },
          {
            hidden: !showCurrentQuestionColumn,
            accessor: "question",
            title: "Question",
            textAlign: "center",
            width: "100px",
          },
          {
            accessor: "teams",
            title: "Teams",
            textAlign: "left",
            noWrap: true,
            render: (quiz) => {
              const winners: string[] = [];

              if (quiz.completed) {
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
              }

              return getTeamColorsForTeamCount(quiz.teams.length).map(
                (color, index) => (
                  <Text span key={color}>
                    <Text
                      span
                      fw={winners.includes(quiz.teams[index].name) ? 600 : 500}
                    >
                      <ScoresheetTeamIcon
                        color={color}
                        size={16}
                        style={{
                          marginRight: "0.25rem",
                        }}
                      />
                      {quiz.teams[index].name}
                      {quiz.question > 0 && ` (${quiz.teams[index].score})`}
                    </Text>
                    {index < quiz.teams.length - 1 ? " vs. " : ""}
                  </Text>
                ),
              );
            },
          },
          {
            accessor: "round",
            title: "Round",
            textAlign: "center",
            width: "110px",
            hidden: !showRoundColumn,
          },
        ]}
        records={quizzes.filter((quiz) => quiz.teams.length > 1)}
        striped
        withRowBorders
        fz={{ base: "md", sm: "lg" }}
        w="100%"
        minHeight={150}
        idAccessor="round"
        pinFirstColumn
        emptyState={<Text>No scheduled quizzes yet.</Text>}
      />
    </Box>
  );
}
