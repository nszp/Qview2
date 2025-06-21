import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/rootRoute.ts";
import { useRef } from "react";
import { Flex, Text } from "@mantine/core";
import VideoJS from "@/components/VideoJS.tsx";
import type Player from "video.js/dist/types/player";

export const roomStreamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/streams/room/$roomName",
  component: function RoomStream() {
    const { roomName } = roomStreamRoute.useParams();

    const playerRef = useRef<Player>(null);

    const videoJsOptions = {
      autoplay: false,
      controls: true,
      fluid: true,
      responsive: true,
      liveui: true,
      sources: [
        // {
        //   src: `http://video.quizstuff.com:8080/hls/${roomName}.m3u8`,
        //   type: "application/x-mpegURL",
        // }, TODO: turn on for production
        {
          src: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
          type: "application/x-mpegURL",
        },
      ],
    };

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
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </>
    );
  },
});
