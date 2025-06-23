import { scoresheetDataOptions, tickertapeDataOptions } from "@/api.ts";
import ScoresheetTimeline from "@/components/scoresheets/ScoresheetTimeline.tsx";
import { queryClient, rootRoute } from "@/rootRoute.tsx";
import styled from "@emotion/styled";
import { Flex, Skeleton, Text } from "@mantine/core";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import type Player from "video.js/dist/types/player";

const VideoJS = React.lazy(() => import("@/components/streams/VideoJS.tsx"));

export const roomStreamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/streams/room/$roomName",
  loader: ({ params: { roomName } }) =>
    queryClient.ensureQueryData(tickertapeDataOptions).then((data) => {
      const roundTdrri = data.tickertape.find(
        (round) => round.room.toLowerCase() === roomName.toLowerCase(),
      )?.tdrri;

      return roundTdrri
        ? queryClient.ensureQueryData(
            scoresheetDataOptions(roundTdrri.toString()),
          )
        : undefined;
    }),
  head: ({ params: { roomName } }) => ({
    meta: [
      {
        title: `${roomName} Livestream`,
      },
    ],
  }),
  component: function RoomStream() {
    const { roomName } = roomStreamRoute.useParams();
    const { isPending: isTickertapePending, data: tickertapeData } =
      useSuspenseQuery(tickertapeDataOptions);

    const roundTdrri = tickertapeData.tickertape.find(
      (round) => round.room.toLowerCase() === roomName.toLowerCase(),
    )?.tdrri;

    const { isPending: isScoresheetPending, data: scoresheetData } = useQuery({
      ...scoresheetDataOptions(roundTdrri?.toString() || ""),
      enabled: !isTickertapePending && roundTdrri !== undefined,
    });

    const [currentTime, setCurrentTime] = useState(
      Math.floor(Date.now() / 1000),
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(Math.floor(Date.now() / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const playerRef = useRef<Player>(null);

    const videoJsOptions = useMemo(
      () => ({
        autoplay: false,
        controls: true,
        fill: true,
        responsive: true,
        liveui: true,
        sources: [
          {
            src: `http://video.q2025.org:8080/hls/${roomName.replace(/ /g, "")}.m3u8`,
            type: "application/x-mpegURL",
          },
          //{
          //  src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
          //type: "application/x-mpegURL",
          // },
        ],
      }),
      [roomName],
    );

    const handlePlayerReady = (player: Player) => {
      playerRef.current = player;

      // You can handle player events here, for example:
      // player.on('waiting', () => {
      //   videojs.log('player is waiting');
      // });
      //
      // player.on('dispose', () => {
      //   videojs.log('player will dispose');
      // });
    };

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
          <Text size="xl">{roomName}</Text>
          <Text size="md" c="gray">
            Livestream
          </Text>
        </Flex>

        <Suspense
          fallback={
            <Skeleton
              style={{
                height: "auto",
                maxHeight: "calc(100lvh - 200px)",
                minHeight: "100px",
                margin: "0 auto",
                aspectRatio: "16/9",
                width: "auto",
              }}
            />
          }
        >
          <VideoJS options={videoJsOptions} />
        </Suspense>

        {tickertapeData && !roundTdrri && (
          <Text size="md" mb="md" c="gray" ta="center">
            No in progress round found for this room.
          </Text>
        )}
        {roundTdrri && isScoresheetPending && (
          <Text size="md" mb="md" c="gray" ta="center">
            Loading scoresheet...
          </Text>
        )}
        {scoresheetData && (
          <>
            <Text size="md" mb="md" c="gray" ta="center">
              Scoresheet updated{" "}
              {currentTime - Number.parseInt(scoresheetData.generationQueuedAt)}{" "}
              seconds ago
            </Text>
            <ScoresheetTimeline data={scoresheetData} />
          </>
        )}
      </>
    );
  },
});
