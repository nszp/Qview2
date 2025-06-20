import { tickertapeDataOptions, tournamentDataOptions } from "@/api.ts";
import ScheduleTable from "@/components/ScheduleTable.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Flex, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const statGroupTeamScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedules/division/$statGroupName/$teamName",
  loader: () => {
    return Promise.all([
      queryClient.ensureQueryData(tournamentDataOptions),
      queryClient.ensureQueryData(tickertapeDataOptions),
    ]);
  },
  component: function StatGroupTeamSchedule() {
    const { statGroupName, teamName } = statGroupTeamScheduleRoute.useParams();
    const [showRoundColumn, setShowRoundColumn] = useState(false);

    const { isLoading, error, data } = useSuspenseQuery(tournamentDataOptions);
    const {
      isLoading: isTickertapeLoading,
      error: tickertapeError,
      data: tickertapeData,
    } = useSuspenseQuery(tickertapeDataOptions);

    const statGroup = data?.statGroups.find((s) => s.name === statGroupName);
    const team = statGroup?.teams.find((t) => t.name === teamName);

    if (isLoading || isTickertapeLoading) {
      return <p>wait,,,,</p>;
    }

    if (error) {
      return <p>Error: {error.toString()}</p>;
    }

    if (tickertapeError) {
      return <p>Error: {tickertapeError.toString()}</p>;
    }

    if (!statGroup || !team) {
      return <Navigate to="/" replace />;
    }

    const quizzes = useMemo(() => {
      return team.quizzes.map((quiz) => {
        const tickertapeRound = tickertapeData.tickertape.find(
          (q) => q.round === quiz.round && q.room === quiz.room,
        );

        return tickertapeRound
          ? {
            ...tickertapeRound,
            time: quiz.time,
          }
          : quiz;
      });
    }, [team.quizzes, tickertapeData.tickertape]);

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
          <Text size="xl">{team.name}</Text>
          <Text size="md" mb="md" c="gray" onClick={() => setShowRoundColumn(!showRoundColumn)}>
            {statGroup.webName} Schedule
          </Text>
        </Flex>
        <ScheduleTable quizzes={quizzes} showRoundColumn={showRoundColumn} />
      </>
    );
  },
});
