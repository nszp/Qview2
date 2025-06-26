import { tickertapeDataOptions, tournamentDataOptions } from "@/api.ts";
import ScheduleTable from "@/components/schedules/ScheduleTable.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import type { TeamRoundData } from "@/types/data.ts";
import { Flex, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const roomScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules/room/$roomName",
  loader: () => {
    return Promise.all([
      queryClient.ensureQueryData(tournamentDataOptions),
      queryClient.ensureQueryData(tickertapeDataOptions),
    ]);
  },
  component: function RoomSchedule() {
    const { roomName } = roomScheduleRoute.useParams();
    const [showRoundColumn, setShowRoundColumn] = useState(false);

    const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);
    const {
      isLoading: isTickertapeLoading,
      error: tickertapeError,
      data: tickertapeData,
    } = useSuspenseQuery(tickertapeDataOptions);

    if (isLoading || isTickertapeLoading) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    if (tickertapeError) {
      return <p>Error: {tickertapeError.toString()}</p>;
    }

    const quizzes = useMemo(() => {
      const lowerRoomName = roomName.toLowerCase();
      if (!data || !tickertapeData) return [];
      const addedRounds = new Set<string>();
      const quizzes: TeamRoundData[] = [];
      for (const quiz of data.statGroups
        .flatMap((statGroup) => statGroup.teams)
        .flatMap((team) => team.quizzes)) {
        if (quiz.room.toLowerCase() !== lowerRoomName) continue;
        if (addedRounds.has(quiz.round)) continue;
        addedRounds.add(quiz.round);
        quizzes.push(quiz);
      }

      console.log("quizzes", quizzes);
      console.log("addedRounds", addedRounds);

      const currentTime = Math.floor(Date.now() / 1000) - 60 * 30; // Add half an hour

      const sortedQuizzes = quizzes
        .sort((a, b) => Number.parseInt(a.time) - Number.parseInt(b.time))
        .map((quiz) => {
          const tickertapeRound = tickertapeData.tickertape.find(
            (q) => q.round === quiz.round && q.room === quiz.room,
          );

          return tickertapeRound
            ? {
                ...tickertapeRound,
                time: quiz.time,
                inProgress: tickertapeRound.question <= 20,
                completed: tickertapeRound.question > 20,
              }
            : {
                ...quiz,
                inProgress: false,
                completed: currentTime >= Number.parseInt(quiz.time),
              };
        });

      // Set all of the rounds before the first one that is inProgress to completed
      const firstInProgressIndex = sortedQuizzes.findIndex((q) => q.inProgress);
      if (firstInProgressIndex === -1) {
        return sortedQuizzes;
      }
      for (let i = 0; i < firstInProgressIndex; i++) {
        sortedQuizzes[i].completed = true;
        sortedQuizzes[i].inProgress = false;
      }

      return sortedQuizzes;
    }, [data, tickertapeData, roomName]);

    return (
      <>
        <Flex
          justify="center"
          align="center"
          mb="md"
          direction="column"
          sx={(_, u) => ({
            [u.smallerThan("sm")]: {
              width: "100%",
            },
          })}
        >
          <Text size="xl">{quizzes[0].room}</Text>
          <Text
            size="md"
            mb="md"
            c="gray"
            onClick={() => setShowRoundColumn(!showRoundColumn)}
          >
            {quizzes[0].room} Schedule
          </Text>
        </Flex>
        <ScheduleTable quizzes={quizzes} showRoundColumn={showRoundColumn} />
      </>
    );
  },
});
