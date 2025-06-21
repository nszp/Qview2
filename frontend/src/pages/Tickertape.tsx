import { tickertapeDataOptions, tournamentDataOptions } from "@/api.ts";
import { StreamCard } from "@/components/homepage/StreamCards.tsx";
import ScheduleTable from "@/components/schedules/ScheduleTable.tsx";
import TickertapeCard from "@/components/tickertape/TickertapeCard.tsx";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import type { TeamRoundData } from "@/types/data.ts";
import { Flex, SimpleGrid, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const tickertapeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/overview",
  loader: () => {
    return Promise.all([
      queryClient.ensureQueryData(tournamentDataOptions),
      queryClient.ensureQueryData(tickertapeDataOptions),
    ]);
  },
  component: function Tickertape() {
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
          <Text size="xl">Happening Now</Text>
          <Text
            size="md"
            mb="md"
            c="gray"
            onClick={() => setShowRoundColumn(!showRoundColumn)}
          >
            Rounds in Progress
          </Text>
        </Flex>
        <ScheduleTable
          quizzes={tickertapeData.tickertape}
          includeTime={false}
          showCurrentQuestionColumn={true}
          showRoundColumn={showRoundColumn}
        />
      </>
    );
  },
});
