import { DataTable } from "mantine-datatable";
import type { TeamRoundData } from "@/types/data.ts";
import { Text } from "@mantine/core";
import * as dayjs from "dayjs";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import {
  CalendarIcon,
  CheckIcon,
  HourglassIcon,
  MonitorPlayIcon,
  SheetIcon,
} from "lucide-react";
import { theme } from "@/theme.ts";
import { Link } from "@tanstack/react-router";
import { roomStreamRoute, scoresheetRoute } from "@/pages";

export default function ScheduleTable({
  quizzes,
}: {
  quizzes: TeamRoundData[];
}) {
  return (
    <DataTable
      columns={[
        {
          accessor: "icon",
          title: "",
          textAlign: "center",
          width: "50px",
          render: (quiz) => {
            console.log(quiz);
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
          render: (quiz) =>
            dayjs
              .unix(Number.parseInt(quiz.time))
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
          accessor: "round",
          title: "Round",
          textAlign: "center",
          width: "110px",
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
      ]}
      records={quizzes.filter((quiz) => quiz.teams.length > 1)}
      striped
      withRowBorders
      withColumnBorders
      withTableBorder
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{ marginBottom: "4rem" }}
      idAccessor="round"
      pinFirstColumn
      emptyState={<Text>No scheduled quizzes yet.</Text>}
    />
  );
}
