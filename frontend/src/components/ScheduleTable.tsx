import { DataTable } from "mantine-datatable";
import type { TickertapeRoundData } from "@/types/data.ts";
import { Text } from "@mantine/core";
import * as dayjs from "dayjs";
import { getTeamColorsForTeamCount } from "@/utils/styleUtils.ts";
import { ScoresheetTeamIcon } from "@/components/ScoresheetTeamIcon.tsx";
import { CalendarIcon, CheckIcon, MonitorPlayIcon } from "lucide-react";
import { theme } from "@/theme.ts";

export default function ScheduleTable({
  quizzes,
}: { quizzes: TickertapeRoundData[] }) {
  return (
    <DataTable
      columns={[
        {
          accessor: "icon",
          title: "",
          textAlign: "center",
          width: "5%",
          render: (quiz) => {
            // if (!quiz.completed && !quiz.inProgress) {
            //   // Scheduled quiz
            //   return (
            //     <CalendarIcon size={24} style={{ marginBottom: "-5px" }} />
            //   );
            // }
            // if (quiz.inProgress) {
            // Quiz in progress
            // TODO: use a different icon and pull data from tickertape
            // also show stuff for in progress/completed quizzes like livestream and scoresheet
            return (
              <MonitorPlayIcon
                color={theme.colors.blue[4]}
                size={24}
                style={{
                  marginBottom: "-6px",
                }}
              />
            );
            // }
            if (quiz.completed) {
              // Completed quiz
              return (
                <CheckIcon
                  color={theme.colors.blue[7]}
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
          accessor: "time",
          title: "Time",
          textAlign: "center",
          width: "250px",
          noWrap: true,
          render: (quiz) =>
            dayjs.unix(quiz.time).format("ddd hh:mmA (MM/DD/YY)"),
        },
        {
          accessor: "room",
          title: "Room",
          textAlign: "center",
          width: "100px",
          noWrap: true,
        },
        {
          accessor: "round",
          title: "Round",
          textAlign: "center",
          width: "100px",
        },
        {
          accessor: "teams",
          title: "Teams",
          textAlign: "left",
          noWrap: true,
          render: (quiz) =>
            getTeamColorsForTeamCount(quiz.teams.length).map((color, index) => (
              <Text span key={color} fw={600}>
                <ScoresheetTeamIcon color={color} size={16} mr="4px" />
                {quiz.teams[index].name}
                {index < quiz.teams.length - 1 ? " vs. " : ""}
              </Text>
            )),
        },
      ]}
      records={quizzes.filter((quiz) => quiz.teams.length > 1)}
      striped
      withRowBorders
      withColumnBorders
      withTableBorder
      fz={{ base: "md", sm: "lg" }}
      w="100%"
      sx={{
        marginBottom: "4rem",
      }}
      idAccessor={"name"}
      pinFirstColumn
      emptyState={<Text>No scheduled quizzes yet.</Text>}
    />
  );
}
