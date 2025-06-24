import { tournamentDataOptions } from "@/api.ts";
import { queryClient, rootRoute } from "@/rootRoute.ts";
import { Flex, SimpleGrid, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useMemo } from "react";
import RoomEmbed from "@/components/streams/RoomEmbed.tsx";

export const allStreamsRoute = createRoute({
  // getParentRoute: () => rootRoute,
  getParentRoute: () => rootRoute,
  path: "/streams/all/$half",
  loader: () => queryClient.ensureQueryData(tournamentDataOptions),
  head: () => ({
    meta: [
      {
        title: "All Livestreams",
      },
    ],
  }),
  component: function RoomStream() {
    const { half } = allStreamsRoute.useParams();
    const { isPending, error, data } = useSuspenseQuery(tournamentDataOptions);

    const roomsList = useMemo(() => {
      const roomsList = new Set<string>();
      if (!data) return roomsList;
      for (const quiz of data.statGroups
        .flatMap((statGroup) => statGroup.teams)
        .flatMap((team) => team.quizzes)) {
        roomsList.add(quiz.room);
      }
      if (half === "first") {
        return [...roomsList].filter((_, i) => i % 2 === 0);
      }
      return [...roomsList].filter((_, i) => i % 2 !== 0);
    }, [data]);

    // useEffect(() => {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 45000);
    // }, []);

    return (
      <>
        <Flex
          justify="center"
          align="center"
          mb="md"
          direction="column"
          sx={(_, __) => ({
            // [u.smallerThan("sm")]: {
            width: "100%",
            // },
          })}
        >
          <Text size="xl">All Room Streams</Text>
        </Flex>

        <SimpleGrid cols={4}>
          {[...roomsList].map((roomName) => (
            <RoomEmbed roomName={roomName} key={roomName} />
          ))}
        </SimpleGrid>
      </>
    );
  },
});
